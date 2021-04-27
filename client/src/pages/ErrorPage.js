import React from "react";
import styled from "styled-components";
import { styling } from "../GlobalStyles";
import { RiErrorWarningFill } from "react-icons/ri";

const ErrorPage = () => {
  return (
    <Wrapper>
      <h1>404 Error Page</h1>
      <RiErrorWarningFill size={25} />
      <h3>Sorry, the page you requested could not be found.</h3>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 50%;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  text-align: center;
  line-height: 2;
  padding: 50px 0px;

  border-radius: ${styling.borderRadius};
  background-color: ${styling.backgroundColor};
`;

export default ErrorPage;
