<!-- 
	<?php echo str_repeat("\n", 10); ?>
	Interested in the source code? 									<?php echo str_repeat("\n", 50); ?>
	I get that, but at least I'm gonna make you scroll for it! 		<?php echo str_repeat("\n", 50); ?>
	Come on… 														<?php echo str_repeat("\n", 70); ?>
	Keep going! 													<?php echo str_repeat("\n", 100); ?>
	Almost there! 													<?php echo str_repeat("\n", 150); ?>
	Aren't your fingers numb from all the scrolling?				<?php echo str_repeat("\n", 300); ?>
	Alright, you deserve it! 										<?php echo str_repeat("\n", 30); ?>
	Here it goes:
--><?php 

	global $page;
	$page = [
		'base' => '/polygoat/portfolio',
		'scripts' => [], 
		'styles' => []
	];

	require 'inc/vendor/autoload.php';
	$router = new AltoRouter();
	$router->setBasePath($page['base']);

	$router->addMatchTypes(array('letter' => '[a-zA-Z]'));

	$router->map( 'GET', '/', function() {
		global $page;
		$page['scripts'][] = 'js/home.js';
		$page['styles'][]  = 'css/home.css';

	    return __DIR__.'/views/home.php';
	});

	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	// hat pages
	$router->map( 'GET', '/hats/[:hat]', function($hat) {
		global $page;

		$title = ucwords(strtolower(implode(' ', explode('-', $hat))));

	    $page['styles'][] = 'css/pages.css';
		$page['uri'] = __DIR__."/views/hats/$hat.php";
	    $page['headline'] = "The $title";
	    $page['title'] = "Dan Borufka, $title";

	    ob_start();
	    include $page['uri'];
	    ob_end_clean();

	    return __DIR__.'/views/page.php';
	});

	// shortcut routes
	$router->map( 'GET', '/[letter:letter]$', function($letter) {
		global $page;
		$letters = [
			'a' => 'animator', 
			'c' => 'copywriter', 
			'd' => 'designer', 
			'l' => 'linguist', 
			'm' => 'marketeer', 
			'c' => 'math-hat', 
			'p' => 'party-hat'
		];
		header("Location: $page[base]/hats/$letters[$letter]");
	});

	$match = $router->match();

	// call closure or throw 404 status
	if( $match && is_callable( $match['target'] ) ) {
        $callback = call_user_func_array( $match['target'], $match['params'] );
		require __DIR__.'/views/header.php';
		if($callback) {
			require $callback;
		}
        require __DIR__.'/views/footer.php';
	} else {
        // no route was matched
        header( $_SERVER["SERVER_PROTOCOL"] . ' 404 Not Found');
	}
?>