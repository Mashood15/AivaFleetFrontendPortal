import React from 'react'
import { CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'

const Root = styled('div')(({ height }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: height || 300
}))

const Spinner = styled(CircularProgress)(({ height }) => ({
  marginTop: Math.round((height || 300) / 2) - 15
}))

function ModalLoading({ height, color }) {
  return (
    <Root height={height}>
      <Spinner color={color ? color : 'primary'} height={height} />
    </Root>
  )
}

export default ModalLoading
