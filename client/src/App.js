import React, { useEffect } from "react";
import styled from "styled-components";
import GlobalStyles from "./GlobalStyles";
import appImage from "./images/toms-rits-unsplash.jpg";
import { useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Routes from "./Routes";
import { handleFetchUser } from "./redux/fetchUserHelper";
import NavBar from "./components/NavBar";
import Loader from "./components/Loader";
import Modal from "react-modal";

Modal.setAppElement("#root");

const App = () => {
  const { isLoading, user } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const email = user.email;
      handleFetchUser(dispatch, email);
    }
    document.title = `The Travellers Log`;
  }, [user]);

  if (isLoading) {
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
    );
  }

  return (
    <BrowserRouter>
      <GlobalStyles />
      <Wrapper>
        <NavBar />
        <Routes />
      </Wrapper>
    </BrowserRouter>
  );
};

const Wrapper = styled.div`
  max-width: 100vw;
  min-height: 100vh;
  background-image: url(${appImage});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  padding-bottom: 20px;
`;

export default App;
