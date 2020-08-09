<style>
	.async-button {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.loader {
		animation: spin 1s linear infinite;
		height: 1rem;
		width: 1rem;
		vertical-align: middle;
		margin-right: 0.5rem;
	}

	.loader circle {
		opacity: 25%;
	}

	.loader path {
		opacity: 75%;
	}
</style>
<script>
export let disabled = false;
export let click = () => new Promise(resolve => setTimeout(resolve, 3000));
let mutex = false;

$: allowClick = !mutex && !disabled;

async function handleClick() {
	mutex = true;

	try {
		await click();
	} finally {
		mutex = false;
	}
}
</script>

<button class="async-button" on:click={handleClick} disabled={!allowClick}>
	<svg class="loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" hidden={!mutex}>
		<circle cx="12" cy="12" r="10" stroke="#333" stroke-width="4"></circle>
		<path fill="#333" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
	</svg>
	<slot></slot>
</button>
