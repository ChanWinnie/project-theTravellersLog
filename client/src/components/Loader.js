import React from "react";
import styled, { keyframes } from "styled-components";
import { VscLoading } from "react-icons/vsc";

const Loader = () => {
  return (
    <Wrapper>
      <VscLoading size={50} color={"white"} />
    </Wrapper>
  );
};

const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(359deg);
    }
`;

const Wrapper = styled.div`
  width: 50px;
  height: 50px;
  margin: 300px auto;
  animation: ${rotate} linear infinite 3000ms;
`;

export default Loader;
