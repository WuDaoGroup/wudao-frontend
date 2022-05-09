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

export const fillDataApi = async (username, selectedFillOption) => {
	try {
		const response = await api.get(`/api/v1/data/fill?username=${username}&fill_type=${selectedFillOption}`);
		return response;
	} catch (err) {
		console.error(err);
	}
};

export const filterDataApi = async (username, filterBar) => {
	try {
		const response = await api.get(`/api/v1/data/filter?username=${username}&bar=${filterBar}`);
		return response;
	} catch (err) {
		console.error(err);
	}
};

export const getDataStatisticsInfoApi = async (username, step) => {
	try {
		let form = new FormData()
		form.append('username', username)
		form.append('step', step)
		const response = await api.post(`/api/v1/data/statistics/info`, form);
		return response;
	} catch (err) {
		console.error(err);
	}
};

export const generateHistogramApi = async (username, step) => {
	try {
		let form = new FormData()
		form.append('username', username)
		form.append('step', step)
		const response = await api.post(`/api/v1/data/histogram`, form);
		return response;
	} catch (err) {
		console.error(err);
	}
};
