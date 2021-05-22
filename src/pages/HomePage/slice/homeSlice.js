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
    },
    productListSearch: {
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

export const fetchDataSearchByName = createAsyncThunk(
    'search/searchByName',
    async (params) => {
        const {page, keyWord, isLoadMore = false} = params;
        try {
            const result = await productAPI.searchProductByName(keyWord, page);
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
        deleteProductItem(state, action) {
            const {id} = action.payload;
            const newList = state.productList.list.filter(item => item.id !== id);
            state.productList.list = newList;
            const newListSearch = state.productListSearch.list.filter(item => item.id !== id);
            state.productListSearch.list = newListSearch;
        }
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
        [fetchDataSearchByName.fulfilled]: (state, action) => {
            const {result, isLoadMore} = action.payload;
            const currentList = isLoadMore
                ? state.productListSearch.list.concat(result.data)
                : result.data;
            const hasNext = result.hasNext;
            const page = result.page;
            state.productListSearch = {
                list: currentList,
                hasNext,
                page,
                loading: false,
            };
        },
    }
});

export const {
    deleteProductItem,
} = productSlice.actions;

export default productSlice.reducer;
