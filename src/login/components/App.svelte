<script>
	import Select from 'svelte-select';
	import Box from './Box.svelte';
	import Buttons from './Buttons.svelte';
	import Background from './Background.svelte';

	let items = [
		{value: 'aggie', label: 'Texas A&M University'},
		{value: 'lsu', label: 'LSU - Louisiana State University'},
		{value: 'rebel', label: 'Ole Miss - University of Mississippi'},
		{value: 'crimson', label: 'University of Alabama'},
		{value: 'cajun', label: 'University of Louisiana at Lafayette'},
		{value: 'latech', label: 'Louisiana Tech University'},
		{value: 'gator', label: 'University of Florida'},
		{value: 'colonial', label: 'GW - George Washington University'},
		{value: 'vandy', label: 'Vanderbilt University'},
		{value: 'tiger', label: 'Clemson University'},
		{value: 'wolfpack', label: 'NC State University'},
		{value: 'buckeye', label: 'The Ohio State University'},
		{value: 'raider', label: 'Texas Tech University'},
		{value: 'nittany', label: 'Penn State University'},
		{value: 'bm', label: 'Purdue University'},
		{value: 'wildcat', label: 'Kansas State University'},
		{value: 'husker', label: 'University of Nebraska'},
		{value: 'longhorn', label: 't.u. - University of Texas at Austin'},
		{value: 'comet', label: 'UTD - University of Texas at Dallas'}
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

<Background>
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
</Background>
