{
  fetch('https://gradebook.app/api/v0/session').then(r => r.json()).then(user => {
    const cta = document.querySelector('.hero-cta .button');
    let updatedText;
    let updatedLink;
    console.log({user})

    if (user.isNew) {
      updatedText = 'Create Your Account';
      updatedLink = '/login';
    } else if (user.school) {
      updatedText = 'Go to Dashboard';
      updatedLink = 'https://gradebook.app/api/v0/redirect';
    }

    if (updatedText && updatedLink) {
      cta.setAttribute('href', updatedLink);
      cta.textContent = updatedText;
    }
  }).catch(error => console.error(`__updateCTA::${error.message}`));
}