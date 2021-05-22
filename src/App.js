import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import {useSelector} from "react-redux";

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

function App() {
    const authorize = useSelector(state => state.auth.isLoggedIn);

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
                    authorize ? <DefaultLayout><Component {...props} /></DefaultLayout>
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
          <PrivateRoute exact path='/user' component={UserPage} />
          <PrivateRoute exact path='/order' component={OrderPage} />
          <PrivateRoute exact path='/order-detail/:id' component={OrderDetailPage} />
        </Switch>
      </Router>
  );
}

export default App;
