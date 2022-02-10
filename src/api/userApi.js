import api from '../services/api.js';

export const loginApi = async (username, password) => {
	try {
        let form = new FormData()
        form.append('username', username)
        form.append('password', password)
        const response = await api.post(`users/login`, form);
		return response;
	} catch (err) {
		console.error(err);
	}
};
