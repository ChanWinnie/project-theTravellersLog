import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { modalStyles, styling } from "../../GlobalStyles";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchUser } from "../../redux/fetchUserHelper";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";
import { CgClose } from "react-icons/cg";
import ButtonOne from "../ButtonOne";
// import Loader from "../components/Loader";

const UpdateModal = ({
  showModal,
  setShowModal,
  trip,
  day,
  timeOfDay,
  where,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state);
  const userEmail = useSelector((state) => state?.user?.email);
  const [activity, setActivity] = useState(null);
  const [newActivityValues, setNewActivityValues] = useState({
    name: trip,
    day: day,
    timeOfDay: timeOfDay,
    where: where,
    when: "",
    notes: "",
  });

  // Filter and find activity to set to modal:
  useEffect(() => {
    const activityArray = userState.user?.data?.activities;
    const filteredArray = activityArray.filter(
      (item) =>
        item.day === day &&
        item.timeOfDay === timeOfDay &&
        item.where === where &&
        item.name === trip
    );
    setActivity(filteredArray);
  }, [userState]);

  useEffect(() => {
    if (activity && activity[0]) {
      setNewActivityValues((current) => ({
        ...current,
        when: activity[0].when,
        notes: activity[0].notes,
      }));
    }
  }, [activity]);

  console.log(activity);
  console.log(newActivityValues);

  // Handle change for when and notes fields
  const handleFormChange = (event) => {
    setNewActivityValues({
      ...newActivityValues,
      [event.target.name]: event.target.value,
    });
  };

  // Update modal input:
  const handleUpdateActivity = (event) => {
    event.preventDefault();
    fetch("/updateActivity", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail,
        newActivityValues,
      }),
    })
      .then((res) => {
        console.log(res);
        if (res.status === 204) {
          console.log("activity updated successfully");
          handleFetchUser(dispatch, userEmail);

          history.push(`/trip/${trip}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Delete modal:
  const handleDeleteActivity = (event) => {
    event.preventDefault();
    console.log("deleted");
    fetch("/removeActivity", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userEmail, newActivityValues }),
    })
      .then((res) => {
        console.log(res);
        if (res.status === 204) {
          console.log("activity deleted successfully");
          handleFetchUser(dispatch, userEmail);

          history.push(`/trip/${trip}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Modal
      isOpen={showModal}
      style={modalStyles}
      onRequestClose={() => setShowModal(false)}
    >
      <ButtonOne
        handleButtonClick={() => setShowModal(false)}
        buttonText={<CgClose size={25} />}
      />
      <div style={{ marginTop: "35px", lineHeight: "1.5" }}>
        <h2>{day}</h2>
        <p>
          Your activity for this {newActivityValues.timeOfDay} :{" "}
          {newActivityValues.where}
        </p>
      </div>
      <form
        onSubmit={(event) => handleUpdateActivity(event)}
        style={{ marginTop: "25px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            height: "20px",
            marginBottom: "15px",
          }}
        >
          <p>Time: </p>
          <input
            name="when"
            value={newActivityValues.when}
            onChange={handleFormChange}
            style={{
              height: "15px",
              padding: "4px",
              marginLeft: "10px",
              border: "none",
              borderBottom: "1px solid black",
              backgroundColor: "rgba(242,242,242, 0.5)",
            }}
          />
        </div>
        <p>Notes: </p>
        <textarea
          name="notes"
          value={newActivityValues.notes}
          onChange={handleFormChange}
          style={{
            resize: "none",
            height: "175px",
            width: "100%",
            padding: "4px",
            backgroundColor: "rgba(242,242,242, 0.5)",
          }}
        />
        <ContainerButtons>
          <Buttons type="submit" style={{ marginBottom: "5px" }}>
            Update
          </Buttons>
          <Buttons onClick={(event) => handleDeleteActivity(event)}>
            Delete
          </Buttons>
        </ContainerButtons>
      </form>
    </Modal>
  );
};

const ContainerButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 10px;
`;

const Buttons = styled.button`
  background-color: ${styling.colorPrimary};
  color: white;
  padding: 8px 14px;
  font-weight: bold;
  width: 90px;
  border: 2px solid transparent;

  &:hover {
    background-color: white;
    color: ${styling.colorPrimary};
    border: 2px solid ${styling.colorPrimary};
  }
`;

export default UpdateModal;
