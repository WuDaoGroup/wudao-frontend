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

export const generateCorrelationFeatureApi = async (username, method)=> {
    try{
        let form = new FormData()
        form.append('username', username)
        form.append('method', method)
        const response = await api.post(`/api/v1/explanation/correlation/feature`, form);
        return response;
    }catch(err){
        console.error(err);
    }
};

export const generateCorrelationTargetApi = async (username, kNumber, target)=> {
    try{
        let form = new FormData()
        form.append('username', username)
        form.append('k_number', kNumber)
        form.append('target', target)
        const response = await api.post(`/api/v1/explanation/correlation/target`, form);
        return response;
    }catch(err){
        console.error(err);
    }
};

export const generateCorrelationPairwiseApi = async (username)=> {
    try{
        let form = new FormData()
        form.append('username', username)
        // form.append('features', features)
        const response = await api.post(`/api/v1/explanation/correlation/pairwise`, form);
        return response;
    }catch(err){
        console.error(err);
    }
};
