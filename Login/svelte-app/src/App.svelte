<script>
	import Box from './Box.svelte';
	import Buttons from './Buttons.svelte';
	import Select from 'svelte-select';

	let items = [
		{value: 1, label: 'Texas A&M'},
		{value: 2, label: 'Texas Tech'},
		{value: 3, label: 'University of Texas'},
		{value: 4, label: 'Ole Miss'}
	]

	let selectedValue = undefined;
	let notListed = false;
	let userInputName = '';

	let email = 'email@email.com';
	let state = 0;

	function createAccount() {
		state = 1;
	}

	function back() {
		state -= 1;

		if(state<0) {
			window.location.href = "http://gradebook.app";
		}
	}

	function confirm() {
		let schoolValue = -1;
		let schoolName = '';

		if(!notListed & selectedValue !== undefined) {
			schoolValue = selectedValue.value;
			schoolName = selectedValue.label;
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
		<Select {items} isDisabled={notListed} bind:selectedValue></Select>
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
