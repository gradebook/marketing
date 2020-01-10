<style>
.inline {
	display: inline;
}
</style>
<script>
	import Select from 'svelte-select';
	import Box from './Box.svelte';
	import Buttons from './Buttons.svelte';
	import items from './schools.json';
	import {onMount} from 'svelte'

	let school;
	let notListed = false;
	let message = '';
	let userInputName = '';

	let email = 'your email';
	let state = 0;

	let focusElem;

	onMount(function() {
		focusElem.focus();

		fetch('https://gradebook.app/api/v0/session', {credentials: 'include'}).then(r => r.json()).then(user => {
			email = user.email;
			if (!user.isNew) {
				window.location.href = 'http://gbdev.cf:7787/api/v0/redirect';
			}
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
			message = 'Please select or type a school.';
			return false;
		}

		message = '';
		let payload = {};

		if(!notListed & school !== undefined) {
			payload.school = school.value;
		} else if (notListed) {
			payload.school = 'default';
			payload.suggestion = userInputName;
		}

		const params = {
			method: 'PUT',
			body: JSON.stringify(payload),
			headers: {
				'content-type': 'application/json'
			},
			credentials: 'include'
		};

		fetch('https://gradebook.app/api/v0/approve', params).then(r => r.json()).then((r) => {
			if (r.message) {
				if (r.message === 'You are already approved') {
					return window.location.href = 'http://gbdev.cf:7787/api/v0/redirect';
				}

				message = r.message;
				return;
			}

			if (r.domain) {
				const domain = r.domain.replace(/\/$/, '');
				window.location.href = `${domain}/api/v0/me/approve`;
			} else {
				console.log(r);
				message = 'Unable to process response. Please contact support if this issue persists.';
			}
		}).catch(error => {
			console.log(error);
			message = error;
		});
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
		<Select {items} isDisabled={notListed} on:select={e => {school = e.detail; message = ''}}></Select>
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
			<button on:click={back}>
				Back
			</button>
			<button on:click={confirm}>
				Confirm
			</button>
		</Buttons>
	</Box>
{/if}
