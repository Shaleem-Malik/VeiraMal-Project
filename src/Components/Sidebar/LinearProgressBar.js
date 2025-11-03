// LinearProgressBar.js
import React from 'react';
import { LinearProgress, Box, Typography } from '@material-ui/core';

const LinearProgressBar = ({ value, variant = 'determinate', ...props }) => {
  return (
    <Box display="flex" alignItems="center" {...props}>
      <Box width="100%" mr={1}>
        <LinearProgress variant={variant} value={value} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          value
        )}%`}</Typography>
      </Box>
    </Box>
  );
};

export default LinearProgressBar;