import React from "react";
import styled from "styled-components";
import { styling } from "../GlobalStyles";

const ButtonOne = ({ buttonText, handleButtonClick, className }) => {
  return (
    <Wrapper
      className={className}
      onClick={() => {
        handleButtonClick();
      }}
    >
      {buttonText}
    </Wrapper>
  );
};

const Wrapper = styled.button`
  background: transparent;
  padding: 3px;
  float: right;
  &:hover {
    background-color: ${styling.colorPrimary};
    color: white;
  }
`;

export default ButtonOne;
