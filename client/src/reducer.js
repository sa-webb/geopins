/**
 * Reducer - presents a problem in a much simpler form.
 * @param {*} state spread the incoming props (allow in)
 * @param {*} action(type, payload) switch via type, specify payload
 */
import * as ACTIONS from './actions';

export default function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.LOGIN_USER:
      return {
        ...state,
        currentUser: payload
      };
    case ACTIONS.IS_LOGGED_IN:
      return {
        ...state,
        isAuth: payload
      };
    case ACTIONS.SIGNOUT_USER:
      return {
        ...state,
        isAuth: false,
        currentUser: null
      };
    case ACTIONS.CREATE_DRAFT:
      return {
        ...state,
        draft: {
          latitude: 0,
          longitude: 0
        }
      }
    case ACTIONS.UPDATE_DRAFT:
      return {
        ...state,
        draft: payload
      }
    default:
      return state; // Return unchanged state
  }
}