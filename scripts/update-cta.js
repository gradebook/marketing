// @ts-check
const {AUTH_URL} = env;
const CTAs = document.querySelectorAll('.js-auth-redirect');

if (CTAs.length > 0) {
	fetch(`${AUTH_URL}/api/v0/session`, {credentials: 'include'}).then(r => r.json()).then(user => {
		let updatedText;
		let updatedLink;

		if (user.isNew) {
			updatedText = 'Create Your Account';
			updatedLink = '/signup';
		} else if (user.school) {
			updatedText = 'Go to Dashboard';
			updatedLink = `${AUTH_URL}/api/v0/redirect`;
		}

		if (updatedText && updatedLink) {
			window.externalWindowMutex = {
				requestFocus() {
					window.location.href = updatedLink;
				}
			};

			for (const cta of CTAs) {
				cta.setAttribute('href', updatedLink);
				cta.textContent = updatedText;
			}
		}
	}).catch(error => console.error(`__updateCTA::${error.message}`));
}
