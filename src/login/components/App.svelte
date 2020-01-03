<script>
	import Select from 'svelte-select';
	import Box from './Box.svelte';
	import Buttons from './Buttons.svelte';
	import items from './schools.json';

	let school;
	let notListed = false;
	let userInputName = '';

	let email = 'email@email.com';
	let state = 0;

	function createAccount() {
		state = 1;
	}

	function back() {
		state--;

		if(state < 0) {
			window.location.href = "http://gradebook.app";
		}
	}

	function confirm() {
		let schoolValue = -1;
		let schoolName = '';

		if(!notListed & school !== undefined) {
			schoolValue = school.value;
			schoolName = school.label;
		} else if (notListed) {
			schoolName = userInputName;
		}

		console.log('CREATE ACCOUNT', schoolValue, schoolName);
	}
</script>

{#if state==0}
	<Box>
		<h2>Welcome to Gradebook!</h2>
		<p>There is not yet an account associated with {email}. Would you like to create one?</p>
		<Buttons>
			<button on:click={back}>
				Back
			</button>
			<button on:click={createAccount}>
				Create Account
			</button>
		</Buttons>
	</Box>
{:else if state==1}
	<Box>
		<h2>Find Your School</h2>
		<Select {items} isDisabled={notListed} on:select={e => school = e.detail}></Select>
		<div>
			<input type="checkbox" bind:checked={notListed}>
			My school isn't listed
		</div>
		{#if notListed}
			My school: <input type=text bind:value={userInputName}>
		{/if}
		<Buttons>
			<button on:click={back}>
				Back
			</button>
			<button on:click={confirm}>
				Confirm
			</button>
		</Buttons>
	</Box>
{/if}
