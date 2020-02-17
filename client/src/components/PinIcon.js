import React from 'react';
import PlaceTwoTone from '@material-ui/icons/PlaceTwoTone';

export default ({ size, color, onCLick }) => (
  <PlaceTwoTone onClick={onCLick} styles={{ fontSize: size, color }} />
);
