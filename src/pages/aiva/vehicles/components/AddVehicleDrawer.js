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
import { vehicleService } from 'src/services/vehicleService'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

function AddVehicleDrawer({ open, statechanger, oneVehicle, setOneVehicle }) {
  const [oneVehicleData, setOneVehicleData] = useState(null)
  const queryClient = useQueryClient()

  function closeModal() {
    statechanger(false)
    formik.handleReset()
    setOneVehicle(null)
  }

  // Api call to get one vehicle
  const { isFetching: gettingVehicle } = vehicleService.getVehicle('get-one-vehicle', oneVehicle, {
    onSuccess: response => {
      if (response.data.isSuccess) {
        setOneVehicleData(response.data?.result)
      } else {
        setOneVehicleData(null)
      }
    },
    onError: error => {
      setOneVehicleData(null)
    },
    enabled: oneVehicle != null
  })

  // Api call to create/update vehicle
  const { mutate: createUpdateVehicle, isLoading: creatingUpdatingVehicle } = vehicleService.createUpdateVehicle({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message)
        queryClient.invalidateQueries('get-vehicles')
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
    registrationNumber: Yup.string().required('Registration Number is required'),
    make: Yup.string().required('Make is required'),
    model: Yup.string().required('Model is required'),
    year: Yup.number().required('Year is required').min(1900, 'Year must be after 1900'),
    vin: Yup.string().required('VIN is required'),
    color: Yup.string().required('Color is required'),
    capacity: Yup.number().required('Capacity is required').min(1, 'Capacity must be at least 1'),
    status: Yup.string().required('Status is required'),
    fuelType: Yup.string().required('Fuel Type is required'),
    fuelCapacity: Yup.number().required('Fuel Capacity is required').min(1, 'Fuel Capacity must be at least 1'),
    insuranceInfo: Yup.string().optional(),
    insuranceExpiryDate: Yup.date().required('Insurance Expiry Date is required'),
    lastMaintenanceDate: Yup.date().optional(),
    notes: Yup.string().optional(),
    isActive: Yup.boolean().required('Status is required')
  })

  const formik = useFormik({
    initialValues: {
      registrationNumber: '',
      make: '',
      model: '',
      year: '',
      vin: '',
      color: '',
      capacity: '',
      status: '',
      fuelType: '',
      fuelCapacity: '',
      insuranceInfo: '',
      insuranceExpiryDate: '',
      lastMaintenanceDate: '',
      notes: '',
      isActive: true
    },
    validationSchema: schema,
    onSubmit: values => {
      let payload = {
        ...(oneVehicle !== null && { id: oneVehicle }),
        ...values
      }
      createUpdateVehicle(payload)
    }
  })

  useEffect(() => {
    if (oneVehicleData != null) {
      formik.setValues({
        registrationNumber: oneVehicleData.registrationNumber,
        make: oneVehicleData.make,
        model: oneVehicleData.model,
        year: oneVehicleData.year,
        vin: oneVehicleData.vin,
        color: oneVehicleData.color,
        capacity: oneVehicleData.capacity,
        status: oneVehicleData.status,
        fuelType: oneVehicleData.fuelType,
        fuelCapacity: oneVehicleData.fuelCapacity,
        insuranceInfo: oneVehicleData.insuranceInfo,
        insuranceExpiryDate: oneVehicleData.insuranceExpiryDate,
        lastMaintenanceDate: oneVehicleData.lastMaintenanceDate,
        notes: oneVehicleData.notes,
        isActive: oneVehicleData.isActive
      })
    } else {
      formik.handleReset()
    }
  }, [oneVehicleData])

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={closeModal}
      PaperProps={{ style: { width: '400px' } }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>{oneVehicle != null ? 'Update Vehicle' : 'Add Vehicle'}</Typography>
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
      {gettingVehicle ? (
        <ModalLoading />
      ) : (
        <Fragment>
                   <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
            <FormikProvider formik={{ ...formik, isLoading: creatingUpdatingVehicle }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CustomInput label='Registration Number' placeholder='Enter Registration Number' name='registrationNumber' requiredField />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput label='Make' placeholder='Enter Make' name='make' requiredField />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput label='Model' placeholder='Enter Model' name='model' requiredField />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput label='Year' placeholder='Enter Year' name='year' type='number' requiredField />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput label='VIN' placeholder='Enter VIN' name='vin' requiredField />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput label='Color' placeholder='Enter Color' name='color' requiredField />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput label='Capacity' placeholder='Enter Capacity' name='capacity' type='number' requiredField />
                </Grid>
                <Grid item xs={12}>
                  <CustomSelect
                    label='Status'
                    placeholder='Select Status'
                    name='status'
                    options={[
                      { label: 'Active', value: 'Active' },
                      { label: 'Inactive', value: 'Inactive' }
                    ]}
                    requiredField
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput label='Fuel Type' placeholder='Enter Fuel Type' name='fuelType' requiredField />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput label='Fuel Capacity' placeholder='Enter Fuel Capacity' name='fuelCapacity' type='number' requiredField />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput label='Insurance Info' placeholder='Enter Insurance Info' name='insuranceInfo' />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput label='Insurance Expiry Date' placeholder='Enter Insurance Expiry Date' name='insuranceExpiryDate' type='date' requiredField />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput label='Last Maintenance Date' placeholder='Enter Last Maintenance Date' name='lastMaintenanceDate' type='date' />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput label='Notes' placeholder='Enter Notes' name='notes' />
                </Grid>
                <Grid item xs={12}>
                  <CustomSelect
                    label='Is Active'
                    placeholder='Select Status'
                    name='isActive'
                    options={[
                      { label: 'Active', value: true },
                      { label: 'Inactive', value: false }
                    ]}
                    requiredField
                  />
                </Grid>
              </Grid>
            </FormikProvider>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button onClick={closeModal} color='secondary' variant='outlined'>
                Cancel
              </Button>
              <CustomButton
                disabled={creatingUpdatingVehicle}
                loading={creatingUpdatingVehicle}
                color='primary'
                variant='contained'
                onClick={formik.handleSubmit}
              >
                {oneVehicle ? 'Update' : 'Add New Vehicle'}
              </CustomButton>
            </Box>
          </Box>
        </Fragment>
      )}
    </Drawer>
  )
}

export default AddVehicleDrawer