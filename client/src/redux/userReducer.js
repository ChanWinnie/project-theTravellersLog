const initialState = {
  status: "idle",
  user: null,
  error: "",
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "REQUEST_USER": {
      return {
        ...state,
        status: "loading",
      };
    }
    case "RETRIEVE_USER": {
      return {
        ...state,
        status: "idle",
        user: action.payload,
        error: "",
      };
    }
    case "ERROR": {
      return {
        ...state,
        status: "idle",
        user: null,
        error: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default userReducer;
