import { writable } from 'svelte/store';
import { browser } from '$app/env';
let defaultDataHeader ={
    header: []
};
let defaultRowData = {
    data:[]
};
export const dataHeader = writable(defaultDataHeader);
export const rowData = writable(defaultRowData);

if (browser) {
	dataHeader.set(
		localStorage.getItem('dataHeader') == null ? defaultDataHeader : JSON.parse(localStorage.getItem('dataHeader'))
	);
	rowData.set(
		localStorage.getItem('rowData') == null ? defaultRowData : JSON.parse(localStorage.getItem('rowData'))
	);
}