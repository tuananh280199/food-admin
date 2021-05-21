// import node_modules
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// import service
import userAPI from "../../../services/user";
import productAPI from "../../../services/product";

const initState = {
    userList: {
        loading: true,
        list: [],
        hasNext: false,
        page: 1,
    },
    userListSearch: {
        loading: true,
        list: [],
        hasNext: false,
        page: 1,
    }
}

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (params) => {
        const {page, isLoadMore = false} = params;
        try {
            const result = await userAPI.getUser(page);
            return {
                result,
                isLoadMore,
            };
        } catch (e) {
            throw e;
        }
    },
);

export const fetchUserSearchByName = createAsyncThunk(
    'user/searchUserByName',
    async (params) => {
        const {page, keyWord, isLoadMore = false} = params;
        try {
            const result = await userAPI.searchUserByName(keyWord, page);
            return {
                result,
                isLoadMore,
            };
        } catch (e) {
            throw e;
        }
    },
);

const userSlice = createSlice({
    name: 'user',
    initialState: initState,
    reducers: {
    },
    extraReducers: {
        [fetchUser.fulfilled]: (state, action) => {
            const {result, isLoadMore} = action.payload;
            const currentList = isLoadMore
                ? state.userList.list.concat(result.data)
                : result.data;
            const hasNext = result.hasNext;
            const page = result.page;
            state.userList = {
                list: currentList,
                hasNext,
                page,
                loading: false,
            };
        },
        [fetchUserSearchByName.fulfilled]: (state, action) => {
            const {result, isLoadMore} = action.payload;
            const currentList = isLoadMore
                ? state.userListSearch.list.concat(result.data)
                : result.data;
            const hasNext = result.hasNext;
            const page = result.page;
            state.userListSearch = {
                list: currentList,
                hasNext,
                page,
                loading: false,
            };
        },
    }
});

export default userSlice.reducer;
