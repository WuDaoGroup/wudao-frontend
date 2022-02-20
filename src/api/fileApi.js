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

export const uploadFileFeatureInfoApi = async (uploadFilename, selectedFeatures) => {
	try {
		const response = await api.post(`/files/${uploadFilename}/features/info`, selectedFeatures);
		return response;
	} catch (err) {
		console.error(err);
	}
};

export const receiveBasicFileInfoApi = async (uploadFilename) => {
	try {
		const response = await api.get(`/data/${uploadFilename}_selected_feature.csv/features/info`);
		return response;
	} catch (err) {
		console.error(err);
	}
};
