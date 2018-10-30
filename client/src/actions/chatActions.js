import axios from "axios";

import { GET_ERRORS, GET_CHATS, CHAT_LOADING } from "./types";

//Add post
export const addChatbox = (Data, history) => dispatch => {
  axios
    .post("/api/chats", Data)
    .then(res => history.push("/chats"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//get chats
export const getChats = () => dispatch => {
  dispatch(setChatLoading());
  axios
    .get("/api/chats/all")
    .then(res =>
      dispatch({
        type: GET_CHATS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_CHATS,
        payload: null
      })
    );
};

//set loading state
export const setChatLoading = () => {
  return {
    type: CHAT_LOADING
  };
};
