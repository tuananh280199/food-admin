// import node_modules
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import categoryAPI from "../../../services/category";

// import service

const initState = {
    categoryList: {
        loading: true,
        list: [],
    }
}

export const fetchCategory = createAsyncThunk(
    'category/fetchCategory',
    async () => {
        try {
            const result = await categoryAPI.getCategory();
            return {
                result,
            };
        } catch (e) {
            throw e;
        }
    },
);

const productSlice = createSlice({
    name: 'category',
    initialState: initState,
    reducers: {
    },
    extraReducers: {
        [fetchCategory.fulfilled]: (state, action) => {
            const {result} = action.payload;
            const currentList = result.data;
            state.categoryList = {
                list: currentList,
                loading: false,
            };
        },
    }
});

export default productSlice.reducer;
