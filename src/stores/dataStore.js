import { writable } from 'svelte/store';
import { browser } from '$app/env';

let defaultFilename;
let defaultTarget;
let defaultFeatures;

export const filename = writable(defaultFilename);
export const target = writable(defaultTarget);
export const features = writable(defaultFeatures);


if (browser) {
	filename.set(
		localStorage.getItem('filename') == null ? defaultFilename : localStorage.getItem('filename')
	);
	filename.set(
		localStorage.getItem('target') == null ? defaultFilename : localStorage.getItem('target')
	);
	filename.set(
		localStorage.getItem('features') == null ? defaultFilename : localStorage.getItem('features')
	);
}