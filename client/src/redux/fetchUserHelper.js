import { retrieveUser, requestUser, error } from "./actions";

// Get user document from database to set to redux state:
export const handleFetchUser = async (dispatch, email) => {
  dispatch(requestUser());
  try {
    const res = await fetch(`/currentUser/${email}`);
    const json = await res.json();
    return dispatch(retrieveUser(json));
  } catch (err) {
    return dispatch(error(err.message));
  }
};
