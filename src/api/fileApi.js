// 文件和数据相关的API

import api from '../services/api.js';

export const analyzeUploadFileContentApi = async (username) => {
	try {
		const response = await api.get(`/api/v1/data/analysis/content?username=${username}`);
		return response;
	} catch (err) {
		console.error(err);
	}
};

export const uploadFileFeatureInfoApi = async (username, selectedFeatures) => {
	try {
		const response = await api.post(`/api/v1/data/features/info?username=${username}`, selectedFeatures);
		return response;
	} catch (err) {
		console.error(err);
	}
};

export const zscoreDataApi = async (username) => {
	try {
		const response = await api.get(`/api/v1/data/zscore?username=${username}`);
		return response;
	} catch (err) {
		console.error(err);
	}
};

// export const receiveBasicFileInfoApi = async (uploadFilename) => {
// 	try {
// 		const response = await api.get(`/api/v1/data/${uploadFilename}_selected_features.csv/features/info`);
// 		return response;
// 	} catch (err) {
// 		console.error(err);
// 	}
// };


// export const zscoreFilterInfoApi = async (uploadFilename, barNum) => {
// 	try {
// 		const response = await api.get(`/api/v1/data/${uploadFilename}_selected_features.csv/zscore/filter?bar=${barNum}`);
// 		return response;
// 	} catch (err) {
// 		console.error(err);
// 	}
// };

// export const originZscoreApi = async (uploadFilename) => {
// 	try {
// 		const response = await api.get(`/api/v1/data/${uploadFilename}_selected_features.csv/zscore`);
// 		return response;
// 	} catch (err) {
// 		console.error(err);
// 	}
// };

// export const confirmOriginZscoreApi = async (uploadFilename, selectType) => {
// 	try {
// 		const response = await api.get(`/api/v1/data/${uploadFilename}_selected_features.csv/zscore/type?selectType=${selectType}`);
// 		return response;
// 	} catch (err) {
// 		console.error(err);
// 	}
// };
