import { useFormik } from 'formik'
import React, { Fragment, useEffect, useState } from 'react'
import { Button, Drawer, Grid, Typography, IconButton, Box } from '@mui/material'
import * as Yup from 'yup'
import FormikProvider from 'src/context/formik'
import CustomInput from 'src/components/CustomInput'
import CustomButton from 'src/components/CustomButton'
import ModalLoading from 'src/components/ModalLoading'
import Swal from 'sweetalert2'
import { useQueryClient } from '@tanstack/react-query'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import CustomSelect from 'src/components/CustomSelect'
import toast from 'react-hot-toast'
import { tripService } from 'src/services/tripService'
import { vehicleService } from 'src/services/vehicleService'
import { RouteService } from 'src/services/routeService'
import MultiSelect from 'src/components/MultiSelect'
import { driverService } from 'src/services/driverService'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

function AddTripDrawer({ open, statechanger, oneTrip, setOneTrip }) {
  const [oneTripData, setOneTripData] = useState(null)
  const queryClient = useQueryClient()
  const [vehicleOptions, setVehicleOptions] = useState([])
  const [routeOptions, setRouteOptions] = useState([])
  const [driverOptions, setDriverOptions] = useState([])

  function closeModal() {
    statechanger(false)
    formik.handleReset()
    setOneTrip(null)
  }

  //Api call to get vehicle options
  const {isFetching: gettingVehicleOptions} = vehicleService.getVehicles("get-vehicle-options", "", "", false, 1, 10000, {
    onSuccess: (response) => {
      if(response.data.isSuccess){
        const temp = []
        response.data.result?.items?.map((one) => {
          const element = {
            label: one.registrationNumber,
            value: one.id
          }
          temp.push(element)
        })
        setVehicleOptions(temp)
      }else{
        setVehicleOptions([])
      }
    },
    onError: (error) => {
      setVehicleOptions([])
    }
  })

   //Api call to get route options
   const {isFetching: gettingRouteOptions} = RouteService.getRoutes("get-route-options", "", "", false, 1, 10000, "", "", "", {
    onSuccess: (response) => {
      if(response.data.isSuccess){
        const temp = []
        response.data.result?.items?.map((one) => {
          const element = {
            label: one.name,
            value: one.id
          }
          temp.push(element)
        })
        setRouteOptions(temp)
      }else{
        setRouteOptions([])
      }
    },
    onError: (error) => {
      setRouteOptions([])
    }
  })

  //Api call to get driver options
  const {isFetching: gettingDriverOptions} = driverService.getDrivers("get-driver-options", "", "", false, 1, 10000, "", "", "", {
    onSuccess: (response) => {
      if(response.data.isSuccess){
        const temp = []
        response.data.result?.items?.map((one) => {
          const element = {
            label: `${one.firstName} ${one.lastName}`,
            value: one.id
          }
          temp.push(element)
        })
        setDriverOptions(temp)
      }else{
        setDriverOptions([])
      }
    },
    onError: (error) => {
      setDriverOptions([])
    }
  })

  const { isFetching: gettingTrip } = tripService.getTripDetails('get-one-trip', oneTrip, {
    onSuccess: response => {
      if (response.data.isSuccess) {
        setOneTripData(response.data?.result)
      } else {
        setOneTripData(null)
      }
    },
    enabled: oneTrip != null
  })

  const { mutate: createUpdateTrip, isLoading: creatingUpdatingTrip } = tripService.createUpdateTrip({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message)
        queryClient.invalidateQueries('get-trips')
        closeModal()
      } else {
        toast.error(response.data.message)
      }
    }
  })

  const schema = Yup.object().shape({
    vehicleId: Yup.string().required('Vehicle ID is required'),
    routeId: Yup.string().required('Route ID is required'),
    startTime: Yup.date().required('Start Time is required'),
    endTime: Yup.date().required('End Time is required'),
    status: Yup.string().required('Status is required'),
    distance: Yup.number().required('Distance is required'),
    fuelUsed: Yup.number().required('Fuel Used is required'),
    notes: Yup.string().optional(),
    // customers: Yup.array().min(1, 'At least one customer is required').required('Customers are required')
  })

  const formik = useFormik({
    initialValues: {
      vehicleId: '',
      routeId: '',
      startTime: '',
      endTime: '',
      status: '',
      distance: 0,
      fuelUsed: 0,
      notes: '',
      // customers: []
    },
    validationSchema: schema,
    onSubmit: values => {
      let payload = {
        ...(oneTrip !== null && { id: oneTrip }),
        ...values,
        // customers: values.customers.map(customerId => ({
        //   customerId,
        //   notes: '',
        //   priority: 0
        // }))
      }
      createUpdateTrip(payload)
    }
  })

  useEffect(() => {
    if (oneTripData != null) {
      formik.setValues({ ...oneTripData })
    } else {
      formik.handleReset()
    }
  }, [oneTripData])

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={closeModal}
      PaperProps={{ style: { width: '400px' } }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>{oneTrip != null ? 'Update Trip' : 'Add Trip'}</Typography>
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
      {gettingTrip ? (
        <ModalLoading />
      ) : (
        <Fragment>
          <Box sx={{ p: 6 }}>
            <FormikProvider formik={{ ...formik, isLoading: creatingUpdatingTrip }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                <CustomSelect
                    label='Vehicle'
                    placeholder='Select Vehicle'
                    name='vehicleId'
                    options={vehicleOptions}
                    loading={gettingVehicleOptions}
                    requiredField
                  />
                </Grid>
                <Grid item xs={12}>
                <CustomSelect
                    label='Route'
                    placeholder='Select Route'
                    name='routeId'
                    options={routeOptions}
                    loading={gettingRouteOptions}
                    requiredField
                  />
                </Grid>
                {/* <Grid item xs={12}>
                <MultiSelect
                label="Select Customers"
                options={driverOptions}
                loading={gettingDriverOptions}
                value={formik.values.customers}
                onChange={selectedCustomers => {
                  formik.setFieldValue('customers', selectedCustomers)
                }}
                placeholder="Select Customers"
                requiredField
                hasError={formik.errors.customers}
                errorText={formik.errors.customers}
                />
                </Grid> */}
                <Grid item xs={12}>
                  <CustomInput label='Start Time' placeholder='Enter Start Time' name='startTime' type='datetime-local' requiredField />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput label='End Time' placeholder='Enter End Time' name='endTime' type='datetime-local' requiredField />
                </Grid>
                <Grid item xs={12}>
                  <CustomSelect
                    label='Status'
                    placeholder='Select Status'
                    name='status'
                    options={[
                      { label: 'Active', value: 'Active' },
                      { label: 'Completed', value: 'Completed' }
                    ]}
                    requiredField
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput label='Distance' placeholder='Enter Distance' name='distance' type='number' requiredField />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput label='Fuel Used' placeholder='Enter Fuel Used' name='fuelUsed' type='number' requiredField />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput label='Notes' placeholder='Enter Notes' name='notes' />
                </Grid>
              </Grid>
            </FormikProvider>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button onClick={closeModal} color='secondary' variant='outlined'>
                Cancel
              </Button>
              <CustomButton
                disabled={creatingUpdatingTrip}
                loading={creatingUpdatingTrip}
                color='primary'
                variant='contained'
                onClick={formik.handleSubmit}
              >
                {oneTrip ? 'Update' : 'Add New Trip'}
              </CustomButton>
            </Box>
          </Box>
        </Fragment>
      )}
    </Drawer>
  )
}

export default AddTripDrawer