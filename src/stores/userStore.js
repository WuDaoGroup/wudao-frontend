import {writable} from 'svelte/store';

export const user = writable({
    'username': '未登录',
    'password': '',
    'usertype': 0
});
