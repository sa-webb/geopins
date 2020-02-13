/**
 * Reducer - presents a problem in a much simpler form.
 * @param {*} state spread the incoming props (allow in)
 * @param {*} action(type, payload) switch via type, specify payload
 */
import {
  LOGIN_USER, IS_LOGGED_IN, SIGNOUT_USER
} from './actions';
export default function reducer(state, { type, payload }) {
  switch (type) {
    case LOGIN_USER:
      return {
        ...state,
        currentUser: payload
      };
    case IS_LOGGED_IN:
      return {
        ...state,
        isAuth: payload
      };
    case SIGNOUT_USER:
      return {
        ...state,
        isAuth: false,
        currentUser: null
      };
    default:
      return state; // Return unchanged state
  }
}