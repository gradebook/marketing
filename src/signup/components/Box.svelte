<style>
	.box {
		width: 80%;
		max-width: 400px;
		height: 300px;
		border-radius: 4px;
		box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 
			0px 24px 38px 3px rgba(0, 0, 0, 0.14), 
			0px 9px 46px 8px rgba(0, 0, 0, 0.12);
		padding: 24px;
		padding-bottom: 0px;
		padding-top: 0px;
		margin: 0 0 1em 0;
		background-color: rgba(255,255,255,1);
	}
	.centered {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>

<div class="box centered">
	<slot>
		<em>no content was provided</em>
	</slot>
</div>