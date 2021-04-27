import React from "react";
import styled from "styled-components";
import { styling } from "../GlobalStyles";
import { useAuth0 } from "@auth0/auth0-react";
import ButtonTwo from "../components/ButtonTwo";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Wrapper>
      <h2>Create a new account</h2>
      <h3 style={{ marginBottom: "10px" }}>
        with TheTravellersLog to start planning your next adventure!
      </h3>
      <ButtonTwo
        buttonText={"Sign Up"}
        handleButtonClick={() => {
          loginWithRedirect({
            action: "signup",
          });
        }}
      />
      <h4 style={{ margin: "20px 0 10px 0" }}>Already a user?</h4>
      <ButtonTwo handleButtonClick={loginWithRedirect} buttonText={"Login"} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 80%;
  height: 50%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin: 0;
  padding: 3%;

  border-radius: ${styling.borderRadius};
  background-color: ${styling.backgroundColor};

  position: absolute;
  top: 55%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  text-align: center;
  line-height: 1.5;
`;

export default Login;
