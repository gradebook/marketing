{
  const {AUTH_URL} = env;
  fetch(`${AUTH_URL}/api/v0/session`, {credentials: 'include'}).then(r => r.json()).then(user => {
    const bothCta = document.querySelectorAll('.js-auth-redirect .button');
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

			for (cta of bothCta) {
				cta.setAttribute('href', updatedLink);
				cta.textContent = updatedText;
			}
    }
  }).catch(error => console.error(`__updateCTA::${error.message}`));
}
