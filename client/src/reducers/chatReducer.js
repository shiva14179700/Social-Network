import { GET_CHATS, CHAT_LOADING } from "../actions/types";

const initialState = {
  chats: [],
  chat: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CHAT_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_CHATS:
      return {
        ...state,
        chats: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
