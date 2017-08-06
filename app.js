const _ 				= require('lodash');
const fs 				= require("fs");
const i18n 				= require('i18n');
const marked 			= _.partialRight(require('marked').inlineLexer, []);
const express 			= require('express');
const bodyParser 		= require('body-parser');
const cookieParser 		= require('cookie-parser');
const template_engines 	= require('consolidate');

const app 				= express();

// app-wide data store (accessed from templates)
let data = {
	app,

	base: 		 '',
	getting: 	 '',
	language: 	 'en-US',

	include: 	 file => _.template(fs.readFileSync(app.get('views') + '/' + file, 'utf8'))(data),
	getLanguage: () => data.language.split('-').join(' (').toUpperCase() + ')',

	page: 		 {
				 	styles:  	[],
				 	scripts: 	[],
				 	uri: 		''
				 }
};

// config translation engine
i18n.configure({
	defaultLocale: 	data.language,
    directory: 		__dirname + '/locales',
    locales: 		['en-US', 'en-GB', 'de-DE'],
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

  	next();
});

// home route
app.get('/', (req, res) => {
	data.page.uri = 'home.html';
	data.page.styles = ['css/home.css'];
	data.page.scripts = ['js/main.js', 'js/home.js'];

	data.__ = req.__;
	data.marked = (...arguments) => marked(req.__.apply(req, arguments));

	res.render('page.html', data);
});

// route for reactive translation retrieval
app.post('/translate', (req, res) => {
	const keys = _.get(req.body, 'keys', []);
	const language = _.get(req.body, 'language');
	const transformers = _.get(req.body, 'transformers', []);
	const _ALLOWED_TRANSFORMERS = ['_', 'marked'];

	switchLang(req, res, language);

	res.json({ 
		values: _.map(	keys, 
						(key, i) => {
							var value = data.__({phrase: key, locale: language});
							if(transformers[i]) {
								if(_ALLOWED_TRANSFORMERS.indexOf(transformers[i].split('.')[0]) > -1) {
									return eval(transformers[i])(value);
								}
								return value;
							}
							return value;
						}
					) 
	});
});

// hat routes
app.get('/hats/:hat', (req, res) => {

	var hat = _.camelCase(req.params.hat);
	var title = _.startCase(hat.split('-').join(' ').toLowerCase());

	_.extend(data.page, {
		uri: 		'hat.html',
		styles: 	['css/pages.css'],
		scripts: 	['js/main.js'],
		title: 		`Dan Borufka, ${title}`,
	});

	data.__ = req.__;
	data.marked = (...arguments) => marked(req.__.apply(req, arguments));
	data.hat = hat;

	if(fs.existsSync(`views/hats/${hat}.html`)) {
		data.template = `hats/${hat}.html`;
	} else {
		data.template = false;
	}

	res.render('page.html', data);
});

// shortcut routes
app.get('/:letter([a-zA-Z])', (req, res) => {
	var _letters = {
		a: 'animator', 
		c: 'copywriter', 
		d: 'designer', 
		l: 'linguist', 
		m: 'marketeer', 
		c: 'math-hat', 
		p: 'party-hat'
	};
	
	var letter = req.params.letter.toLowerCase();
	res.redirect(`/hats/${_letters[letter]}`);
});

// go!
app.listen(3000, () => {
  console.log('Portfolio running on 3000');
});