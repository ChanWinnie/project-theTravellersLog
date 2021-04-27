import React from "react";
import styled from "styled-components";
import { styling } from "../GlobalStyles";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Login from "./Login";
import Loader from "../components/Loader";
import ButtonTwo from "../components/ButtonTwo";
import {
  onSmallPhoneMediaQuery,
  onTabletMediaQuery,
  onDesktopMediaQuery,
  onLargeDesktopMediaQuery,
} from "../utils/responsives";
import { FaCaravan, FaPenAlt } from "react-icons/fa";

const Home = () => {
  const state = useSelector((state) => state);
  const status = state?.status;
  const user = state?.user;
  const history = useHistory();

  const handleHomeButtonClick = (path) => {
    history.push(`/${path}`);
  };

  if (status === "loading") {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <>
      {user ? (
        <Wrapper>
          <Container>
            <div>
              <h3>Start Planning</h3>
              <FaPenAlt size={18} color={"#CD963E"} />
              <p>Pick your dates and your destination</p>
              <p>Start filling in your itenerary!</p>
            </div>
            <ButtonTwo
              handleButtonClick={() => handleHomeButtonClick("plan")}
              buttonText={"Start"}
            />
          </Container>
          <Container>
            <div>
              <h3>Start Exploring</h3>
              <FaCaravan size={18} color={"#CD963E"} />
              <p>Find new attractions</p>
              <p>Search nearby cafés, museums, and more!</p>
            </div>
            <ButtonTwo
              handleButtonClick={() => handleHomeButtonClick("explore")}
              buttonText={"Start"}
            />
          </Container>
        </Wrapper>
      ) : (
        <Login />
      )}
    </>
  );
};

const Wrapper = styled.div`
  height: 75vh;

  display: flex;
  justify-content: space-between;

  ${onSmallPhoneMediaQuery()} {
    width: 80%;
    flex-direction: column;
    margin: 50px auto 0 auto;
  }
  ${onTabletMediaQuery()} {
    width: 80%;
    flex-direction: column;
    margin: 40px auto 0 auto;
  }
  ${onDesktopMediaQuery()} {
    width: 75%;
    margin: 40px auto 0 auto;
  }
  ${onLargeDesktopMediaQuery()} {
    width: 75%;
    margin: 55px auto 0 auto;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  margin: auto;
  padding: 10px;

  text-align: center;
  line-height: 1.5;

  border-radius: ${styling.borderRadius};
  background-color: ${styling.backgroundColor};

  ${onSmallPhoneMediaQuery()} {
    min-width: 100%;
    max-height: 45%;
    & p {
      font-size: 12px;
    }
  }
  ${onTabletMediaQuery()} {
    min-width: 100%;
    max-height: 45%;
  }
  ${onDesktopMediaQuery()} {
    width: 45%;
    height: 80%;
  }
  ${onLargeDesktopMediaQuery()} {
    width: 45%;
    height: 80%;
    padding: 25px;
    line-height: 2;
  }
`;

export default Home;
