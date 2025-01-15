import React, { forwardRef } from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/material/styles'
import classNames from 'classnames'
import { LoadingButton } from '@mui/lab'

const StyledButton = styled(LoadingButton)(({ theme, roundButton }) => ({
  position: 'relative',
  borderRadius: roundButton ? '50%' : theme.shape.borderRadius
}))

const Spinner = styled(CircularProgress)({
  position: 'absolute'
})

const CustomButton = forwardRef((props, ref) => {
  const { loading, disabled, size, color, className, roundButton, ...rest } = props

  return (
    <StyledButton
      loading={loading}
      disabled={disabled || loading}
      size={size}
      color={color}
      roundButton={roundButton}
      className={classNames(className)}
      ref={ref}
      {...rest}
    >
      {props.children || 'Button'}
    </StyledButton>
  )
})

CustomButton.defaultProps = {
  roundButton: false
}

export default CustomButton
