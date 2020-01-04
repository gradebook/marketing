<script>
	import Select from 'svelte-select';
	import Box from './Box.svelte';
	import Buttons from './Buttons.svelte';
	import items from './schools.json';
	import {onMount} from 'svelte'

	let school;
	let notListed = false;
	let showMessage = false;
	let userInputName = '';

	let email = '';
	let state = 0;

	let focusElem;

	onMount(function() {
		focusElem.focus();

		fetch('https://gradebook.app/api/v0/session', {credentials: 'include'}).then(r => r.json()).then(user => {
			email = user.email;
		}).catch(error => console.error(`__getUser::${error.message}`));
	})

	function createAccount() {
		state = 1;
	}

	function back() {
		state--;

		if(state < 0) {
			window.history.go(-1);
		}
	}

	function canConfirm() {
		if(!notListed && !school) {
			return false;
		}

		if(notListed && !userInputName) {
			return false;
		}

		return true;
	}

	function confirm() {
		if(!canConfirm()) {
			showMessage = true;
			return false;
		} else {
			showMessage = false;
		}

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
		<p style="margin-top: 45px;">There is not yet an account associated with {email}. Would you like to create one?</p>
		<Buttons>
			<button on:click={back}>
				Back
			</button>
			<button bind:this={focusElem} on:click={createAccount}>
				Create Account
			</button>
		</Buttons>
	</Box>
{:else if state==1}
	<Box>
		<h2>Find Your School</h2>
		<Select {items} isDisabled={notListed} on:select={e => school = e.detail}></Select>
		<br>
		<div class="space">
			<input type="checkbox" bind:checked={notListed}>
			My school isn't listed
		</div>
		{#if notListed}
			My school: <input type=text bind:value={userInputName}>
		{/if}
		{#if showMessage}
			<p class="warn" style="bottom: 12px; position: absolute;">Please select or type a school.</p>
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
