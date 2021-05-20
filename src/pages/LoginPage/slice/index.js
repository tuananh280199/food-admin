import { createSlice } from '@reduxjs/toolkit';

const initState = {
    token: '',
    isLoggedIn: false,
    profile: {},
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initState,
    reducers: {
        login (state, action) {
            const { token, profile } = action.payload;
            state.token = token;
            state.isLoggedIn = true;
            state.profile = profile.profile;
        },
        logout (state, action) {
            state.token = '';
            state.isLoggedIn = false;
            state.profile = {};
        },
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
