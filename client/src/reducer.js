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
        currentPin: null,
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
    case ACTIONS.DELETE_DRAFT:
      return {
        ...state,
        draft: null
      }
    case ACTIONS.GET_PINS:
      return {
        ...state,
        pins: payload
      }
    case ACTIONS.CREATE_PIN:
      const newPin = payload;
      const prevPins = state.pins.filter(pin => pin._id !== newPin._id);
      return {
        ...state,
        pins: [...prevPins, newPin]
      }
    case ACTIONS.SET_PIN:
      return {
        ...state,
        currentPin: payload,
        draft: null
      }
    case ACTIONS.DELETE_PIN:
      const deletedPin = payload;
      const filteredPins = state.pins.filter(pin => pin._id !== deletedPin._id);
      if (state.currentPin) {
        const isCurrentPin = deletedPin._id === state.currentPin._id;
        if (isCurrentPin) {
          return {
            ...state,
            pins: filteredPins,
            currentPin: null
          };
        }
      }
      return {
        ...state,
        pins: filteredPins
      };
    case ACTIONS.CREATE_COMMENT:
      const updatedCurrentPin = payload;
      // find and replace
      const updatedPins = state.pins.map(pin =>
        pin._id === updatedCurrentPin._id ? updatedCurrentPin : pin
      );
      return {
        ...state,
        pins: updatedPins,
        currentPin: updatedCurrentPin
      };
    default:
      return state; // Return unchanged state on default
  }
}