import React from 'react';
import PlaceTwoTone from '@material-ui/icons/PlaceTwoTone';

/**
 * @size fontSize prop for component
 * @color color prop for component
 * @onClick event prop
 */

export default ({ size, color, onCLick }) => (
  <PlaceTwoTone onClick={onCLick} style={{ fontSize: size, color }} />
);
