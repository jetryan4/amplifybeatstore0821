import React, { useReducer, createContext } from "react";

const initialState = {
  mainLoading: false,
  subLoading: false,
};

export const CommonStateContext = createContext();
export const CommonDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_MAIN_LOADING":
      return {
        ...state,
        mainLoading: action.payload.mainLoading
      };
    case "SET_SUB_LOADING":
      return {
        ...state,
        subLoading: action.payload.subLoading
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

const CommonProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <CommonDispatchContext.Provider value={dispatch}>
      <CommonStateContext.Provider value={state}>
        {children}
      </CommonStateContext.Provider>
    </CommonDispatchContext.Provider>
  );
};

export const setMainLoading = (dispatch, mainLoading) => {
  return dispatch({
    type: "SET_MAIN_LOADING",
    payload: {
      mainLoading
    }
  });
};

export const setSubLoading = (dispatch, subLoading) => {
  return dispatch({
    type: "SET_SUB_LOADING",
    payload: {
      subLoading
    }
  });
};

export default CommonProvider;
