---
title: Course link not found
eleventyExcludeFromCollections: true
noMeta: true
---
<style>
	main {
		display: flex;
		flex-direction: column;
	}

	.link-not-found-container {
		padding-block: 2.5rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
	}

	.link-not-found-container h1 {
		margin-top: 0;
	}

	.satellite {
		color: var(--color--primary-3);
		margin-inline: auto;
		margin-top: 5rem;
		margin-bottom: 2.5rem;
		width: 6rem;
		height: 6rem;
	}

	.buttons {
		margin: 1rem auto 0;
		width: fit-content;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>

<div class="container link-not-found-container text-center">

<span aria-hidden="true">
{{inline-svg "/static/inline/satellite-icon.svg" class="satellite" }}
</span>

# This is not the course you were looking for

We've searched far and wide, but we can't find this course template!

<div class="buttons">
	<a href="/" class="button button-primary">Go to homepage</a>
	<a href="/" class="text-sm center js-auth-redirect">Sign in to Gradebook</a>
</div>

</div>
