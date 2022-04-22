import React from "react";
import logo from "../assets/logo.svg";

const Footer = () => (
  <footer className="bg-light p-3 text-center">
    <div>
      <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
    </div>
    <p>
      Geeze Louise, Papa Cheese, This is some good <a href="https://auth0.com">Pizza</a>
    </p>
  </footer>
);

export default Footer;
