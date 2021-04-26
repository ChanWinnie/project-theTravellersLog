import React from "react";
import styled from "styled-components";
import { styling } from "../../GlobalStyles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { handleFetchUser } from "../../redux/fetchUserHelper";
import PlannerDay from "./PlannerDay";
import ErrorPage from "../ErrorPage";
import Loader from "../../components/Loader";
import ButtonTwo from "../../components/ButtonTwo";

const Planner = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const state = useSelector((state) => state);
  const userTrip = useSelector((state) => state?.user?.data?.trips);
  const userEmail = useSelector((state) => state?.user?.email);
  const { name } = useParams();
  const currentTrip = userTrip?.find((trip) => trip.name === name);

  // Delete trip from database and update state:
  const handleDeleteTrip = () => {
    const tripName = currentTrip.name;
    fetch("/remove", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tripName, userEmail }),
    })
      .then((res) => {
        console.log(res);
        if (res.status === 204) {
          console.log("trip deleted successfully");
          handleFetchUser(dispatch, userEmail);
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (state.status === "loading") {
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
    );
  }

  if (currentTrip === undefined) {
    return <ErrorPage errorText={"Error 404: Trip not found"} />;
  }

  return (
    <Wrapper>
      {currentTrip && (
        <>
          <h4>Headed to {currentTrip.location}</h4>
          <Container>
            <Day>
              {currentTrip?.dates?.map((day) => {
                return (
                  <PlannerDay
                    key={currentTrip.location + day}
                    day={day}
                    travelLength={currentTrip.dates.length}
                    trip={currentTrip.name}
                  />
                );
              })}
            </Day>
          </Container>
          <DeleteButton
            type="button"
            handleButtonClick={() => handleDeleteTrip()}
            buttonText={"Cancel Trip"}
          />
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  overflow-y: hidden;

  & h4 {
    margin: 20px 5px;
    font-size: 25px;
    padding: 5px;
    text-align: center;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0 35px;
  overflow-x: scroll;
  border-radius: ${styling.borderRadius};
  border: ${styling.border};
  background-color: ${styling.backgroundColor};
  border: 5px solid blue;

  &::-webkit-scrollbar {
    height: 10px;
    width: 5px;
    background: rgba(255, 255, 255, 0);
    border-top: 1.5px solid black;
  }
  &::-webkit-scrollbar-thumb {
    background-color: black;
  }

  & p {
    margin: 3px auto;
    font-size: 14px;
  }
`;

const Day = styled.div`
  min-height: inherit;
  display: grid;
  grid-auto-flow: column;
`;

const DeleteButton = styled(ButtonTwo)`
  float: right;
  margin: 10px 35px 10px 0;
`;

export default Planner;
