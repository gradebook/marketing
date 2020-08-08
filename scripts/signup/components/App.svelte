<style>
.inline {
	display: inline;
}
</style>
<script>
	import Select from 'svelte-select';
	import Box from './Box.svelte';
	import Buttons from './Buttons.svelte';
	import items from './schools';
	import {onMount} from 'svelte'
	import {getUser, logout, approveAccount} from '../services/net';
	import getUrl from './get-url';

	const STATE = {
		confirmCreation: 0,
		selectSchool: 1
	};

	let school;
	let startingLabel = 'Select...';
	let notListed = false;
	let message = '';
	let userInputName = '';

	let email = 'your email';
	let state = 0;
	let state = STATE.confirmCreation;

	let focusElem;
	let guessedSchool;

	$: canConfirm = Boolean((notListed && userInputName) || (!notListed && school));

	onMount(async () => {
		focusElem.focus();

		const user = await getUser();
		if (!user) {
			return;
			}

		email = user.email;
			const domain = email.substring(email.lastIndexOf('@') + 1);
			guessedSchool = items.find(school => school.domain === domain);
			school = guessedSchool;
	});

	async function cancel() {
		const response = await logout();
		if (response) {
		message = 'ERROR: Please refresh the page and try again.';
	}
		}

	const setState = state_ => state = state_;

	async function confirm() {
		if (!canConfirm) {
			message = 'Please select or type a school.';
			return false;
		}

		message = '';
		const payload = {};

		if (notListed) {
			payload.school = 'www';
			payload.suggestion = userInputName;
		} else {
			payload.school = school.value;
		}

		const response = await approveAccount(payload);
		if (response) {
			message = response;
			}
	}
</script>

{#if state === STATE.confirmCreation}
	<Box>
		<h2>Welcome to Gradebook!</h2>
		<p style="margin-top: 45px;">There is not yet an account associated with {email}. Would you like to create one?</p>
		<Buttons>
			<button on:click={cancel}>Cancel</button>
			<button bind:this={focusElem} on:click={() => setState(STATE.selectSchool)}>Create Account</button>
		</Buttons>
	</Box>
{:else if state === STATE.selectSchool}
	<Box>
		<h2>Find Your School</h2>
		<Select {items} selectedValue={guessedSchool} isDisabled={notListed} on:select={e => {school = e.detail; message = ''}}></Select>
		<br>
		<div class="space">
			<input type="checkbox" id="not-listed" bind:checked={notListed} on:change={e => message = ''}>
			<label for="not-listed" class="inline">My school isn't listed</label>
		</div>
		{#if notListed}
			My school: <input class="school" type="text" bind:value={userInputName}>
		{/if}
		{#if message}
			<p class="warn" style="bottom: 12px; position: absolute;">{message}</p>
		{/if}
		<Buttons>
			<button on:click={cancel}>Cancel</button>
			<button on:click={confirm}>Confirm</button>
		</Buttons>
	</Box>
{/if}
