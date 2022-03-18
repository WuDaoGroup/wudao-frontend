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
	target.set(
		localStorage.getItem('target') == null ? defaultTarget : localStorage.getItem('target')
	);
	features.set(
		localStorage.getItem('features') == null ? defaultFeatures : localStorage.getItem('features')
	);
}