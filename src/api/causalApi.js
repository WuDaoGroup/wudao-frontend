import api from '../services/api.js';

export const generateNotearsApi = async (username, bar) => {
	try {
		let form = new FormData();
		form.append('username', username);
		form.append('bar', bar);
		const response = await api.post(`/api/v1/causal/notears`, form);
		console.log(response);
		return response;
	} catch (err) {
		console.error(err);
	}
};
