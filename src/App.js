import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import {DefaultLayout} from "./components/DefaultLayout";
import {HomePage} from "./pages/HomePage";
import {LoginPage} from "./pages/LoginPage";
import './App.css';
import {CategoryPage} from "./pages/Category";
import {UserPage} from "./pages/User";
import {OrderPage} from "./pages/Order";
import {OrderDetailPage} from "./pages/Order/orderDetail";
import {AddCategory} from "./pages/Category/addCategory";
import {UpdateCategory} from "./pages/Category/updateCategory";
import {AddProduct} from "./pages/HomePage/addProduct";
import {UpdateProduct} from "./pages/HomePage/updateProduct";
import authAPI from "./services/auth";
import {setNewToken} from "./pages/LoginPage/slice";
import {message} from "antd";
import {UpdateRole} from "./pages/User/updateRole";
import {UpdateStatus} from "./pages/Order/updateStatus";
import {AddVoucher} from "./pages/Voucher/addVoucher";
import {UpdateVoucher} from "./pages/Voucher/updateVoucher";
import {VoucherPage} from "./pages/Voucher";

function App() {
    const dispatch = useDispatch();
    const authorize = useSelector(state => state.auth.isLoggedIn);
    const token = useSelector(
        (state) => state.auth.token,
    );

    const profile = useSelector((state) => state.auth.profile);


    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = async () => {
        try {
            await authAPI.checkToken(profile?.access_token || '');
        } catch (e) {
            throw e;
        }
    };

    useEffect(() => {
        const refresh = setTimeout(() => {
            refreshToken();
        }, 600000); //10 phut
        return () => clearTimeout(refresh);
    });

    const refreshToken = async () => {
        try {
            if (profile?.refresh_token) {
                const newToken = await authAPI.refreshToken(profile.refresh_token);
                dispatch(setNewToken({newToken: newToken.token}));
            }
        } catch (e) {
            message.error(e);
        }
    };

    const CheckLogin = ({ component: Component, ...rest }) => (
        <Route
            {...rest}
            render={(props) => (
                <Component {...props} />
            )}
        />
    );

    const PrivateRoute = ({ component: Component, ...rest }) => {
        return (
            <Route {...rest} render={(props) => {
                return (
                    authorize && token !== '' ? <DefaultLayout><Component {...props} /></DefaultLayout>
                        : <Redirect to={{pathname: '/login'}}/>
                )
            }
            }/>
        )
    }
  return (
      <Router>
        <Switch>
          <CheckLogin path="/login" exact component={LoginPage} />
          <PrivateRoute exact path='/' component={HomePage} />
          <PrivateRoute exact path='/home' component={HomePage} />
          <PrivateRoute exact path='/add-product' component={AddProduct} />
          <PrivateRoute exact path='/update-product/:id' component={UpdateProduct} />
          <PrivateRoute exact path='/category' component={CategoryPage} />
          <PrivateRoute exact path='/add-category' component={AddCategory} />
          <PrivateRoute exact path='/update-category/:id' component={UpdateCategory} />
          <PrivateRoute exact path='/voucher' component={VoucherPage} />
          <PrivateRoute exact path='/add-voucher' component={AddVoucher} />
          <PrivateRoute exact path='/update-voucher/:id' component={UpdateVoucher} />
          <PrivateRoute exact path='/user' component={UserPage} />
          <PrivateRoute exact path='/update-role/:id' component={UpdateRole} />
          <PrivateRoute exact path='/order' component={OrderPage} />
          <PrivateRoute exact path='/order-detail/:id' component={OrderDetailPage} />
          <PrivateRoute exact path='/update-status/:id' component={UpdateStatus} />
        </Switch>
      </Router>
  );
}

export default App;
