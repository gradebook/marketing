// @ts-check
import ExternalWindow from '@gradebook/external-window';

/** @type {ExternalWindow} */
window.externalWindowMutex = null;

const AUTH_URL = 'https://gradebook.app/api/v0/session/begin?gb-login=frame';
const DASHBOARD_URL = 'https://gradebook.app/api/v0/redirect';
const SESSION_STATUS_URL = 'https://gradebook.app/api/v0/session';

document.querySelectorAll('.login-button').forEach(node => {
  node.addEventListener('click', event => {
    event.preventDefault();

    if (window.externalWindowMutex) {
      return window.externalWindowMutex.requestFocus();
    }

    window.externalWindowMutex = new ExternalWindow(AUTH_URL);
    window.externalWindowMutex.promise.then(() => {
      window.externalWindowMutex = null;
      return fetch(SESSION_STATUS_URL, {credentials: 'include'});
    }).then(response => {
      if (response.ok) {
        return response.json();
      }

      return {
        isNew: false,
        school: false
      };
    }).then(user => {
      if (user.isNew) {
        window.location.href = '/signup';
      } else if (user.school) {
        window.location.href = DASHBOARD_URL;
      }

      console.log('Not sure what is up with user');
    }).catch(error => {
      console.error(error);
      window.location.href = DASHBOARD_URL;
    });
  });
});
