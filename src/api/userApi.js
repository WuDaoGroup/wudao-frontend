// 用户相关的API

import api from '../services/api.js';

export const loginApi = async (username, password) => {
	try {
		let form = new FormData();
		form.append('username', username);
		form.append('password', password);
		const response = await api.post(`/users/login`, form);
		return response;
	} catch (err) {
		console.error(err);
	}
};
export const registerApi = async (username, password1, password2) => {
	try {
		let form = new FormData();
		form.append('username', username);
		form.append('password1', password1);
		form.append('password2', password2);
		console.log(form.data)
		const response = await api.post(`/users/register`, form);
		return response;
	} catch (err) {
		console.error(err);
	}
};
