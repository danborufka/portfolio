const _ 				= require('lodash');
const fs 				= require("fs");
const i18n 				= require('i18n');
const marked 			= _.partialRight(require('marked').inlineLexer, []);
const express 			= require('express');
const nodemailer		= require('nodemailer');
const bodyParser 		= require('body-parser');
const compression 		= require('compression');
const cookieParser 		= require('cookie-parser');
const template_engines 	= require('consolidate');

const app 				= express();

const _letters = {
	d: 'designer', 
	l: 'linguist', 
	c: 'math-hat', 
	p: 'party-hat',
	m: 'marketeer', 
	a: 'animator', 
	c: 'copywriter'
};
const _languages = {
	'en-US':'English (United States)', 
	'de-DE':'Deutsch (Deutschland)', 
	'fr-FR':'Français (Françe)'
};

const _pages = ['designer', 'linguist', 'mathHat','partyHat', 'designer'];

// app-wide data store (accessed from templates)
let data = {
	app,

	__translations: {},

	base: 		 '',
	getting: 	 '',
	language: 	 'en-US',
	languages: 	 _languages,

	include: 	 file => _.template(fs.readFileSync(app.get('views') + '/' + file, 'utf8'))(data),
	getLanguage: () => data.language.split('-').join(' (').toUpperCase() + ')',

	__current(translation) {
		return translation + '.' + _.get(data.__translations, translation, 0);
	},
	__next(translation) {
		if(_.has(data.__translations, translation)) {
			data.__translations[translation]++;
		} else {
		 	data.__translations[translation] = 0;
		}
		return translation + '.' + data.__translations[translation];
	},

	page: 		 {
				 	styles:  	[],
				 	scripts: 	[],
				 	uri: 		''
				 }
};

_.utf8startCase = str => _.map((str).split(" "), _.upperFirst).join(" ");

// config translation engine
i18n.configure({
	defaultLocale: 	data.language,
    directory: 		__dirname + '/locales',
    locales: 		Object.keys(_languages),
	objectNotation: true,
	register: data
});

// use lodash's rendering engine for templated HTML rendering
app.engine('html', template_engines.lodash);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// serve static client-side files (css/js/img/…)
app.use(express.static( __dirname + '/public' ));
app.use(i18n.init);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());

function _createMarked(req) {
	return (...arguments) => marked(req.__.apply(req, arguments));
}

function switchLang(req, res, language) {
	if(language) {
		res.cookie('polygoat-portfolio-language', language);
		data.language = language;
		data.setLocale(language);
		req.setLocale(language);
		res.setLocale(language);
	}
}

// router middleware to read language from cookie
app.use(function switchLanguageMW(req, res, next) {
	var language = _.get(req.cookies, 'polygoat-portfolio-language');
	switchLang(req, res, language);

	data.__translations = {};	// reset translations counters
  	next();
});

// home route
app.get('/', (req, res) => {
	data.page.uri = 'home.html';
	data.page.styles = ['css/home.css'];
	data.page.scripts = ['js/libs/Danimator.min.js'];

	data.isLocal = req.headers.host === 'localhost:3000';

	data.__ = req.__;
	data.marked = _createMarked(req);

	res.render('page.html', data);
});

// route for reactive translation retrieval
app.post('/translate', (req, res) => {
	const keys 					= _.get(req.body, 'keys', 		  []);
	const language 				= _.get(req.body, 'language' 		);
	const transformers 			= _.get(req.body, 'transformers', []);
	const _ALLOWED_TRANSFORMERS = ['_', 'marked','destination'];
	let response_json 			= { destinations: [] };

	switchLang(req, res, language);

	response_json.values = _.map(	keys, 
									(key, i) => {
										const value = data.__({phrase: key, locale: language});

										if(transformers[i]) {
											const parts = transformers[i].split('.');

											if(_ALLOWED_TRANSFORMERS.indexOf(parts[0]) > -1) {

												if(parts[0] === 'destination') {
													response_json.destinations[i] = parts.slice(1).join('.');
													return value;
												}
												return eval(transformers[i])(value);
											}
											return value;
										}
										return value;
									}
								);
	res.json(response_json);
});

app.post('/contact', (req, res) => {
	const name 		= req.body.contact_name;
	const email 	= req.body.contact_email;
	const message 	= req.body.contact_message;

	let transporter = nodemailer.createTransport({
	    host: 	'smtp.gmail.com',
	    port: 	465,
	    secure: true, 	// secure:true for port 465, secure:false for port 587
	    auth: {
	        user: 'danborufka@gmail.com',
	        pass: 'yac682Goo'
	    }
	});

	let mailOptions = {
	    from: 		`"${name} ☺" <${email}>`, 
	    to: 		'dan@polygoat.org',
	    subject: 	'New message from Polygoat contact form',
	    text: 		message
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
	    if (error) {
	        return console.log(error);
	    }

	    data.__ = req.__;
		data.marked = _createMarked(req);
		data.page.styles = data.page.scripts = [];

	    _.extend(data.page, {
			uri: 		'text-page.html',
			styles: 	['css/pages.css'],
			headline: 	 data.__('contact.thanks'),
			subheadline: data.__('contact.sent'),
			title: 		data.__('contact.thanks'),
			body: 		data.__('contact.body') + '<script>setTimeout(function(){location.href="/";}, 3000);</script>'
		});
	    
		res.render('page.html', data);
	});
});

// hat routes
app.get('/hats/:hat', (req, res) => {

	const hat = _.camelCase(req.params.hat);
	const title = _.startCase(hat.split('-').join(' ').toLowerCase());

	_.extend(data.page, {
		uri: 		'hat.html',
		scripts: 	[],
		styles: 	['css/pages.css'],
		title: 		`Dan Borufka, ${title}`
	});

	data.__ = req.__;
	data.marked = _createMarked(req);
	data.hat = hat;

	const nextHat = _pages.indexOf(hat);

	if(nextHat > -1) {
		data.nextHat = _pages[nextHat + 1];
	} else {
		data.nextHat = false;
	}

	if(fs.existsSync(`views/hats/${hat}.html`)) {
		data.template = `hats/${hat}.html`;
	} else {
		data.template = false;
	}

	res.render('page.html', data);
});

// shortcut routes
app.get('/:letter([a-zA-Z])', (req, res) => {
	var letter = req.params.letter.toLowerCase();
	res.redirect(`/hats/${_letters[letter]}`);
});

// go!
app.listen(3000, () => {
  console.log('Portfolio running on 3000');
});