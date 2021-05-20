import { combineReducers } from 'redux';
import authReducer from '../pages/LoginPage/slice/index';
import productReducer from '../pages/HomePage/slice/homeSlice';
import categoryReducer from '../pages/Category/slice/index';

const appReducer = combineReducers({
    auth: authReducer,
    product: productReducer,
    category: categoryReducer
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;
