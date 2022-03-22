import api from '../services/api.js';

export const dimensionReductionApi = async (username, method, dimension, target)=> {
    try{
        let form = new FormData()
        form.append('username', username)
        form.append('method', method)
        form.append('dimension', dimension)
        form.append('target', target)
        const response = await api.post(`/api/v1/explanation/reduction`, form);
        return response;
    }catch(err){
        console.error(err);
    }
};

export const featureCorrApi = async (data_filename, methods)=> {
    try{
        const response = await api.post(`/api/v1/explanation/${data_filename}/feature_corr?methods=${methods}`);
        return response;
    }catch(err){
        console.error(err);
    }
};

export const objectMatrixApi = async (data_filename,featureCorrFeatures)=> {
    try{
        const response = await api.post(`/api/v1/explanation/${data_filename}/object_matrix`, featureCorrFeatures);
        return response;
    }catch(err){
        console.error(err);
    }
};

export const pairwiseFeatureCorrApi = async (data_filename, cols)=> {
    try{
        const response = await api.post(`/api/v1/explanation/${data_filename}/pairwise_feature_corr`, cols);
        return response;
    }catch(err){
        console.error(err);
    }
};