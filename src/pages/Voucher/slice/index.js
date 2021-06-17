// import node_modules
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import voucherAPI from "../../../services/voucher";

// import service

const initState = {
    voucherList: {
        loading: true,
        list: [],
    }
}

export const fetchVoucher = createAsyncThunk(
    'voucher/fetchVoucher',
    async () => {
        try {
            const result = await voucherAPI.getVoucher();
            return {
                result,
            };
        } catch (e) {
            throw e;
        }
    },
);

const voucherSlice = createSlice({
    name: 'voucher',
    initialState: initState,
    reducers: {
        deleteVoucherItem(state, action) {
            const {id} = action.payload;
            const newList = state.voucherList.list.filter(item => item.id !== id);
            state.voucherList.list = newList;
        }
    },
    extraReducers: {
        [fetchVoucher.fulfilled]: (state, action) => {
            const {result} = action.payload;
            const currentList = result.data;
            state.voucherList = {
                list: currentList,
                loading: false,
            };
        },
    }
});

export const {
    deleteVoucherItem,
} = voucherSlice.actions;

export default voucherSlice.reducer;
