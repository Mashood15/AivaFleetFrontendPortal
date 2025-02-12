import React, { Fragment, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  Box,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormikProvider from 'src/context/formik';
import CustomInput from 'src/components/CustomInput';
import CustomButton from 'src/components/CustomButton';
import ModalLoading from 'src/components/ModalLoading';
import { RouteService } from 'src/services/routeService';
import { useQueryClient } from '@tanstack/react-query';
import Icon from 'src/@core/components/icon';
import toast from 'react-hot-toast';

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)',
  },
}));

function AddRouteDialog({ open, statechanger, oneRoute, setOneRoute }) {
  const [oneRouteData, setOneRouteData] = useState(null);
  const queryClient = useQueryClient();

  function closeModal() {
    statechanger(false);
    formik.handleReset();
    setOneRoute(null);
  }

  // API call to get one route
  const { isFetching: gettingRoute } = RouteService.getRoute('get-one-route', oneRoute, {
    onSuccess: response => {
      if (response.data.isSuccess) {
        setOneRouteData(response.data?.result);
      } else {
        setOneRouteData(null);
      }
    },
    onError: () => setOneRouteData(null),
    enabled: oneRoute != null
  });

  // API call to create/update route
  const { mutate: createUpdateRoute, isLoading: creatingUpdatingRoute } = RouteService.createUpdateRoute({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message);
        queryClient.invalidateQueries('get-routes');
        closeModal();
      } else {
        toast.error(response.data.message);
      }
    },
    onError: error => {
      toast.error(error.message);
    }
  });

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required').min(3, 'Name must be at least 3 characters long'),
    startLocation: Yup.string().required('Start Location is required'),
    endLocation: Yup.string().required('End Location is required'),
    distance: Yup.number().required('Distance is required'),
    estimatedDuration: Yup.number().required('Estimated Duration is required'),
    description: Yup.string().required('Description is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      startLocation: '',
      endLocation: '',
      distance: '',
      estimatedDuration: '',
      description: '',
    },
    validationSchema: schema,
    onSubmit: values => {
      let payload = {
        ...(oneRoute === null && { id: oneRoute }),
        name: values.name,
        startLocation: values.startLocation,
        endLocation: values.endLocation,
        distance: values.distance,
        estimatedDuration: values.estimatedDuration,
        description: values.description,
      };
      createUpdateRoute(payload);
    }
  });

  useEffect(() => {
    if (oneRouteData != null) {
      formik.setValues({
        name: oneRouteData.name,
        startLocation: oneRouteData.startLocation,
        endLocation: oneRouteData.endLocation,
        distance: oneRouteData.distance,
        estimatedDuration: oneRouteData.estimatedDuration,
        description: oneRouteData.description,
      });
    } else {
      formik.handleReset();
    }
  }, [oneRouteData]);

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      aria-labelledby='add-route-dialog-title'
      fullWidth
      maxWidth='sm'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogTitle id='add-route-dialog-title' sx={{ p: 4 }}>
        <Typography variant='h6'>{oneRoute ? 'Update Route' : 'Add Route'}</Typography>
        <CustomCloseButton aria-label='close' onClick={closeModal}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
      </DialogTitle>

      {gettingRoute ? (
        <ModalLoading />
      ) : (
        <DialogContent dividers sx={{ p: (theme) => `${theme.spacing(4)} !important` }}>
          <FormikProvider formik={{ ...formik, isLoading: creatingUpdatingRoute }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomInput label='Name' placeholder='Route Name' name='name' requiredField />
              </Grid>
              <Grid item xs={12}>
                <CustomInput label='Start Location' placeholder='Start Location' name='startLocation' requiredField />
              </Grid>
              <Grid item xs={12}>
                <CustomInput label='End Location' placeholder='End Location' name='endLocation' requiredField />
              </Grid>
              <Grid item xs={12}>
                <CustomInput label='Distance' placeholder='Distance (in km)' name='distance' requiredField />
              </Grid>
              <Grid item xs={12}>
                <CustomInput label='Estimated Duration' placeholder='Duration (in minutes)' name='estimatedDuration' requiredField />
              </Grid>
              <Grid item xs={12}>
                <CustomInput label='Description' placeholder='Description' name='description' requiredField />
              </Grid>
            </Grid>
          </FormikProvider>
        </DialogContent>
      )}

      <DialogActions sx={{ p: (theme) => `${theme.spacing(3)} !important` }}>
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
      </DialogActions>
    </Dialog>
  );
}

export default AddRouteDialog;