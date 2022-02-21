// AI模型相关的API接口
import api from '../services/api.js';

export const lassoData = async (filename, alpha ) => {
	try{
		let form = new FormData()
		form.append('filename', filename)
		form.append('alpha', alpha)
		const response = await api.post(`/models/predict/lasso`, form)
		return response
	}catch (err){
		console.error(err)
	}
}

export const ridgeRegressionData = async (filename, alpha ) => {
	try{
		let form = new FormData()
		form.append('filename', filename)
		form.append('alpha', alpha)
		const response = await api.post(`/models/predict/ridge_regression`, form)
		return response
	}catch (err){
		console.error(err)
	}
}

export const ordinaryLeastSquaresData = async (filename) => {
	try{
		let form = new FormData()
		form.append('filename', filename)
		const response = await api.post(`/models/predict/ols`, form)
		return response
	}catch (err){
		console.error(err)
	}
}

export const boostedDecisionTreeRegressionData = async (filename) => {
	try{
		let form = new FormData()
		form.append('filename', filename)
		console.log('filename:', filename)
		const response = await api.post(`/models/predict/bdtr`, form)
		console.log('response_data:',response.data)
		return response
	}catch (err){
		console.error(err)
	}
}
