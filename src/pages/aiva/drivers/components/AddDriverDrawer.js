import { useFormik } from 'formik'
import React, { Fragment, useEffect, useState } from 'react'
import { Button, Drawer, Grid, Typography, IconButton, Box } from '@mui/material'
import * as Yup from 'yup'
import FormikProvider from 'src/context/formik'
import CustomInput from 'src/components/CustomInput'
import CustomButton from 'src/components/CustomButton'
import ModalLoading from 'src/components/ModalLoading'
import { roleService } from 'src/services/roleService'
import Swal from 'sweetalert2'
import { useQueryClient } from '@tanstack/react-query'
import { userService } from 'src/services/userService'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import CustomSelect from 'src/components/CustomSelect'
import toast from 'react-hot-toast'
import { driverService } from 'src/services/driverService'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

function AddDriverDrawer({ open, statechanger, oneDriver, setOneDriver }) {
  const [oneDriverData, setOneDriverData] = useState(null)
  const queryClient = useQueryClient()

  function closeModal() {
    statechanger(false)
    formik.handleReset()
    setOneDriver(null)
  }

  //Api call to get one user
  const { isFetching: gettingUser } = driverService.getDriver('get-one-driver', oneDriver, {
    onSuccess: response => {
      if (response.data.isSuccess) {
        setOneDriverData(response.data?.result)
      } else {
        setOneDriverData(null)
      }
    },
    onError: error => {
      setOneDriverData(null)
    },
    enabled: oneDriver != null
  })

  //Api call to create update Driver
  const { mutate: createUpdateDriver, isLoading: creatingUpdatingDriver } = driverService.createUpdateDriver({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message)
        queryClient.invalidateQueries('get-drivers')
        closeModal()
      } else {
        toast.error(response.data.message)
      }
    },
    onError: error => {
      toast.error(error.message)
    }
  })

  const schema = Yup.object().shape({
    userName: Yup.string()
      .required('User Name is required')
      .min(3, 'User Name must be at least 3 characters long'),
  
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
  
    phoneNumber: Yup.string()
      .required('Phone Number is required')
      .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format (e.g., +123456789)'),
  
    ...(oneDriver === null && { // Add password validation only when oneDriver is null
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one digit')
        .matches(/[@$!%*?&#]/, 'Password must contain at least one special character'),
  
      confirmPassword: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    }),
  
    firstName: Yup.string()
      .required('First Name is required')
      .min(2, 'First Name must be at least 2 characters long'),
  
    lastName: Yup.string()
      .required('Last Name is required')
      .min(2, 'Last Name must be at least 2 characters long'),
  
    licenseNumber: Yup.string()
      .required('License Number is required')
      .matches(/^\w{5,20}$/, 'License Number must be alphanumeric and between 5-20 characters'),
  
    licenseExpiryDate: Yup.date()
      .required('License Expiry Date is required')
      .min(new Date(), 'License Expiry Date must be in the future'),
  });
  
  

  const formik = useFormik({
    initialValues: {
      userName: "",
  
    email: "",
  
    phoneNumber: "",
  
    password: "",

      confirmPassword: "",
  
    firstName: "",
  
    lastName: "",
  
    licenseNumber: "",
  
    licenseExpiryDate: ""
    },
    validationSchema: schema,
    onSubmit: values => {
      let payload = {
        ...(oneDriver === null && { id: oneDriver }),
  "userName": values.userName,
  "email": values.email,
  "phoneNumber": values.phoneNumber,
  "password": values.confirmPassword,
  "firstName": values.firstName,
  "lastName": values.lastName,
  "licenseNumber": values.licenseNumber,
  "licenseExpiryDate": values.licenseExpiryDate,
      }
      createUpdateDriver(payload)
    }
  })

  useEffect(() => {
    if (oneDriverData != null) {
      formik.setValues({
  "userName": oneDriverData.userName,
  "email": oneDriverData.email,
  "phoneNumber": oneDriverData.phoneNumber,
  "firstName": oneDriverData.firstName,
  "lastName": oneDriverData.lastName,
  "licenseNumber": oneDriverData.licenseNumber,
  "licenseExpiryDate": oneDriverData.licenseExpiryDate,
      })
    } else {
      formik.handleReset()
    }
  }, [oneDriverData])

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={closeModal}
      PaperProps={{ style: { width: '400px' } }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>{oneDriver != null ? 'Update Driver' : 'Add Driver'}</Typography>
        <IconButton
          size='small'
          onClick={closeModal}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
            }
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      {gettingUser ? (
        <ModalLoading />
      ) : (
        <Fragment>
          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
            <FormikProvider formik={{ ...formik, isLoading: creatingUpdatingDriver }}>
            <Grid container spacing={2}>

            <Grid item xs={12}>
    <CustomInput label='First Name' placeholder='John' name='firstName' requiredField />
  </Grid>

  <Grid item xs={12}>
    <CustomInput label='Last Name' placeholder='Doe' name='lastName' requiredField />
  </Grid>

  <Grid item xs={12}>
    <CustomInput label='User Name' placeholder='John Doe' name='userName' requiredField />
  </Grid>

  <Grid item xs={12}>
    <CustomInput label='Personal Email' placeholder='example@example.com' name='email' requiredField />
  </Grid>

  <Grid item xs={12}>
    <CustomInput label='Phone Number' placeholder='+123456789' name='phoneNumber' requiredField />
  </Grid>

  {oneDriver === null && (
    <>
      <Grid item xs={12}>
        <CustomInput label='Password' placeholder='Enter your password' name='password' type='password' requiredField />
      </Grid>

      <Grid item xs={12}>
        <CustomInput label='Confirm Password' placeholder='Re-enter your password' name='confirmPassword' type='password' requiredField />
      </Grid>
    </>
  )}

  

  <Grid item xs={12}>
    <CustomInput label='License Number' placeholder='ABC12345' name='licenseNumber' requiredField />
  </Grid>

  <Grid item xs={12}>
    <CustomInput label='License Expiry Date' placeholder='YYYY-MM-DD' name='licenseExpiryDate' type='date' requiredField />
  </Grid>
</Grid>
            </FormikProvider>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button onClick={closeModal} color='secondary' variant='outlined'>
                Cancel
              </Button>
              <CustomButton
                disabled={creatingUpdatingDriver}
                loading={creatingUpdatingDriver}
                color='primary'
                variant='contained'
                onClick={formik.handleSubmit}
              >
                {oneDriver ? 'Update' : 'Add New Driver'}
              </CustomButton>
            </Box>
          </Box>
        </Fragment>
      )}
    </Drawer>
  )
}

export default AddDriverDrawer
