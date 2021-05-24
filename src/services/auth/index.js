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
};

export default authAPI;
