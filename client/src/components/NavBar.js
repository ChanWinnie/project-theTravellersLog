import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { styling } from "../GlobalStyles";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { ImEarth } from "react-icons/im";
import { CgClose, CgMathPlus, CgMathMinus } from "react-icons/cg";
import { IoIosArrowForward } from "react-icons/io";
import ButtonOne from "./ButtonOne";
import ButtonTwo from "./ButtonTwo";
import {
  onSmallPhoneMediaQuery,
  onTabletMediaQuery,
  onDesktopMediaQuery,
  onLargeDesktopMediaQuery,
} from "../utils/responsives";

const NavBar = () => {
  const { user, logout } = useAuth0();
  const history = useHistory();
  const userTrips = useSelector((state) => state?.user?.data?.trips);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tripOpen, setTripOpen] = useState(false);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    setTrips(userTrips);
  }, [userTrips]);

  const showSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // When trip is clicked, send user to trip's planner page:
  // Close opened tabs
  const handleTripNameClick = (name) => {
    setTripOpen(!tripOpen);
    setSidebarOpen(!sidebarOpen);
    history.push(`/trip/${name}`);
  };

  return (
    <Wrapper>
      <LogoContainer>
        <Link to="#" style={{ color: "white" }}>
          <ImEarth size={36} onClick={showSidebar} />
        </Link>
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <h1 style={{ paddingLeft: "15px" }}>TheTravellersLog</h1>
        </Link>
      </LogoContainer>
      {user && (
        <Nav className={sidebarOpen ? "nav-menu active" : "nav-menu"}>
          <ButtonOne
            handleButtonClick={() => setSidebarOpen(!sidebarOpen)}
            buttonText={<CgClose size={25} />}
          />
          <Section style={{ paddingTop: "25px" }}>
            <div>
              <h2>Trips</h2>
              <Button
                onClick={() => setTripOpen(!tripOpen)}
                style={{ background: "transparent" }}
              >
                {tripOpen ? (
                  <CgMathMinus size={20} />
                ) : (
                  <CgMathPlus size={20} />
                )}
              </Button>
            </div>
            {tripOpen && (
              <Content>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "5px",
                    width: "100%",
                  }}
                >
                  <p style={{ fontWeight: "bold" }}>Add a trip</p>
                  <Button>
                    {" "}
                    <IoIosArrowForward
                      size={15}
                      onClick={() => {
                        setTripOpen(!tripOpen);
                        setSidebarOpen(!sidebarOpen);
                        history.push("/plan");
                      }}
                    />
                  </Button>
                </div>
                <Options>
                  {trips?.map((trip) => {
                    const name = trip.name;
                    return (
                      <TripButton
                        key={name}
                        onClick={() => handleTripNameClick(name)}
                      >
                        {name}
                      </TripButton>
                    );
                  })}
                </Options>
              </Content>
            )}
          </Section>
          <Section>
            <div>
              <h3>Find new sites to explore</h3>
              <Button>
                <IoIosArrowForward
                  size={20}
                  onClick={() => {
                    setTripOpen(!tripOpen);
                    setSidebarOpen(!sidebarOpen);
                    history.push("/explore");
                  }}
                />
              </Button>
            </div>
          </Section>
          <LogoutButton handleButtonClick={logout} buttonText={"Log Out"} />
        </Nav>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  max-width: 100vw;
  height: 14vh;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  padding: 7px 15px;
  color: white;
  background: ${styling.colorPrimary};
  & h2 {
    color: black;
  }
`;

const LogoContainer = styled.div`
  display: flex;
`;

const Nav = styled.nav`
  ${onTabletMediaQuery()} {
    width: 75%;
  }
  ${onDesktopMediaQuery()} {
    width: 60%;
  }
  ${onLargeDesktopMediaQuery()} {
    width: 45%;
  }
  &.nav-menu {
    display: block;
    height: 100vh;
    background-color: white;
    position: fixed;
    top: 0;
    left: -100%;
    transition: ease-in-out 850ms;
    padding: 20px;
    z-index: 5;
  }

  &.nav-menu.active {
    left: 0;
    transition: ease-in-out 850ms;
  }
`;

const Section = styled.ul`
  margin-top: 50px;
  border-bottom: 1px solid lightgray;
  padding-bottom: 15px;
  color: black;
  & div {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
`;

const Content = styled.div`
  margin: 15px 30px;
  display: flex;
  flex-direction: column;
  color: black;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
`;

const TripButton = styled.button`
  background: transparent;
  padding: 4px 6px;
  border-radius: ${styling.borderRadius};
  &:hover,
  :active {
    background-color: ${styling.colorPrimary};
    color: white;
  }
`;

const LogoutButton = styled(ButtonTwo)`
  position: absolute;
  bottom: 15px;
  right: 20px;
  text-align: center;
`;

const Button = styled.button`
  background: transparent;

  &:hover {
    transform: scale(1.15);
  }
`;
export default NavBar;
