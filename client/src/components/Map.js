import React, { useState, useEffect, useContext } from 'react';
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';
import { withStyles } from '@material-ui/core/styles';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';
import Blog from './Blog';
import Context from '../context';
import PinIcon from './PinIcon';
import * as ACTIONS from '../actions';
import { useClient } from '../client';
import { GET_PINS_QUERY } from '../graphql/queries';
import { DELETE_PIN_MUTATION } from '../graphql/mutations';
import { Subscription } from "react-apollo";
import {
  PIN_ADDED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION
} from "../graphql/subscriptions";

const INITIAL_VIEWPORT = {
  latitude: 35.158199909022834,
  longitude: -84.87738581406285,
  zoom: 13
};

const Map = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  useEffect(() => {
    getPins();
  }, []);
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    getUserPosition();
  }, []);

  const [popup, setPopup] = useState(null);

  // useEffect(() => {
  //   const pinExists =
  //     popup && state.pins.findIndex(pin => pin._id === popup._id) > -1;
  //   if (!pinExists) {
  //     setPopup(null);
  //   }
  // }, [state.pins.length]);

  const getUserPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    dispatch({ type: ACTIONS.GET_PINS, payload: getPins });
  };

  /**
   * @param {lngLat, LeftButton} destructed from event object.
   * @event console.log event object for MapBox click properties.
   */
  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    // CLEAR SET_PIN FOR CREATING DRAFT
    setPopup(null);
    if (!state.draft) {
      dispatch({ type: ACTIONS.CREATE_DRAFT });
    }
    const [longitude, latitude] = lngLat;
    dispatch({
      type: ACTIONS.UPDATE_DRAFT,
      payload: { longitude, latitude }
    });
  };

  /**
   * If Pin is older than 30 mins, consider it new.
   * @param {createdAt} pin
   */
  const highlightNewPin = pin => {
    const isNewPin =
      differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30;
    return isNewPin ? 'limegreen' : 'darkblue';
  };

  const handleSelectPin = pin => {
    setPopup(pin);
    dispatch({ type: ACTIONS.SET_PIN, payload: pin });
  };

  const isAuthUser = () => state.currentUser._id === popup.author._id;

  const handleDeletePin = async pin => {
    const variables = { pinId: pin._id };
    await client.request(DELETE_PIN_MUTATION, variables);
    setPopup(null);
  };

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
            <PinIcon size={40} color='red' />
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
            <PinIcon size={40} color='hotpink' />
          </Marker>
        )}
        {/* List pins */}
        {state.pins.map(pin => (
          <Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <IconButton onClick={() => handleSelectPin(pin)}>
              <PinIcon size={40} color={highlightNewPin(pin)} />
            </IconButton>
          </Marker>
        ))}
        {/* Popup modal for existing pins */}
        {popup && (
          <Popup
            anchor='top'
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            <img
              className={classes.popupImage}
              src={popup.image}
              alt={popup.title}
            />
            <div className={classes.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
              </Typography>
              {isAuthUser() && (
                <Button onClick={() => handleDeletePin(popup)}>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGL>
                {/* Subscriptions for Creating / Updating / Deleting Pins */}
      <Subscription
        subscription={PIN_ADDED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinAdded } = subscriptionData.data;
          console.log({ pinAdded });
          dispatch({ type: ACTIONS.CREATE_PIN, payload: pinAdded });
        }}
      />
      <Subscription
        subscription={PIN_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdated } = subscriptionData.data;
          console.log({ pinUpdated });
          dispatch({ type: ACTIONS.CREATE_COMMENT, payload: pinUpdated });
        }}
      />
      <Subscription
        subscription={PIN_DELETED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinDeleted } = subscriptionData.data;
          console.log({ pinDeleted });
          dispatch({ type: ACTIONS.DELETE_PIN, payload: pinDeleted });
        }}
      />
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
