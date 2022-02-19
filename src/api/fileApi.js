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

export const uploadFileHeaderApi = async (uploadFilename,yheader,xheader) => {
	try {
		let form = new FormData();
		//for (let i = 0; i < yheader.header.length; i++) {
		//		form.append(yheader.header[i]);
		form.append('yheader', yheader);
		form.append('xheader', xheader);
		const response = await api.post(`/files/${uploadFilename}/analysis/header`, form);
		return response;
	} catch (err) {
		console.error(err);
	}
};
