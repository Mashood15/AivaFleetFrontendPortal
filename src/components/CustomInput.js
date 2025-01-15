import { forwardRef, useContext, useState } from 'react'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import { FormikContext } from 'src/context/formik'
import { Icon, IconButton, InputAdornment, MenuItem, CircularProgress, Box } from '@mui/material'
import { Eye, EyeOff } from 'react-feather'

const TextFieldStyled = styled(TextField)(({ theme }) => ({
  alignItems: 'flex-start',
  '& .MuiInputLabel-root': {
    transform: 'none',
    lineHeight: 1.154,
    position: 'relative',
    marginBottom: theme.spacing(1),
    fontSize: theme.typography.body2.fontSize,
    color: `${theme.palette.text.primary} !important`
  },
  '& .MuiInputBase-root': {
    borderRadius: 8,
    backgroundColor: 'transparent !important',
    border: `1px solid rgba(${theme.palette.customColors.main}, 0.2)`,
    transition: theme.transitions.create(['border-color', 'box-shadow'], {
      duration: theme.transitions.duration.shorter
    }),
    '&:not(.Mui-focused):not(.Mui-disabled):not(.Mui-error):hover': {
      borderColor: `rgba(${theme.palette.customColors.main}, 0.28)`
    },
    '&:before, &:after': {
      display: 'none'
    },
    '&.MuiInputBase-sizeSmall': {
      borderRadius: 6
    },
    '&.Mui-error': {
      borderColor: theme.palette.error.main
    },
    '&.Mui-focused': {
      boxShadow: theme.shadows[2],
      '& .MuiInputBase-input:not(.MuiInputBase-readOnly):not([readonly])::placeholder': {
        transform: 'translateX(4px)'
      },
      '&.MuiInputBase-colorPrimary': {
        borderColor: theme.palette.primary.main
      },
      '&.MuiInputBase-colorSecondary': {
        borderColor: theme.palette.secondary.main
      },
      '&.MuiInputBase-colorInfo': {
        borderColor: theme.palette.info.main
      },
      '&.MuiInputBase-colorSuccess': {
        borderColor: theme.palette.success.main
      },
      '&.MuiInputBase-colorWarning': {
        borderColor: theme.palette.warning.main
      },
      '&.MuiInputBase-colorError': {
        borderColor: theme.palette.error.main
      },
      '&.Mui-error': {
        borderColor: theme.palette.error.main
      }
    },
    '&.Mui-disabled': {
      backgroundColor: `${theme.palette.action.selected} !important`
    },
    '& .MuiInputAdornment-root': {
      marginTop: '0 !important'
    }
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.secondary,
    '&:not(textarea)': {
      padding: '15.5px 13px'
    },
    '&:not(textarea).MuiInputBase-inputSizeSmall': {
      padding: '7.5px 13px'
    },
    '&:not(.MuiInputBase-readOnly):not([readonly])::placeholder': {
      transition: theme.transitions.create(['opacity', 'transform'], {
        duration: theme.transitions.duration.shorter
      })
    },
    '&.MuiInputBase-inputAdornedStart:not(.MuiAutocomplete-input)': {
      paddingLeft: 0
    },
    '&.MuiInputBase-inputAdornedEnd:not(.MuiAutocomplete-input)': {
      paddingRight: 0
    }
  },
  '& .MuiFormHelperText-root': {
    lineHeight: 1.154,
    margin: theme.spacing(1, 0, 0),
    color: theme.palette.text.secondary,
    fontSize: theme.typography.body2.fontSize,
    '&.Mui-error': {
      color: theme.palette.error.main
    }
  },
  '& .MuiSelect-select:focus, & .MuiNativeSelect-select:focus': {
    backgroundColor: 'transparent'
  },
  '& .MuiSelect-filled .MuiChip-root': {
    height: 22
  },
  '& .MuiAutocomplete-input': {
    paddingLeft: '6px !important',
    paddingTop: '7.5px !important',
    paddingBottom: '7.5px !important',
    '&.MuiInputBase-inputSizeSmall': {
      paddingLeft: '6px !important',
      paddingTop: '2.5px !important',
      paddingBottom: '2.5px !important'
    }
  },
  '& .MuiAutocomplete-inputRoot': {
    paddingTop: '8px !important',
    paddingLeft: '8px !important',
    paddingBottom: '8px !important',
    '&:not(.MuiInputBase-sizeSmall).MuiInputBase-adornedStart': {
      paddingLeft: '13px !important'
    },
    '&.MuiInputBase-sizeSmall': {
      paddingTop: '5px !important',
      paddingLeft: '5px !important',
      paddingBottom: '5px !important',
      '& .MuiAutocomplete-tag': {
        margin: 2,
        height: 22
      }
    }
  },
  '& .MuiInputBase-multiline': {
    padding: '15.25px 13px',
    '&.MuiInputBase-sizeSmall': {
      padding: '7.25px 13px'
    },
    '& textarea.MuiInputBase-inputSizeSmall:placeholder-shown': {
      overflowX: 'hidden'
    }
  },
  '& + .react-datepicker__close-icon': {
    top: 11,
    '&:after': {
      fontSize: '1.6rem !important'
    }
  }
}))

const CustomInput = forwardRef((props, ref) => {
  const {
    size = 'small',
    InputLabelProps,
    label,
    name,
    requiredField,
    type,
    startIcon = false,
    disabled = false,
    showValid = true,
    ...rest
  } = props
  const formik = useContext(FormikContext)
  const [showPassword, setShowPassword] = useState(false)

  const renderIcon = () => {
    return showPassword ? <Eye size={14} /> : <EyeOff size={14} />
  }

  return (
    <>
      <TextFieldStyled
        type={showPassword ? 'text' : type}
        fullWidth
        required={requiredField}
        name={name}
        label={label}
        value={formik.values[name]}
        onChange={event => {
          formik.setFieldValue(name, event.target.value)
        }}
        onBlur={() => {
          formik.setFieldTouched(name, true)
        }}
        sx={{ mb: 4 }}
        size={size}
        inputRef={ref}
        {...rest}
        variant='filled'
        {...(showValid && {
          error: Boolean(formik.errors[name] && formik.touched[name]),
          helperText: formik.errors[name] && formik.touched[name] ? formik.errors[name] : null
        })}
        disabled={disabled || formik.isLoading}
        InputProps={{
          startAdornment: startIcon && <InputAdornment position='start'>{startIcon}</InputAdornment>,
          endAdornment: type === 'password' && (
            <InputAdornment position='end'>
              <IconButton
                edge='end'
                onClick={() => {
                  setShowPassword(!showPassword)
                }}
              >
                {renderIcon()}
              </IconButton>
            </InputAdornment>
          )
        }}
        InputLabelProps={{
          ...InputLabelProps,
          shrink: true
        }}
      />
    </>
  )
})

export default CustomInput
