<script>
import '@gradebook/course-creator';
import {serialize} from '@gradebook/course-serializer';
import {onMount} from 'svelte';
import Select from 'svelte-select';
import schoolConfig from '../schools.js';
import {selectedSchool} from './selected-school.js';
let currentState = 0;

let courseCreator;
const schools = Object.keys(schoolConfig);
let courseResponse;

$: {
	const school = schoolConfig[$selectedSchool];
	document.documentElement.style.setProperty('--body-bg', `url('${school.theme.background}')`);
	if (courseCreator) {
		courseCreator.school = $selectedSchool;
		courseCreator.defaultCutoffs = school.cutoffs;
	}
}

$: url = courseResponse
	? `https://${schoolConfig[$selectedSchool].slug}.gradebook.app/my/import#${serialize(courseResponse)}`
	: '';


onMount(() => {
	courseCreator.completeFunction = (response, complaintReason) => {
		if (response === null) {
			currentState = 0;
		} else if (response) {
			currentState = 2;
			courseResponse = response;
		} else {
			console.log({response, complaintReason});
		}
	};

	courseCreator.maxCredits = 5;
	courseCreator.escapedCourse = null;
	courseCreator.allowEscape = false;
	courseCreator.standalone = true;
});
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
		background: transparent;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 600;
	}

	.core {
		flex: 1;
		margin-top: 8px;
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
		<div class="core">
			<Select
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
		{url}
	</div>
</div>
