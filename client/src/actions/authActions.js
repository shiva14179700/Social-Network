import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, GET_USERS, USERS_LOADING } from "./types";
import { SET_CURRENT_USER } from "./types";

//Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Login User-Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      //save to local storage
      const { token } = res.data;
      //set token to local storage
      localStorage.setItem("jwtToken", token);
      //Set token to Auth Header
      setAuthToken(token);
      //Decode Token to get User Data
      const decoded = jwt_decode(token);
      //set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Get All users
export const getUsers = () => dispatch => {
  dispatch(setUsersLoading());
  axios
    .get("/api/users/all")
    .then(res =>
      dispatch({
        type: GET_USERS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_USERS,
        payload: null
      })
    );
};

//set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//logout user
export const logoutUser = () => dispatch => {
  //Remove token from local storage
  localStorage.removeItem("jwtToken");
  //Remove Auth Header
  setAuthToken(false);
  //set current user to emptyobject
  dispatch(setCurrentUser({}));
};

//Users Loading
export const setUsersLoading = () => {
  return {
    type: USERS_LOADING
  };
};
