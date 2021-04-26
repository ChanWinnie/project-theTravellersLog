import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { handleFetchUser } from "../redux/fetchUserHelper";
import { BsCalendar } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subDays, format } from "date-fns";
import MapGoogle from "../components/map/MapGoogle";
import { styling } from "../GlobalStyles";
import {
  onSmallPhoneMediaQuery,
  onTabletMediaQuery,
} from "../utils/responsives";

const PlanTrip = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userEmail = useSelector((state) => state?.user?.email);
  const userTrips = useSelector((state) => state?.user?.data?.trips);
  const [tripValues, setTripValues] = useState({
    name: "",
    location: "",
    coordinates: {},
    dates: [],
  });
  const [openCalendar, setOpenCalender] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [nameError, setNameError] = useState(false);

  // Once you have start and end date, get array of dates between and set to state:
  useEffect(() => {
    const dateArray = getDates(startDate, endDate);
    setTripValues((tripValues) => ({
      ...tripValues,
      dates: dateArray,
    }));
  }, [endDate]);

  // Once you have location passed from map/search, set to state:
  useEffect(() => {
    setTripValues((tripValues) => ({
      ...tripValues,
      location: location,
    }));
  }, [location]);

  // Once you have coordinates passed from map/search, set to state:
  useEffect(() => {
    setTripValues((tripValues) => ({
      ...tripValues,
      coordinates: coordinates,
    }));
  }, [coordinates]);

  // Check if name already exists in user state, if yes, set error:
  const handleNameChange = (event) => {
    const nameExists = userTrips?.find(
      (trip) => trip.name.toLowerCase() === event.target.value.toLowerCase()
    );
    console.log(nameExists);
    if (nameExists) {
      setNameError(true);
      setTripValues((tripValues) => ({
        ...tripValues,
        name: event.target.value,
      }));
    } else {
      setTripValues((tripValues) => ({
        ...tripValues,
        name: event.target.value,
      }));
      setNameError(false);
    }
  };

  // Get array of dates between 2 days
  const getDates = (startDate, endDate) => {
    let dates = [],
      addDays = function (days) {
        const date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
    while (startDate <= endDate) {
      dates.push(startDate);
      startDate = addDays.call(startDate, 1);
    }
    return dates.map((date) => format(date, "EEEE MMMM do yyyy"));
  };

  // Get start and end date from datepicker:
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  // Submit and add trip to user document in database:
  const handleAddTripToPlanner = (event) => {
    console.log(userEmail);
    event.preventDefault();
    if (!nameError) {
      fetch("/addtrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail, tripValues }),
      })
        .then((res) => {
          if (res.status === 201) {
            console.log("trip added successfully");
            handleFetchUser(dispatch, userEmail);
          }
        })
        .then(() => {
          history.push(`/trip/${tripValues.name}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Wrapper>
      <h2 style={{ textAlign: "center" }}>Start Your Adventure</h2>
      <form onSubmit={(event) => handleAddTripToPlanner(event)}>
        <DataContainer>
          <Data>
            <p>Name: </p>
            <input
              name="name"
              type="text"
              placeholder="Summer2021"
              required
              value={tripValues.name}
              onChange={handleNameChange}
            />
            {nameError && (
              <div
                style={{
                  color: "#ED4337",
                  fontSize: "14px",
                  fontWeight: "bold",
                  border: "2px solid #ED4337",
                  width: "150px",
                  position: "relative",
                  padding: "12px",
                  marginLeft: "5px",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: "3px",
                  fontFamily: "Open Sans, sans-serif",
                }}
              >
                Error: existing name
              </div>
            )}
          </Data>
          <Data>
            <BsCalendar
              size={30}
              onClick={() => setOpenCalender(!openCalendar)}
            />
            <input
              value={
                endDate
                  ? `${format(startDate, "MMMM do")} - ${format(
                      endDate,
                      "MMMM do"
                    )}`
                  : ""
              }
              placeholder="Travel dates"
              required // not sure if need
              readOnly
            />

            <ViewPart>
              {openCalendar && (
                <DatePicker
                  selected={startDate}
                  onChange={onChange}
                  startDate={startDate}
                  endDate={endDate}
                  minDate={subDays(new Date(), 0)}
                  selectsRange
                  // showYearDropdown
                  dropdownMode="select"
                  inline
                />
              )}
            </ViewPart>
          </Data>
        </DataContainer>
        <MapGoogle
          showSearchBar={true}
          setLocation={setLocation}
          setCoordinates={setCoordinates}
        />
        <AddTrip type="submit">Add Trip</AddTrip>
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: 20px auto 0 auto;
  padding: 15px;
  width: 80%;
  height: 100vh;
  border-radius: ${styling.borderRadius};
  background-color: ${styling.backgroundColor};
`;

const ViewPart = styled.div`
  position: absolute;
  top: 35%;
  z-index: 3;
  font-weight: bold;
`;

const DataContainer = styled.div`
  display: flex;

  ${onSmallPhoneMediaQuery()} {
    flex-direction: column;
    align-items: center;
  }
  ${onTabletMediaQuery()} {
    flex-direction: column;
    align-items: center;
  }

  justify-content: space-evenly;
  margin: 20px;
`;

const Data = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  & input {
    margin-left: 10px;
    border: 1px solid gray;
  }
`;

const AddTrip = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${styling.colorPrimary};
  color: white;
  border-radius: ${styling.borderRadius};
  margin-top: 10px;
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

export default PlanTrip;
