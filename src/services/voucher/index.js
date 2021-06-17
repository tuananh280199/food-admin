import axios from "../../axios/index";

const voucherAPI = {
    getVoucher: async () => {
        const data = await axios.get(
            "/order/get-all-voucher",
        );
        return data;
    },
    addVoucher: async (params) => {
        return await axios.post(
            "/order/add-voucher", {
                data : {
                    name : params.name,
                    discount_price : params.discount_price,
                    discount_percent: params.discount_percent,
                    min_price_to_use: params.min_price_to_use,
                    expired_in: params.expired_in
                }
            }
        );
    },
    updateVoucher: async (params, id) => {
        return await axios.put(
            `/order/update-voucher/${id}`, {
                data : {
                    name : params.name,
                    discount_price : params.discount_price,
                    discount_percent: params.discount_percent,
                    min_price_to_use: params.min_price_to_use,
                    expired_in: params.expired_in
                }
            }
        );
    },
    deleteVoucher: async (id) => {
        return await axios.delete(
            `/order/delete-voucher/${id}`
        )
    }
};

export default voucherAPI;
