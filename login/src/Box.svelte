<style>
	.box {
		width: 300px;
		border: 1px solid #aaa;
		border-radius: 2px;
		box-shadow: 0 4px 12px 0px #333;
		padding: 1em;
		margin: 0 0 1em 0;
		background-color: rgba(255,255,255,1);
		height: 250px;
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