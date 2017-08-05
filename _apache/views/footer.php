	</div>
	<script src="http://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
	<script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/main.js"></script>
	<?php if(isset($page['scripts'])): ?>
		<?php foreach($page['scripts'] as $script): ?>
			<script src="<?php echo $script; ?>"></script>
		<?php endforeach; ?>
	<?php endif; ?>
</body>
</html>