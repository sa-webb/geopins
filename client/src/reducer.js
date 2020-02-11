export default function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN_USER':
      return {
        ...state,
        currentUser: action.payload
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
