<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>
		<?php if(isset($page['title'])): ?>
			<?php echo $page['title']; ?>
		<?php else: ?>
			Dan Borufka, Polygoat
		<?php endif; ?>
	</title>
	<base href="<?php echo $page['base']; ?>/" />
	<link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	<?php if(isset($page['styles'])): ?>
<?php foreach($page['styles'] as $style): ?><link rel="stylesheet" type="text/css" href="<?php echo $style; ?>">
<?php endforeach; ?><?php endif; ?></head>
<body>
	<iframe src="responsive-goat.html" id="responsive-goat"></iframe>
	<div class="modal fade" id="languageModal" tabindex="-1" role="dialog" aria-labelledby="languageModalLbl" aria-hidden="true">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <h4 class="modal-title" id="languageModalLbl">Select a language</h4>
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	          <span aria-hidden="true">&times;</span>
	        </button>
	      </div>
	      <div class="modal-body">
	        <ul class="select languages">
	        	<li class="selected" data-value="en-US"><a href="#en-US">English (United States)</a></li>
	        	<li data-value="en-GB"><a href="#en-GB">English (Great Britain)</a></li>
	        </ul>
	      </div>
	      <div class="modal-footer">
	        <a href="close" class="cancel" data-dismiss="modal">Cancel</a>
	      </div>
	    </div>
	  </div>
	</div>
	<div class="container-fluid" id="main">