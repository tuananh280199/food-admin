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
    addProduct: async (params) => {
        return await axios.post(
            "/product/add-product", {
                data : {
                    name : params.name,
                    price : params.price,
                    priceSale : params.priceSale,
                    new : params.new,
                    sale : params.sale,
                    image : params.image,
                    origin : params.origin,
                    unit : params.unit ,
                    quantitative : params.quantitative,
                    ingredient : params.ingredient,
                    note : params.note,
                    description : params.description,
                    category_id : params.category_id,
                    out_of_product : params.out_of_product
                }
            }
        );
    },
    updateProduct: async (params, id) => {
        return await axios.put(
            `/product/update-product/${id}`, {
                data : {
                    name : params.name,
                    price : params.price,
                    priceSale : params.priceSale,
                    new : params.new,
                    sale : params.sale,
                    image : params.image,
                    origin : params.origin,
                    unit : params.unit ,
                    quantitative : params.quantitative,
                    ingredient : params.ingredient,
                    note : params.note,
                    description : params.description,
                    category_id : params.category_id,
                    out_of_product : params.out_of_product
                }
            }
        );
    },
    deleteProduct: async (id) => {
        return await axios.delete(
            `product/delete-product/${id}`
        )
    }
};

export default productAPI;
