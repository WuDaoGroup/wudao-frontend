// AI模型相关的API接口
import api from '../services/api.js';


export const classificationTrainerApi = async ( username, testPercent, modelName ) => {
	try{
		let form = new FormData()
		form.append('username', username)
		form.append('percent', testPercent)
		form.append('method', modelName)
		const response = await api.post(`/api/v1/models/classification/predict`, form)
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
		const response = await api.post(`/api/v1/models/regression/predict`, form)
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
		const response = await api.post(`/api/v1/models/autogluon/predict`, form)
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
		const response = await api.post(`/api/v1/models/autogluon/test`, form)
		console.log(response)
		return response
	} catch (err){
		console.error(err)
	}
}


/////////////////////////////////////////////////
// deprecated below
///////////////////////////////////////////////

export const xgboostRegressionData = async ( filename, percent ) => {
	try{
		let form = new FormData()
		form.append('filename', filename)
		form.append('percent', percent)
		const response = await api.post(`/api/v1/models/predict/xgboost-regression`, form)
		console.log(response)
		return response
	}catch (err){
		console.error(err)
	}
}

export const xgboostClassificationData = async ( filename, percent ) => {
	try{
		let form = new FormData()
		form.append('filename', filename)
		form.append('percent', percent)
		const response = await api.post(`/api/v1/models/predict/xgboost-classification`, form)
		console.log(response)
		return response
	}catch (err){
		console.error(err)
	}
}
export const svcData = async ( filename, percent ) => {
	try{
		let form = new FormData()
		form.append('filename', filename)
		form.append('percent', percent)
		const response = await api.post(`/models/predict/svc`, form)
		console.log(response)
		return response
	}catch (err){
		console.error(err)
	}
}
export const sgdClassifierData = async ( filename, loss, penalty, percent ) => {
	try{
		let form = new FormData()
		form.append('filename', filename)
		form.append('percent', percent)
		form.append('loss', loss)
		form.append('penalty', penalty)
		const response = await api.post(`/api/v1/models/predict/SGDClassifierData`, form)
		console.log(response)
		return response
	}catch (err){
		console.error(err)
	}
}
export const lassoLarsData = async ( filename, alpha, normalize, percent ) => {
	try{
		let form = new FormData()
		form.append('filename', filename)
		form.append('alpha', alpha)
		form.append('normalize', normalize)
		form.append('percent', percent)
		console.log(form)
		const response = await api.post(`/api/v1/models/predict/lassoLars`, form)
		console.log(response)
		return response
	}catch (err){
		console.error(err)
	}
}
export const lassoData = async ( filename, alpha, percent ) => {
	try{
		let form = new FormData()
		form.append('filename', filename)
		form.append('alpha', alpha)
		form.append('percent', percent)
		const response = await api.post(`/api/v1/models/predict/lasso`, form)
		return response
	}catch (err){
		console.error(err)
	}
}
export const ridgeRegressionData = async ( filename, alpha, percent ) => {
	try{
		let form = new FormData()
		form.append('filename', filename)
		form.append('alpha', alpha)
		form.append('percent', percent)
		const response = await api.post(`/api/v1/models/predict/ridge_regression`, form)
		return response
	}catch (err){
		console.error(err)
	}
}
export const ordinaryLeastSquaresData = async ( filename, percent ) => {
	try{
		let form = new FormData()
		form.append('filename', filename)
		form.append('percent', percent)
		const response = await api.post(`/api/v1/models/predict/ols`, form)
		console.log(response)
		return response
	}catch (err){
		console.error(err)
	}
}
export const boostedDecisionTreeRegressionData = async ( filename ) => {
	try{
		let form = new FormData()
		form.append('filename', filename)
		console.log('filename:', filename)
		const response = await api.post(`/api/v1/models/predict/bdtr`, form)
		console.log('response_data:',response.data)
		return response
	}catch (err){
		console.error(err)
	}
}
