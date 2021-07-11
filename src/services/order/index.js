import axios from "../../axios/index";

const orderAPI = {
    getOrder: async (page) => {
        const data = await axios.get(
            `/order/get-all-order?page=${page}`,
        );
        return data;
    },
    getOrderDetail: async (order_id) => {
        const data = await axios.get(
            `/order/get-order/${order_id}`,
        );
        return data;
    },
    updateOrderStatus: async (status, id, user_id) => {
        return await axios.put(
            `/order/update-status/${id}`, {
                status,
                user_id
            }
        );
    },
};

export default orderAPI;
