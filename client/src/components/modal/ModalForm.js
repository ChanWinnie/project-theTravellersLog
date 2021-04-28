import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { styling } from "../../GlobalStyles";
import { handleFetchUser } from "../../redux/fetchUserHelper";

const ModalForm = ({ timeOfDay, day, setShowModal, length }) => {
  const { name } = useParams();

  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const userEmail = useSelector((state) => state?.user?.email);

  const [activityValues, setActivityValues] = useState({
    name,
    day,
    timeOfDay,
    where: "",
    when: "",
    notes: "",
  });

  useEffect(() => {
    setActivityValues((activityValues) => ({
      ...activityValues,
      day: day,
    }));
  }, [day]);

  // Handle input changes:
  const handleOnChange = (event) => {
    setActivityValues({
      ...activityValues,
      [event.target.name]: event.target.value,
    });
  };

  // Check to see if limit of activities per timeofday has been reached (5):
  const handleSaveTask = (event) => {
    event.preventDefault();

    if (length >= 5) {
      console.log("too many tasks added");
      setError(true);
    }
    if (length < 5) {
      setError(false);
      addTaskToPlannerDatabase();
    }
  };

  // Add new activity to database and update redux state:
  const addTaskToPlannerDatabase = () => {
    fetch("/addtask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail,
        activityValues,
      }),
    })
      .then((res) => {
        if (res.status === 201) {
          console.log("modal added successfully");
          setActivityValues({
            name,
            day,
            timeOfDay,
            where: "",
            when: "",
            notes: "",
          });
          handleFetchUser(dispatch, userEmail);
          setShowModal(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (error) {
    return (
      <Wrapper>
        <div
          style={{
            margin: "65px auto",
            color: "red",
            fontFamily: "Open Sans",
            fontSize: "25px",
          }}
        >
          Oh no! You have exceeded your activities for this {timeOfDay}!
        </div>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <form onSubmit={(event) => handleSaveTask(event)}>
        <Box>
          <Info>
            <p>Where?</p>
            <input
              name="where"
              type="text"
              placeholder="..."
              required
              value={activityValues.where}
              onChange={handleOnChange}
            />
          </Info>
          <Info>
            <p>When?</p>
            <input
              name="when"
              type="text"
              placeholder="..."
              value={activityValues.when}
              onChange={handleOnChange}
            />
          </Info>

          <Info2>
            <p>Notes:</p>
            <textarea
              name="notes"
              placeholder="..."
              value={activityValues.notes}
              onChange={handleOnChange}
              style={{
                resize: "none",
                height: "175px",
                width: "100%",
                padding: "10px",
                marginTop: "15px",
                border: "1px solid gray",
                backgroundColor: "rgba(242, 242, 242, 0.5)",
              }}
            />
          </Info2>
        </Box>
        <SubmitButton style={{ float: "right" }} type="submit">
          Add
        </SubmitButton>
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 35px 10px;

  & input {
    padding: 0 10px;
    width: 60%;
    border: none;
    border-bottom: 1px solid gray;
    background-color: rgba(242, 242, 242, 0.5);
  }
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
`;
const Info = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-weight: bold;

  & p {
    font-size: 15px;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${styling.colorPrimary};
  color: white;
  border-radius: ${styling.borderRadius};
  padding: 8px 14px;
  font-weight: bold;
  width: 90px;
  border: 2px solid transparent;
  float: right;

  &:hover {
    background-color: white;
    color: ${styling.colorPrimary};
    border: 2px solid ${styling.colorPrimary};
  }
`;

const Info2 = styled.div`
  display: block;
  margin-bottom: 20px;
  font-weight: bold;

  & p {
    font-size: 15px;
  }
`;

export default ModalForm;
