import React, {useReducer, createContext} from "react";
import {v4 as uuidv4} from "uuid";
import {API, graphqlOperation} from "aws-amplify";
import {processOrder} from "../api/mutations";

export const CHECKOUT_STATUS = {
  NOT_STARTED: "not-started",
  PROCESSING: "processing",
  SUCCESS: "success",
  FAILED: "failed"
};

const initialState = {
  status: CHECKOUT_STATUS.NOT_STARTED
};

export const CheckoutStateContext = createContext();
export const CheckoutDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CHECKOUT_STATUS":
      return {
        ...state,
        status: action.payload.status,
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

const CheckoutProvider = ({ children }) => {
  const persistedCheckoutState = {
    ...initialState
  };
  const [state, dispatch] = useReducer(reducer, persistedCheckoutState);

  return (
    <CheckoutDispatchContext.Provider value={dispatch}>
      <CheckoutStateContext.Provider value={state}>
        {children}
      </CheckoutStateContext.Provider>
    </CheckoutDispatchContext.Provider>
  );
};

export const setCheckoutStatus = (dispatch, status) => {
  return dispatch({
    type: "SET_CHECKOUT_STATUS",
    payload: {
      status
    }
  });
};

export const checkout = async (dispatch, userId, orderDetails) => {
  const payload = {
    id: uuidv4(),
    userId,
    ...orderDetails
  };
  try {
    console.log("Order is successful");
    setCheckoutStatus(dispatch, CHECKOUT_STATUS.PROCESSING);
    await API.graphql(graphqlOperation(processOrder, {input: payload}));
    setCheckoutStatus(dispatch, CHECKOUT_STATUS.SUCCESS);
  } catch (err) {
    setCheckoutStatus(dispatch, CHECKOUT_STATUS.FAILED);
    console.log(err);
  }
};

export default CheckoutProvider;
