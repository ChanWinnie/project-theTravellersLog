import React from "react";
import Login from "../Login";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

const Home = () => {
  const state = useSelector((state) => state);
  const status = state?.status;
  const user = state?.user;

  if (status === "loading") {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return <>{user ? <div>You are logged in</div> : <Login />}</>;
};

export default Home;
