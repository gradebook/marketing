// @ts-check

/**
 * @param {any[]} store
 * @param {any} element
 */
function deleteElementInPlace(store, element) {
	const elementIndex = store.findIndex(maybeElement => maybeElement === element);
	if (elementIndex === -1) {
		return;
	}

	for (let i = elementIndex; i < store.length - 1; ++i) {
		store[i] = store[i + 1];
	}

	store.pop();
}

module.exports.deleteElementInPlace = deleteElementInPlace;

/**
 * @param {Array<(error?: unknown) => any>} store
 * @param {(error?: unknown) => any} handler
 * @param {boolean} [once]
 */
module.exports.addHandler = (store, handler, once) => {
	if (once) {
		const originalHandler = handler;
		handler = error => {
			deleteElementInPlace(store, handler);
			originalHandler(error);
		}
	}

	store.push(handler);
}
