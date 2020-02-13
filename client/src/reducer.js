/**
 * Reducer - presents a problem in a much simpler form.
 * @param {*} state 
 * @param {*} action(type, payload)
 */
export default function reducer(state, {type, payload}) {
  switch (type) {
    case 'LOGIN_USER':
      return {
        ...state,
        currentUser: payload
      };
      // Return unchanged state 
    default:
      return state;
  }
}

/**
 * According to what action takes place within our application,
 * the switch statement will invoke that action.
 * Spread the required props for that action.
 * And send the corresponding payload for that action.
 */
