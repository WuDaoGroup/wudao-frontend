import { writable } from 'svelte/store';
import { browser } from '$app/env';

let defaultFilename;

export const filename = writable(defaultFilename);

if (browser) {
	filename.set(
		localStorage.getItem('filename') == null ? defaultFilename : localStorage.getItem('filename')
	);
}