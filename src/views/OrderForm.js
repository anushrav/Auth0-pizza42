import React, { useState, Fragment } from "react";



import { 
  Container, Row, Col, // used for framing
  Card, CardText, CardBody, // used for graceful redirect
  CardTitle, CardSubtitle, Button, 
  Form, FormGroup, Label, Input, FormFeedback,  // used for pizza form
  CustomInput, 
  Alert // used to display verify email warning
} from "reactstrap";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Ordertile from "../components/OrderTile";

export const PizzaOrder = () => {
  const { apiOrigin } = getConfig();
  const { audience } = getConfig();
  
  const { user } = useAuth0();
  const isEmailVerified = user['email_verified'];

  // react functional component state
  const [state, setState] = useState({
    loading: false,
    orderForm: {
      orderFor: user.name,
      sauce:'House Marinara',
      crustType: 'Traditional Hand Tossed',
      toppings:[],
      sides:[],
      nameValid: true
    },
    submitting: false,
    order: {},
    orderComplete: false,
    error: null,
  });

  const {
    getAccessTokenSilently,
    loginWithPopup,
    getAccessTokenWithPopup,
  } = useAuth0();

  const handleConsent = async () => {
    try {
      await getAccessTokenWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }

    await callApi();
  };

  const handleLoginAgain = async () => {
    try {
      await loginWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }

    await callApi();
  };

  const callApi = async () => {
    try {
      
      setState({ ...state, submitting: true});

      const token = await getAccessTokenSilently({
        audience: `${audience}`,
        scope: 'create:orders',
      });

      // strip extra state info
      const order = { ...state.orderForm };
      delete order['nameValid'];

      const response = await fetch(`${apiOrigin}/api/orderPizza`, {
        method: 'POST',
        // may need CORS in here depending on Heroku implementation
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
      });

      const responseData = await response.json();


      setState({
        ...state,
        showResult: true,
        submitting: false,
        order: responseData.order,
        orderComplete: true
      });
    } catch (error) {
      setState({
        ...state,
        submitting: false,
        error: error.error,
      });
    }
  };

  const handle = (e, fn) => {
    e.preventDefault();
    fn();
  };

  // category optional parameter for checkboxes
  const modifyOrder = (key, type, value, category) => {

    const newOrderForm = state.orderForm;

    // if its straight key value pair, set it
    if(type === 'text' || type === 'select-one') {
      newOrderForm[key] = value;

      // check name to make sure its not blank
      if(key === 'orderFor' && value.length < 1){
        newOrderForm.nameValid = false;
      } else if(key === 'orderFor' && value.length >= 1){
        newOrderForm.nameValid = true;
      }
    }

    // if its checkbox, use logic to either add or remove it from the array
    if(category && type==='checkbox') {
      
      // add case
      if(value) {
          // if it doesn't exist, add it
          if(newOrderForm[category].indexOf(key) === -1) {
            newOrderForm[category].push(key);
          } 

      } else { // remove case

          // if it exists, remove it
          const index = newOrderForm[category].indexOf(key)
          if(index !== -1) {
            newOrderForm[category].splice(index,1);
          } 
      }
    }
    // set the new state
    setState(
      {
        orderForm: newOrderForm
      }
    );


  }

  return (
    <Fragment>
      {
        !state.orderComplete && 
          <Form>

              {/* Keep default api handlers */}
              {state.error === "consent_required" && (
                <Alert color="warning">
                  You need to{" "}
                  <a
                    href="#/"
                    class="alert-link"
                    onClick={(e) => handle(e, handleConsent)}
                  >
                    consent to get access to Pizza ordering
                  </a>
                </Alert>
              )}

              {state.error === "login_required" && (
                <Alert color="warning">
                  You need to{" "}
                  <a
                    href="#/"
                    class="alert-link"
                    onClick={(e) => handle(e, handleLoginAgain)}
                  >
                    log in again
                  </a>
                </Alert>
              )}

            {!isEmailVerified && 
              <Alert color="warning">
                Please verify your email before ordering at our delicous store. You should have received a verification email at {user.email}
              </Alert>
            }
            <FormGroup>
              <Label for="OrderName"><b>Name this Order:</b></Label>
              <Input invalid={!state.orderForm.nameValid} name="OrderName" id="OrderName" defaultValue= "New order" onChange={(e) => {modifyOrder(e.target.name, e.target.type, e.target.value)}}/>
              <FormFeedback>Please give this order a name!</FormFeedback>
            </FormGroup>
            <FormGroup row>
              <Label for="CrustType" sm={2}><b> Crust:</b></Label>
              <Col sm={10}>
                <Input type="select" name="crustType" id="CrustType" onChange={(e) => {modifyOrder(e.target.name, e.target.type, e.target.value)}}>
                  <option>Traditional Hand Tossed</option>
                  <option>New York Style Thin Crust</option>
                  <option>Chicago Style Deep Dish</option>
                  <option>4/20 Special Cheesy Crust </option>
                  <option>Garlic Butter Crust</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="Sauce" sm={2}><b>Sauce:</b></Label>
              <Col sm={10}>
                <Input type="select" name="sauce" id="Sauce" onChange={(e) => {modifyOrder(e.target.name, e.target.type, e.target.value)}}>
                  <option>House Marinara</option>
                  <option>Alfredo</option>
                  <option>Ranch Special</option>
                  <option>Honey BBQ</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={2}><b>Toppings:</b></Label>
              <Col sm={10}>
                <CustomInput type="checkbox" id="Bacon" label="Bacon 🥓" onChange={(e) => {modifyOrder(e.target.id, e.target.type, e.target.checked, 'toppings')}}/>
                <CustomInput type="checkbox" id="Pepperoni" label="Pepperoni 🍕" onChange={(e) => {modifyOrder(e.target.id, e.target.type, e.target.checked, 'toppings')}}/>
                <CustomInput type="checkbox" id="Mushrooms" label="Mushrooms 🍄" onChange={(e) => {modifyOrder(e.target.id, e.target.type, e.target.checked, 'toppings')}}/>
                <CustomInput type="checkbox" id="Green Peppers" label="Green Peppers 🫑" onChange={(e) => {modifyOrder(e.target.id, e.target.type, e.target.checked, 'toppings')}}/>
                <CustomInput type="checkbox" id="Jalapeños" label="Jalapeños 🌶️" onChange={(e) => {modifyOrder(e.target.id, e.target.type, e.target.checked, 'toppings')}}/>
                <CustomInput type="checkbox" id="Onions" label="Onions 🧅" onChange={(e) => {modifyOrder(e.target.id, e.target.type, e.target.checked, 'toppings')}}/>
                <CustomInput type="checkbox" id="Anchovies" label="Anchovies 🐟" onChange={(e) => {modifyOrder(e.target.id, e.target.type, e.target.checked, 'toppings')}}/>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={2}><b>Sides:</b></Label>
              <Col sm={10}>
                <CustomInput type="checkbox" id="Cheesy Garlic Bread" label="Cheesy Garlic Bread" onChange={(e) => {modifyOrder(e.target.id, e.target.type, e.target.checked, 'sides')}}/>
                <CustomInput type="checkbox" id="Garlic Knots with Spinach Dip" label="Garlic Knots with Spinach Dip" onChange={(e) => {modifyOrder(e.target.id, e.target.type, e.target.checked, 'sides')}}/>
                <CustomInput type="checkbox" id="Marinara Dipping Sauce" label="Marinara Dipping Sauce" onChange={(e) => {modifyOrder(e.target.id, e.target.type, e.target.checked, 'sides')}}/>
              </Col>
            </FormGroup>
            <Button color="primary" disabled={!isEmailVerified || !state.orderForm.nameValid || state.submitting} onClick={callApi}>Place Order</Button>
          </Form>
      }
      {
        state.orderComplete && 
        <Ordertile order={state.order}/>
      }
    </Fragment>
  );
};

export default withAuthenticationRequired(PizzaOrder, {
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