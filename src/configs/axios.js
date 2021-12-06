import axios from "axios";
import EnvironmenVariable from "./env_vars";
export default class AxiosClient {
    constructor() {
        this.baseURL = EnvironmenVariable.BaseURL
    }
    async getRequest(url, data) {
        try {
                return await axios.get(this.baseURL+url, {params: data});
        } catch(err) {
            return Promise.reject(err);
        }
    }

    async postRequest(url, data) {
        try {
            return await axios.post(this.baseURL+url, data);
        } catch(err) {
            return Promise.reject(err);
        }
    }

    async putRequest() {

    }

    async patchRequest() {

    }
}
