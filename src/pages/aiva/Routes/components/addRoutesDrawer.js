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
import { RouteService } from 'src/services/routeService'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

function AddRouteDrawer({ open, statechanger, oneRoute, setOneRoute }) {
  const [oneRouteData, setOneRouteData] = useState(null)
  const queryClient = useQueryClient()

  function closeModal() {
    statechanger(false)
    formik.handleReset()
    setOneRoute(null)
  }

  //Api call to get one user
  const { isFetching: gettingUser } = RouteService.getRoute('get-one-route', oneRoute, {
    onSuccess: response => {
      if (response.data.isSuccess) {
        setOneRouteData(response.data?.result)
      } else {
        setOneRouteData(null)
      }
    },
    onError: error => {
      setOneRouteData(null)
    },
    enabled: oneRoute != null
  })

  //Api call to create update Route
  const { mutate: createUpdateRoute, isLoading: creatingUpdatingRoute } = RouteService.createUpdateRoute({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message)
        queryClient.invalidateQueries('get-routes')
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
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name must be at least 3 characters long'),
  
    startLocation: Yup.string()
      .required('Start Location is required'),

      endLocation: Yup.string()
      .required('End Location is required'),

      distance: Yup.number()
      .required('Distance is required'),

      estimatedDuration: Yup.number()
      .required('Estimated Duration is required'),

      description: Yup.string()
      .required('Description is required'),
  
  });
  
  

  const formik = useFormik({
    initialValues: {
      name: "",
  
    startLocation: "",
  
    endLocation: "",
  
    distance: "",

    estimatedDuration: "",
  
    description: "",
    },
    validationSchema: schema,
    onSubmit: values => {
      let payload = {
        ...(oneRoute === null && { id: oneRoute }),
  "name": values.name,
  "startLocation": values.startLocation,
  "endLocation": values.endLocation,
  "distance": values.distance,
  "estimatedDuration": values.estimatedDuration,
  "description": values.description,
      }
      createUpdateRoute(payload)
    }
  })

  useEffect(() => {
    if (oneRouteData != null) {
      formik.setValues({
  "name": oneRouteData.name,
  "startLocation": oneRouteData.startLocation,
  "endLocation": oneRouteData.endLocation,
  "distance": oneRouteData.distance,
  "estimatedDuration": oneRouteData.estimatedDuration,
  "description": oneRouteData.description,
      })
    } else {
      formik.handleReset()
    }
  }, [oneRouteData])

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={closeModal}
      PaperProps={{ style: { width: '400px' } }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>{oneRoute != null ? 'Update Route' : 'Add Route'}</Typography>
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
            <FormikProvider formik={{ ...formik, isLoading: creatingUpdatingRoute }}>
            <Grid container spacing={2}>

            <Grid item xs={12}>
    <CustomInput label='Name' placeholder='jail road' name='name' requiredField />
  </Grid>

  <Grid item xs={12}>
    <CustomInput label='Start Location' placeholder='ssss' name='startLocation' requiredField />
  </Grid>

  <Grid item xs={12}>
    <CustomInput label='End Location' placeholder='aaaa' name='endLocation' requiredField />
  </Grid>

  <Grid item xs={12}>
    <CustomInput label='distance' placeholder='1000' name='distance' requiredField />
  </Grid>

  <Grid item xs={12}>
    <CustomInput label='Estimated Duration' placeholder='5' name='estimatedDuration' requiredField />
  </Grid>

  <Grid item xs={12}>
    <CustomInput label='Description' placeholder='.........' name='description' requiredField />
  </Grid>

  
</Grid>
            </FormikProvider>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button onClick={closeModal} color='secondary' variant='outlined'>
                Cancel
              </Button>
              <CustomButton
                disabled={creatingUpdatingRoute}
                loading={creatingUpdatingRoute}
                color='primary'
                variant='contained'
                onClick={formik.handleSubmit}
              >
                {oneRoute ? 'Update' : 'Add New Route'}
              </CustomButton>
            </Box>
          </Box>
        </Fragment>
      )}
    </Drawer>
  )
}

export default AddRouteDrawer
