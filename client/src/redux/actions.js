const REQUEST_USER = "REQUEST_USER";
const RETRIEVE_USER = "RETRIEVE_USER";
const ERROR = "ERROR";

export const requestUser = () => ({
  type: REQUEST_USER,
});

export const retrieveUser = (user) => ({
  type: RETRIEVE_USER,
  payload: user,
});

export const error = (error) => ({
  type: ERROR,
  payload: error,
});
