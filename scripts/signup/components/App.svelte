<script>
	import {onMount} from 'svelte'
	import Select from 'svelte-select';
	import AsyncButton from './async-button.svelte';
	import items from './schools';
	import {getUser, logout, approveAccount} from '../services/net';

	const STATE = {
		confirmCreation: 0,
		selectSchool: 1
	};

	let school;
	let notListed = false;
	let corpsChecked = false;
	let message = '';
	let userInputName = '';

	let email = 'your email';
	let state = STATE.confirmCreation;
	let guessedSchool;

	$: disallowSubmission = !Boolean((notListed && userInputName.trim()) || (!notListed && school));
	$: showCorpsCheckbox = school && school.value === 'aggie';
	$: isCorpsMember = showCorpsCheckbox && corpsChecked;

	onMount(async () => {
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
		message = '';
		const payload = {};

		if (notListed) {
			payload.school = 'the';
			payload.suggestion = userInputName.trim();
		} else if (school.value === 'aggie' && isCorpsMember) {
			payload.school = 'aggiecorps'
		} else {
			payload.school = school.value;
		}

		const response = await approveAccount(payload);
		if (response) {
			message = response;
		}
	}
</script>
<div class="box">
	{#if state === STATE.confirmCreation}
		<h2 class="header">Welcome to Gradebook!</h2>
		<main class="mt-8">
			<p>There is not yet an account associated with {email}. Would you like to create one?</p>
		</main>
		<div class="footer">
			<AsyncButton click={cancel} hideLoaderAfterFinish={false}>Cancel</AsyncButton>
			<!-- svelte-ignore a11y-autofocus -->
			<button autofocus on:click={() => setState(STATE.selectSchool)}>Create Account</button>
		</div>
	{:else if state === STATE.selectSchool}
		<h2 class="header">Find Your School</h2>
		<main class="content">
			<Select
				{items}
				value={guessedSchool}
				isDisabled={notListed}
				on:select={e => {school = e.detail; message = ''}}
				on:clear={() => {school = null; message = ''}}
			></Select>
			<br>
			<div class="space">
				<input type="checkbox" id="not-listed" bind:checked={notListed} on:change={e => message = ''}>
				<label for="not-listed" class="inline">My school isn't listed</label>
			</div>
			{#if notListed}
				My school: <input class="school" type="text" bind:value={userInputName}>
			{:else if showCorpsCheckbox}
				<input type="checkbox" id="is-corps" bind:checked={corpsChecked} on:change={e => message = ''}>
				<label for="is-corps" class="inline">I am in the Corps of Cadets</label>
			{/if}
		</main>
		<div class="footer">
			<p class="error-message">{message}</p>
			<AsyncButton click={cancel} hideLoaderAfterFinish={false}>Cancel</AsyncButton>
			<AsyncButton disabled={disallowSubmission} hideLoaderAfterFinish={false} click={confirm}>Confirm</AsyncButton>
		</div>
	{/if}
</div>
