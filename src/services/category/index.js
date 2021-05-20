import axios from "../../axios/index";

const categoryAPI = {
    getCategory: async () => {
        const data = await axios.get(
            "/category",
        );
        return data;
    },
};

export default categoryAPI;
