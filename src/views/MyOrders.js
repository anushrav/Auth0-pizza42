import React, { useState, useEffect, Fragment } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import logo from "../assets/logo.svg";


import { 
  Container, Row, Col, // used for framing
  Card, CardText, CardBody, // used for graceful redirect
  CardTitle, CardSubtitle, NavLink, 
} from "reactstrap";

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Ordertile from "../components/OrderTile";
import Loading from "../components/Loading";

export const MyOrders = () => {
  const { apiOrigin } = getConfig();
  
  // react functional component state
  const [state, setState] = useState({
    orders: [],
    error: null,
    loading:true
  });

  const {
    getAccessTokenSilently,
  } = useAuth0();


  const callApi = async () => {
    try {
      const token = await getAccessTokenSilently();

      // strip extra state info
      const order = { ...state.orderForm };
      delete order['nameValid'];

      const response = await fetch(`${apiOrigin}/api/myOrders`, {
        // may need CORS in here depending on Heroku implementation
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const responseData = await response.json();

      const newState = {...state}

      if(typeof responseData.order === "object") {
        newState.orders = responseData.order
      }

      newState.loading = false;

      setState(newState);
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }
  };

  // debounce load
  useEffect(() => {
    callApi();

    // https://css-tricks.com/run-useeffect-only-once/
    // eslint-disable-next-line 
  }, []);

  return (
    <Fragment>
      {
        state.loading && (
          <Loading/>
        )
      }
      {
        !state.loading && state.orders !== undefined && state.orders.length!== 0 && 
          (
            <div>
              {state.orders.map((order) => {
                return <Ordertile key={order.id} order={order}/>
              })}
            </div>
          )
        
      }
      {
         !state.loading && state.orders.length === 0 && (
          <Container className="mb-0">
          <Row className="align-items-center profile-header mb-5 text-center text-md-center">
            <Col xs="12">
              <Card>
                  <CardBody>
                  <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
                  <CardTitle tag="h2">Welcome to Pizza42!</CardTitle>
                  <CardSubtitle tag="h6" className="mb-2 text-muted">Looks like you have not ordered with us before</CardSubtitle>
                  <CardText>Try our new pizza sandwich </CardText>
                  <NavLink
                      tag={RouterNavLink}
                      to="/order-pizza"
                      exact
                      activeClassName="router-link-exact-active"
                  >
                  Create your first order here
                </NavLink>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
         )
      }
    </Fragment>
  );
};

export default withAuthenticationRequired(MyOrders, {
  onRedirecting: () => {
    return (
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-center">
        <Col xs="12">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Welcome to Pizza42!</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">Try our new pizza sandwich</CardSubtitle>
              <CardText>You need to be logged in to order pizza. Redirecting you to login page now.</CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
    )
  },
});