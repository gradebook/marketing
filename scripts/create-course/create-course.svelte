<script>
import '@gradebook/course-creator';
import {serialize} from '@gradebook/course-serializer';
import {onMount} from 'svelte';
import Select from 'svelte-select';
import schoolConfig from '../schools.js';
import {selectedSchool} from './selected-school.js';
import {serializer} from './serialization.js';
let currentState = 0;

let courseCreator;
let courseName;
const schools = Object.keys(schoolConfig);

$: {
	const school = schoolConfig[$selectedSchool];
	document.documentElement.style.setProperty('--body-bg', `url('${school.theme.background}')`);
	if (courseCreator) {
		courseCreator.school = $selectedSchool;
		courseCreator.defaultCutoffs = school.cutoffs;
	}
}

onMount(() => {
	courseCreator.completeFunction = (response, complaintReason) => {
		if (response === null) {
			currentState = 0;
		} else if (response) {
			currentState = 2;
			serializer.update(schoolConfig[$selectedSchool].slug, response);
			courseName = response.name;
		} else {
			console.log({response, complaintReason});
		}
	};

	courseCreator.maxCredits = 5;
	courseCreator.escapedCourse = null;
	courseCreator.allowEscape = false;
	courseCreator.standalone = true;
});

const canShare = 'share' in navigator;
const canCopy = 'clipboard' in navigator
$: canCreateShortLink = $serializer && serializer.isValid();

const fail = () => {
	window.alert('not yet implemented');
};

const openShare = () => navigator.share({
	title: `Gradebook Template for ${courseName}`,
	text: `Add ${courseName} to Gradebook so you can track your grades!`,
	url: $serializer.link,
});

const triggerCopy = () => navigator.clipboard.writeText($serializer.link);

const createShortLink = fail;
</script>

<style>
	:root {
		--white: #f7fafc;
		--black: #171C1F;
		--accent: #420420;
		--primary: var(--white);
		--secondary: var(--accent);
	}

	* {
		margin: 0;
	}

	.box {
		min-width: 450px;
		width: fit-content;
		max-width: initial;
		border-radius: 25px;
		padding: clamp(1rem, 10vh, 2rem);
		box-shadow: 0 11px 15px -7px rgb(0 0 0 / 20%),
								0 24px 38px 3px rgb(0 0 0 / 14%),
								0 9px 46px 8px rgb(0 0 0 / 12%);
		--primary: var(--secondary);
		backdrop-filter: blur(10px);
		background: rgba(255 255 255 / 0.20);
	}

	button {
		background-color:rgb(255 255 255 / 50%);
		border: 1px solid #d8dbdf;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 600;
	}

	.core {
		flex: 1;
		margin-top: 32px;
	}

	.step {
		display: none;
	}

	.step.visible {
		display: contents;
	}
</style>

<div class="box">
	<div class="step" class:visible={currentState == 0}>
		<h1>Select your School</h1>
		<div class="gb-select"></div>
		<div class="core">
			<Select
				containerStyles="background-color: rgb(255 255 255 / 50%)"
				items={schools}
				value={$selectedSchool}
				on:select={value => $selectedSchool = value.detail.value}
				inputStyles="max-width: 450px"
			></Select>
		</div>
		<div class="footer">
			<button on:click={() => currentState++}>Next</button>
		</div>
	</div>
	<div class="step" class:visible={currentState == 1}>
		<gbwc-course-creator bind:this={courseCreator}></gbwc-course-creator>
	</div>
	<div class="step" class:visible={currentState == 2}>
		Share your course!
		{#if $serializer.image}
		<img src={$serializer.image} alt="QR code containing course link" />
			{#if canShare}
		<button on:click={() => openShare()}>Share</button>
			{/if}
			{#if canCopy}
		<button on:click={() => triggerCopy()}>Copy</button>
			{/if}
			{#if canCreateShortLink}
		<button on:click={() => createShortLink()}>Shorten</button>
			{/if}
		{:else}
			<p>Generating link...</p>
		{/if}
	</div>
</div>
