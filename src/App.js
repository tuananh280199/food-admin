import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useEffect } from "react";
import {useSelector, useDispatch} from "react-redux";

import {DefaultLayout} from "./components/DefaultLayout";
import {HomePage} from "./pages/HomePage";
import {LoginPage} from "./pages/LoginPage";
import './App.css';
import {CategoryPage} from "./pages/Category";

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
          <PrivateRoute exact path='/category' component={CategoryPage} />
        </Switch>
      </Router>
  );
}

export default App;
