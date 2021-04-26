import React from "react";
import styled from "styled-components";
import { modalStyles } from "../../GlobalStyles";
import Modal from "react-modal";
import ModalForm from "./ModalForm";
import { CgClose } from "react-icons/cg";
import ButtonOne from "../ButtonOne";

const ModalPopUp = ({ timeOfDay, day, showModal, setShowModal, length }) => {
  return (
    <Modal
      isOpen={showModal}
      style={modalStyles}
      onRequestClose={() => setShowModal(false)}
    >
      <Header>
        <h2>Add an activity for this {timeOfDay}</h2>
        <ModalExitButton
          handleButtonClick={() => setShowModal(false)}
          buttonText={<CgClose size={25} />}
        />
      </Header>
      <ModalForm
        timeOfDay={timeOfDay}
        day={day}
        setShowModal={setShowModal}
        length={length}
      />
    </Modal>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ModalExitButton = styled(ButtonOne)`
  float: right;
`;

export default ModalPopUp;
