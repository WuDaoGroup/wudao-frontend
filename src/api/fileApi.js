// 文件相关的API

import api from '../services/api.js';

export const analyzeUploadFileContentApi = async (uploadFilename) => {
	try {
		const response = await api.get(`files/${uploadFilename}/analysis/content`);
		return response;
	} catch (err) {
		console.error(err);
	}
};
