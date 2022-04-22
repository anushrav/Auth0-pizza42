import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import OrderForm from "./views/OrderForm";
import MyOrders from "./views/MyOrders";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";

// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
import Loading from "./components/Loading";
initFontAwesome();

const App = () => {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          {!isLoading  && 
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/order-pizza" component={OrderForm} />
            <Route path="/my-orders" component={MyOrders} />
          </Switch>
          }

          {/* Since Skeletons aren't in the ReactStrap Library, I am emulating this with a jumbotron */}
          {isLoading && 
          <Loading/>
          }

        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
