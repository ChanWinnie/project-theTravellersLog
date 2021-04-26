import React from "react";
import styled from "styled-components";
import { styling } from "../GlobalStyles";

const ButtonTwo = ({ buttonText, handleButtonClick, className }) => {
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
  background-color: ${styling.colorPrimary};
  color: white;
  padding: 8px 14px;
  font-weight: bold;
  width: 125px;
  border: 2px solid transparent;
  font-size: 15px;

  &:hover {
    background-color: white;
    color: ${styling.colorPrimary};
    border: 2px solid ${styling.colorPrimary};
  }
`;
export default ButtonTwo;
