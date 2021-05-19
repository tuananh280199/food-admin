import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import {LoginPage} from "./pages/LoginPage";

const CheckLogin = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) => (
            <Component {...props} />
        )}
    />
);

function App() {
  return (
      <Router>
        <Switch>
          <CheckLogin path="/login" exact component={LoginPage} />
        </Switch>
      </Router>
  );
}

export default App;
