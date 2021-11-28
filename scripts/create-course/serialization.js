// @ts-check
import {serialize, validate} from '@gradebook/course-serializer';
import {toDataURL} from 'qrcode';
import {writable} from 'svelte/store';
const env = env;

const root = writable({link: null, image: null});
const urlRoot = env.SITE_URL.replace('www', '$$');
let _unserializedData;

export const serializer = {
	subscribe: root.subscribe,

	/**
	 * @param {string} selectedSchool
	 * @param {Parameters<import('@gradebook/course-creator').Callback>[0]} unserializedData
	 */
	update(selectedSchool, unserializedData) {
		if (!unserializedData) {
			_unserializedData = null;
			return;
		}

		_unserializedData = unserializedData;
		const payload = serialize(unserializedData);
		const link = `${urlRoot.replace('$$', selectedSchool)}/my/import#${payload}`

		// Generate QR code
		toDataURL(payload, {errorCorrectionLevel: 'L'}).then(image => {
			root.set({link, image});
		});
	},

	isValid() {
		return _unserializedData && validate(_unserializedData);
	}
}
