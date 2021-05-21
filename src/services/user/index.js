import axios from "../../axios/index";

const userAPI = {
    getUser: async (page) => {
        const data = await axios.get(
            `/users/get-user?page=${page}`,
        );
        return data;
    },
    searchUserByName: async (keyWord, page) => {
        const data = await axios.get(
            `/users/search-by-name?user_name=${keyWord}&page=${page}`,
        );
        return data;
    },
};

export default userAPI;
