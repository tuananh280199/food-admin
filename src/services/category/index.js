import axios from "../../axios/index";

const categoryAPI = {
    getCategory: async () => {
        const data = await axios.get(
            "/category",
        );
        return data;
    },
    addCategory: async (params) => {
        return await axios.post(
            "/category/add-category", {
                data : {
                    name : params.name,
                    image : params.image,
                }
            }
        );
    },
    updateCategory: async (params, id) => {
        return await axios.put(
            `/category/update-category/${id}`, {
                data : {
                    name : params.name,
                    image : params.image,
                }
            }
        );
    },
    deleteCategory: async (id) => {
        return await axios.delete(
            `category/delete-category/${id}`
        )
    }
};

export default categoryAPI;
