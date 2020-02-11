import React, { useContext, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as serviceWorker from './serviceWorker';

import Context from './context';
import reducer from './reducer';

import App from './pages/App';
import Splash from './pages/Splash';

const Root = () => {
  const initialState = useContext(Context);
  /**
   * @state Application state after the reducer has run.
   * @dispatch Dispatches actions that will change the state.
   */
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log({ state });
  return (
    <Router>
      <Context.Provider value={{ state, dispatch }}>
        <Switch>
          <Route exact path='/' component={App} />
          <Route path='/login' component={Splash} />
        </Switch>
      </Context.Provider>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
