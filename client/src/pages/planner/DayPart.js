import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { styling } from "../../GlobalStyles";
import { MdAdd } from "react-icons/md";
import ModalPopUp from "../../components/modal/ModalPopUp";
import UpdateModal from "../../components/modal/UpdateModal";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const DayPart = ({
  timeOfDay,
  timeOfDayModal,
  setShowModal,
  showModal,
  day,
  timeOfDayActivities,
  trip,
}) => {
  const [activitiesArray, setActivitiesArray] = useState(null);
  const [orderChange, setOrderChange] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  // To pass to updateModal:
  const [activityDay, setActivityDay] = useState(null);
  const [activityTime, setActivityTime] = useState(null);
  const [activityWhere, setActivityWhere] = useState(null);

  useEffect(() => {
    setActivitiesArray(timeOfDayActivities);
  }, [timeOfDayActivities]);

  // Set variables to state to pass to updateModal:
  const handleActivityClick = (day, timeOfDay, where) => {
    console.log("activity clicked");
    console.log(day);
    console.log(where);
    setActivityDay(day);
    setActivityTime(timeOfDay);
    setActivityWhere(where);
    setUpdateModal(true);
  };

  // For toDos to stay in the position they are dropped
  // Note there has been an order change
  const onDragEnd = (result) => {
    const toDos = Array.from(activitiesArray);
    const [reorderedToDo] = toDos?.splice(result?.source?.index, 1);
    toDos.splice(result?.destination?.index, 0, reorderedToDo);
    setActivitiesArray(toDos);
    setOrderChange(true);
  };

  const handleSaveNewOrder = () => {
    console.log("saved");
  };

  //console.log(activitiesArray);
  return (
    <Wrapper>
      <DragDropContext onDragEnd={onDragEnd}>
        <div>
          <Header>
            <p>{timeOfDay}</p>
            <Button
              data-modal={timeOfDayModal}
              onClick={() => setShowModal(true)}
            >
              <MdAdd size={15} />
            </Button>
          </Header>
          {showModal && (
            <ModalPopUp
              id={timeOfDayModal}
              showModal={showModal}
              setShowModal={setShowModal}
              timeOfDay={timeOfDay}
              day={day}
              length={activitiesArray.length}
            />
          )}

          <Droppable droppableId="activities">
            {(provided) => (
              <Tasks {...provided.droppableProps} ref={provided.innerRef}>
                {activitiesArray?.map((activity, index) => {
                  return (
                    <Draggable
                      key={activity.where + activity.when}
                      draggableId={activity.where + activity.when}
                      index={index}
                    >
                      {(provided) => (
                        <ActivityContainer
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Activity
                            onClick={() =>
                              handleActivityClick(
                                activity.day,
                                activity.timeOfDay,
                                activity.where
                              )
                            }
                          >
                            {activity.when ? activity.when : "TBD"} -{" "}
                            {activity.where}
                          </Activity>
                        </ActivityContainer>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
                {updateModal && (
                  <UpdateModal
                    showModal={updateModal}
                    setShowModal={setUpdateModal}
                    trip={trip}
                    day={activityDay}
                    timeOfDay={activityTime}
                    where={activityWhere}
                  />
                )}
              </Tasks>
            )}
          </Droppable>
        </div>
      </DragDropContext>
      {/* {orderChange && (
        <button
          onClick={() => handleSaveNewOrder()}
        >
          save
        </button>
      )} */}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  padding: 0 5px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Tasks = styled.div`
  max-height: 75%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;

  padding: 4px 0;
  border-bottom: 1px solid gray;
  text-align: left;

  & p {
    font-size: 14px;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 3px;

  border-radius: ${styling.borderRadius};
  background-color: ${styling.colorPrimary};
  color: white;
  outline: none;
`;

const ActivityContainer = styled.div`
  display: block;
  border-bottom: 1px dashed lightgray;
  margin-bottom: 2px;
`;

const Activity = styled.button`
  font-size: 13px;
  background: transparent;
  border: none;
  border-radius: ${styling.borderRadius};
  outline: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export default DayPart;
