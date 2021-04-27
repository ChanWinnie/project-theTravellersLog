import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import DayPart from "./DayPart";
import { onSmallPhoneMediaQuery } from "../../utils/responsives";

const PlannerDay = ({ day, travelLength, trip }) => {
  // console.log(trip);
  //console.log(travelLength);
  const userState = useSelector((state) => state);
  const [weekday, setWeekday] = useState();
  const [date, setDate] = useState();

  const [plannerActivities, setPlannerActivities] = useState();
  const [morningActivities, setMorningActivities] = useState([]);
  const [afternoonActivities, setAfternoonActivities] = useState([]);
  const [eveningActivities, setEveningActivities] = useState([]);

  const [showModalMorning, setShowModalMorning] = useState(false);
  const [showModalAfternoon, setShowModalAfternoon] = useState(false);
  const [showModalEvening, setShowModalEvening] = useState(false);

  const morning = "morning";
  const afternoon = "afternoon";
  const evening = "evening";

  const morningModal = "morningModal";
  const afternoonModal = "afternoonModal";
  const eveningModal = "eveningModal";

  // Get the day passed from planner page and split weekday from the date and set both to state
  useEffect(() => {
    let dayFull = day.split(" ");
    setWeekday(dayFull.shift());
    setDate(dayFull.join(" "));
  }, [day]);

  // Get activities from redux state and set to state
  useEffect(() => {
    setPlannerActivities(userState.user?.data?.activities);
  }, [userState]);

  // Filter activities by time of day, date, and trip
  const getActivitiesArray = (time) => {
    return plannerActivities?.filter(
      (tasks) =>
        tasks.timeOfDay === time && tasks.day === date && tasks.name === trip
    );
  };

  // Once we have planner activities, use filtering function to separate and set to state:
  useEffect(() => {
    const morningArray = getActivitiesArray(morning);
    setMorningActivities(morningArray);

    const afternoonArray = getActivitiesArray(afternoon);
    setAfternoonActivities(afternoonArray);

    const eveningArray = getActivitiesArray(evening);
    setEveningActivities(eveningArray);
  }, [plannerActivities]);

  return (
    <Wrapper length={travelLength}>
      <Date>
        <p style={{ fontSize: "20px" }}>{date}</p>
        <p style={{ fontSize: "12px" }}>{weekday}</p>
      </Date>
      <Time>
        <DayPart
          timeOfDay={morning}
          timeOfDayModal={morningModal}
          setShowModal={setShowModalMorning}
          showModal={showModalMorning}
          day={date}
          timeOfDayActivities={morningActivities}
          trip={trip}
        />
      </Time>
      <Time>
        <DayPart
          timeOfDay={afternoon}
          timeOfDayModal={afternoonModal}
          setShowModal={setShowModalAfternoon}
          showModal={showModalAfternoon}
          day={date}
          timeOfDayActivities={afternoonActivities}
          trip={trip}
        />
      </Time>
      <Time>
        <DayPart
          timeOfDay={evening}
          timeOfDayModal={eveningModal}
          setShowModal={setShowModalEvening}
          showModal={showModalEvening}
          day={date}
          timeOfDayActivities={eveningActivities}
          trip={trip}
        />
      </Time>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: black;

  & p {
    margin-left: 5px;
  }
  font-weight: bolder;

  width: ${(props) => (props.length > 4 ? "340px" : "100%")};

  ${onSmallPhoneMediaQuery()} {
    width: 340px;
  }
`;

const Date = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 2px 5px;
  border-bottom: 1px solid black;
  color: black;
`;

const Time = styled.div`
  border-top: 1px solid black;
  border-right: 1px solid black;
  height: 33%;
  padding: 0 5px;
  width: 100%;
`;

export default PlannerDay;
