import api from '../services/api.js';

export const causalModelBuildApi = async (data_filename, causalFeatures)=> {
    try{
        const response = await api.post(`/api/v1/causals/${data_filename}/model_build`, causalFeatures);
        return response;
    }catch(err){
        console.error(err);
    }
};