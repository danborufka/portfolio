<?php global $page; ?>
<div class="row">
	<div class="col header">
		<h1><?php echo $page['headline']; ?></h1>
		<a href="#languages" id="languageSwitch" data-toggle="modal" data-target="#languageModal" title="Switch language">EN (US)</a>
		<div class="brand">
			<a href="." title="Back home"><img src="img/dan.png" alt="Dan, the Polygoat" height="100"></a>
		</div>
	</div>
</div>
<?php if(isset($page['subheadline'])): ?>
<div class="row bar">
	<?php echo $page['subheadline']; ?>
</div>
<?php endif; ?>
<div class="row paper">
	<?php require $page['uri']; ?>
</div>