<style>
	.background {
		width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        background:linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url("./../assets/generic.jpg");
	}
</style>

<div class="background">
	<slot>
		<em>no content was provided</em>
	</slot>
</div>