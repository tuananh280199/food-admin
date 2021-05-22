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

const categorySlice = createSlice({
    name: 'category',
    initialState: initState,
    reducers: {
        deleteCategoryItem(state, action) {
            const {id} = action.payload;
            const newList = state.categoryList.list.filter(item => item.id !== id);
            state.categoryList.list = newList;
        }
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

export const {
    deleteCategoryItem,
} = categorySlice.actions;

export default categorySlice.reducer;
