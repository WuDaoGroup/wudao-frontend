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

/////////////////////////////////////////////////
// deprecated below
///////////////////////////////////////////////

export const causalModelBuildApi = async (data_filename, causalFeatures) => {
	try {
		const response = await api.post(`/api/v1/causals/${data_filename}/model_build`, causalFeatures);
		return response;
	} catch (err) {
		console.error(err);
	}
};
