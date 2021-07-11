import axios from "../../axios/index";

const authAPI = {
    login: (params) => {
        return axios.post('/auth/login', {
            username: params.username,
            password: params.password,
        });
    },
    refreshToken: (refresh_token) => {
        return axios.post('/auth/refresh-token', {
            refreshToken: refresh_token,
        });
    },
    checkToken: (token) => {
        return axios.post('/auth/check-token', {
            token,
        });
    },
};

export default authAPI;
