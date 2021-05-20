import axios from "../../axios/index";

const authAPI = {
    login: (params) => {
        return axios.post('/auth/login', {
            username: params.username,
            password: params.password,
        });
    },
};

export default authAPI;
