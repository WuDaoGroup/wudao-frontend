// AI模型相关的API接口
import api from '../services/api.js';


export const classificationTrainerApi = async ( username, testPercent, modelName ) => {
	try{
		let form = new FormData()
		form.append('username', username)
		form.append('percent', testPercent)
		form.append('method', modelName)
		const response = await api.post(`/api/v1/models/classification/train`, form)
		console.log(response)
		return response
	} catch (err){
		console.error(err)
	}
}

export const regressionTrainerApi = async ( username, testPercent, modelName ) => {
	try{
		let form = new FormData()
		form.append('username', username)
		form.append('percent', testPercent)
		form.append('method', modelName)
		const response = await api.post(`/api/v1/models/regression/train`, form)
		console.log(response)
		return response
	} catch (err){
		console.error(err)
	}
}

export const autogluonTrainerApi = async ( username, testPercent ) => {
	try{
		let form = new FormData()
		form.append('username', username)
		form.append('percent', testPercent)
		const response = await api.post(`/api/v1/models/autogluon/train`, form)
		console.log(response)
		return response
	} catch (err){
		console.error(err)
	}
}

export const autogluonPredictorApi = async ( username ) => {
	try{
		let form = new FormData()
		form.append('username', username)
		const response = await api.post(`/api/v1/models/autogluon/predict`, form)
		console.log(response)
		return response
	} catch (err){
		console.error(err)
	}
}

