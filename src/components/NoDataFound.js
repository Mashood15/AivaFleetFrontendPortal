import React from 'react'
import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'

function NoDataFound({ height, message }) {
  return (
    <Box
      sx={{
        height: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography variant='body1'>{message}</Typography>
    </Box>
  )
}

NoDataFound.propTypes = {
  height: PropTypes.number,
  message: PropTypes.string
}

NoDataFound.defaultProps = {
  height: 200,
  message: 'No Data Found'
}

export default NoDataFound
