import axios from "../../axios/index";

const productAPI = {
    getProduct: async (page) => {
        const data = await axios.get(
            `/product/get-product?page=${page}`,
        );
        return data;
    },
    searchProductByName: async (keyWord, page) => {
        const data = await axios.get(
            `/product/search-by-name?product_name=${keyWord}&page=${page}`,
        );
        return data;
    },
};

export default productAPI;
