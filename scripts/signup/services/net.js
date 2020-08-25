import getUrl from '../components/get-url';

export function getUser() {
	return fetch(getUrl('/api/v0/session'), {credentials: 'include'})
		.then(response => response.json())
		.then(user => {
			if (!user.isNew) {
				window.location.href = getUrl('/api/v0/redirect');
			}

			return user;
		})
		.catch(error => {
			console.error(`__getUser::${error.message}`);
			return null;
		});
}

export function logout() {
	return fetch(getUrl('/api/v0/session/end'), {credentials: 'include'})
		.then(response => {
			if (response.status === 204) {
				window.location.href = getUrl('');
			}
		})
		.catch(error => {
			console.error(`__getUser::${error.message}`)
			return 'ERROR: Please refresh the page and try again.';
		});
}

export function approveAccount(payload) {
	return fetch(getUrl('/api/v0/approve'), {
		method: 'PUT',
		body: JSON.stringify(payload),
		headers: {
			'content-type': 'application/json'
		},
		credentials: 'include'
	})
	.then(response => response.json())
	.then(response => {
		if (response.message) {
			if (response.message === 'You are already approved') {
				return window.location.href = getUrl('/api/v0/redirect');
			}

			return response.message;
		}

		if (response.domain) {
			const globalQuery = new URLSearchParams(window.location.search);
			let query = '';
			if (globalQuery.has('import')) {
				query = `?import=${globalQuery.get('import')}`;
			}

			const domain = response.domain.replace(/\/$/, '');
			window.location.href = `${domain}/api/v0/me/approve${query}`;
		} else {
			console.log(response);
			return 'Unable to process response. Please contact support if this issue persists.';
		}
	}).catch(error => {
		console.log(error);
		return error;
	});
}
