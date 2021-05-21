import { combineReducers } from 'redux';
import authReducer from '../pages/LoginPage/slice/index';
import productReducer from '../pages/HomePage/slice/homeSlice';
import categoryReducer from '../pages/Category/slice/index';
import userReducer from '../pages/User/slice/index';
import orderReducer from '../pages/Order/slice/index';

const appReducer = combineReducers({
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    user: userReducer,
    order: orderReducer
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;
