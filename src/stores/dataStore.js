import { writable } from 'svelte/store';
import { browser } from '$app/env';

const defaultFilename = "data.csv";
const defaultTarget = "y";
const defaultFeatures = ["x"];
const defaultAllFeatures = [
	{key: "y", name: "y", type: "target"},
	{key: "x", name: "x", type: "feature"}];

export const filename = writable("");
export const target = writable("");
export const features = writable([]);
export const allFeatures = writable([]);


if (browser) {
	filename.set(
		localStorage.getItem('filename') == null ? defaultFilename : localStorage.getItem('filename')
	);
	target.set(
		localStorage.getItem('target') == null ? defaultTarget : JSON.parse(localStorage.getItem('target'))
	);
	features.set(
		localStorage.getItem('features') == null ? defaultFeatures : JSON.parse(localStorage.getItem('features'))
	);
	allFeatures.set(
		localStorage.getItem('all_features') == null ? defaultAllFeatures : JSON.parse(localStorage.getItem('all_features'))
	)
}