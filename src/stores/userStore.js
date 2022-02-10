import {writable} from 'svelte/store';
import { browser } from "$app/env";

let defaultUser = {
    'username': '未登录',
    'password': '',
    'usertype': 0
}
export const user = writable(defaultUser);

if (browser) {
    user.set(localStorage.getItem('user') == null ? defaultUser : JSON.parse(localStorage.getItem('user')))
}


