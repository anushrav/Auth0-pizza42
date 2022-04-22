import React from "react";
import { 
  Card, CardText, CardBody, 
  CardTitle, CardSubtitle,
  Container, Row, Col
} from "reactstrap";
import Moment from 'react-moment';

const Ordertile = (props) => (
      <Card color="warning">
        <CardBody>
          <CardTitle tag="h5"> {props.order.crustType} Pizza</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">Ordered at {(<Moment format="hh:mm A">{props.order.createdOn}</Moment>)} on {(<Moment format="M/D/YY">{props.order.createdOn}</Moment>)}</CardSubtitle>
          <Container>
            <Row xs="12">
              <Col xs="2">
                <CardText><b>Sauce:</b></CardText>
              </Col>
              <Col xs="10">
                <CardText>{props.order.sauce}</CardText>
              </Col>
            </Row>
            {props.order.toppings.length !== 0 && <Row xs="12">
              <Col xs="2">
                <CardText><b>Toppings:</b></CardText>
              </Col>
              <Col xs="10">
                {props.order.toppings.map((key) => {
                  return(
                  <Row key={`toppings${key}`}>
                    {key}
                  </Row>
                  );
                })}
              </Col>
            </Row>}
            {props.order.sides.length !== 0 &&
            <Row xs="12">
              <Col xs="2">
                <CardText><b>Sides:</b></CardText>
              </Col>
              <Col xs="10">
                {props.order.sides.map((key) => {
                  return(
                  <Row key={`sides${key}`}>
                    {key}
                  </Row>
                  );
                })}
              </Col>
            </Row>}
          </Container>
        </CardBody>
      </Card>
);

export default Ordertile;