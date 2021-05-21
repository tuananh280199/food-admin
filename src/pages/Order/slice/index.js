// import node_modules
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// import service
import orderAPI from "../../../services/order";

const initState = {
    orderList: {
        loading: true,
        list: [],
        hasNext: false,
        page: 1,
    },
    orderDetail: {
        list: [],
        loading: true
    }
}

export const fetchOrder = createAsyncThunk(
    'order/fetchOrder',
    async (params) => {
        const {page, isLoadMore = false} = params;
        try {
            const result = await orderAPI.getOrder(page);
            return {
                result,
                isLoadMore,
            };
        } catch (e) {
            throw e;
        }
    },
);

export const fetchOrderDetail = createAsyncThunk(
    'order/fetchOrderDetail',
    async (params) => {
        const {order_id} = params;
        try {
            const result = await orderAPI.getOrderDetail(order_id);
            return {
                result,
            };
        } catch (e) {
            throw e;
        }
    },
);

const orderSlice = createSlice({
    name: 'order',
    initialState: initState,
    reducers: {
    },
    extraReducers: {
        [fetchOrder.fulfilled]: (state, action) => {
            const {result, isLoadMore} = action.payload;
            const currentList = isLoadMore
                ? state.orderList.list.concat(result.data)
                : result.data;
            const hasNext = result.hasNext;
            const page = result.page;
            state.orderList = {
                list: currentList,
                hasNext,
                page,
                loading: false,
            };
        },
        [fetchOrderDetail.fulfilled]: (state, action) => {
            const {result} = action.payload;
            state.orderDetail = {
                list: result.data,
                loading: false,
            };
        },
    }
});

export default orderSlice.reducer;
