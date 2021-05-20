// import node_modules
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// import service
import productAPI from "../../../services/product";

const initState = {
    productList: {
        loading: true,
        list: [],
        hasNext: false,
        page: 1,
    }
}

export const fetchProduct = createAsyncThunk(
    'product/fetchProduct',
    async (params) => {
        const {page, isLoadMore = false} = params;
        try {
            const result = await productAPI.getProduct(page);
            return {
                result,
                isLoadMore,
            };
        } catch (e) {
            throw e;
        }
    },
);

const productSlice = createSlice({
    name: 'product',
    initialState: initState,
    reducers: {
    },
    extraReducers: {
        [fetchProduct.fulfilled]: (state, action) => {
            const {result, isLoadMore} = action.payload;
            const currentList = isLoadMore
                ? state.productList.list.concat(result.data)
                : result.data;
            const hasNext = result.hasNext;
            const page = result.page;
            state.productList = {
                list: currentList,
                hasNext,
                page,
                loading: false,
            };
        },
    }
});

export default productSlice.reducer;
