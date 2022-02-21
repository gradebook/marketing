const {AUTH_URL} = env;
fetch(`${AUTH_URL}/api/v0/session`, {credentials: 'include'}).then(r => r.json()).then(user => {
	if (user.school) {
		document.querySelector('input[name="school"]').value = user.school;
	}
})
.catch(() => null)

const search = new URLSearchParams(window.location.search);

if (search.get('type') === 'aggiecorps') {
	/** @type {HTMLFormElement} */
	const form = document.querySelector('form.support-form');
	const prioritizer = document.createElement('input');
	prioritizer.name = 'type';
	prioritizer.type = 'hidden';
	prioritizer.name = 'Corps Support'
	form.insertBefore(prioritizer, form.children[0]);
}

/** @type {HTMLSelectElement} */
const subjectInput = document.querySelector('select[name="subject"]');
const customSubjectInput = document.querySelector('input[name="custom_subject"]');
const customSubjectWrapper = document.querySelector('.custom_subject');

subjectInput.addEventListener('change', () => {
	const showOther = subjectInput.value === 'other';
	customSubjectWrapper.hidden = !showOther;
	customSubjectInput.setAttribute('required', showOther);
	customSubjectInput.type = showOther ? 'text' : 'hidden';

	showOther && customSubjectInput.focus();
});

// Add delay for scroll-reveal to finish
setTimeout(() => {
	if (document.activeElement === document.body) {
		document.querySelector('form.support-form input[autofocus]')?.focus();
	}
}, 950);
