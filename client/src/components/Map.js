import React, { useState, useEffect, useContext } from 'react';
import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl';
import { withStyles } from '@material-ui/core/styles';
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import Blog from './Blog';
import Context from '../context';
import PinIcon from './PinIcon';
import * as ACTIONS from '../actions';

const INITIAL_VIEWPORT = {
  latitude: 35.158199909022834,
  longitude: -84.87738581406285,
  zoom: 13
};

const Map = ({ classes }) => {
  const { state, dispatch } = useContext(Context);
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    getUserPosition();
  }, []); // Empty array specifices to only behave onMount and unMount

  /**
   * 
   */
  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };

  /**
   * @param {lngLat, LeftButton} destructed from event object.
   * @event console.log
   */
  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({ type: ACTIONS.CREATE_DRAFT });
    }
    const [longitude, latitude] = lngLat;
    dispatch({
      type: ACTIONS.UPDATE_DRAFT,
      payload: { longitude, latitude }
    });
  }

  return (
    <div className={classes.root}>
      <ReactMapGL
        mapboxApiAccessToken='pk.eyJ1Ijoic2Etd2ViYiIsImEiOiJjazZweXk3eDcxMmYwM3FwZzAwMXF2emMxIn0.0bYOEvbeLT1RKuB8Ws7wKQ'
        width='100vw'
        height='calc(100vh - 64px)'
        mapStyle='mapbox://styles/mapbox/streets-v9'
        onViewportChange={newViewport => setViewport(newViewport)}
        onClick={handleMapClick}
        {...viewport}
      >
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={newViewport => setViewport(newViewport)}
          />
        </div>
        {/* Pin for User's Current Position */}
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="red" />
          </Marker>
        )}
        {/*Draft Pin */}
        {state.draft && (
          <Marker
          latitude={state.draft.latitude}
          longitude={state.draft.longitude}
          offsetLeft={-19}
          offsetTop={-37}
        >
          <PinIcon size={40} color="hotpink" />
        </Marker>
        )}
      </ReactMapGL>
      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: 'flex'
  },
  rootMobile: {
    display: 'flex',
    flexDirection: 'column-reverse'
  },
  navigationControl: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1em'
  },
  deleteIcon: {
    color: 'red'
  },
  popupImage: {
    padding: '0.4em',
    height: 200,
    width: 200,
    objectFit: 'cover'
  },
  popupTab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }
};

export default withStyles(styles)(Map);
