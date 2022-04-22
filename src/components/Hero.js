import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";

const Hero = () => (
  <div className="text-center hero my-5">
    <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
    <h1 className="mb-4">Welcome to Pizza42</h1>

    <p className="lead">
      Home of the famous Pizza Sandwich <br />           
      <NavLink to="/order-pizza" exact >Start your Pizza Journey here.</NavLink> 

    </p>
    
  </div>
);

export default Hero;
