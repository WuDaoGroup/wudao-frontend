// 文件相关的API

import api from '../services/api.js';

export const uploadDataApi = async (file) => {
	try {
		let form = new FormData()
        form.append('upload_file', file)
        const response = await api.post(`upload`, form);
		return response;
	} catch (err) {
		console.error(err);
	}
};