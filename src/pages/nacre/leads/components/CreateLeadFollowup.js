import React, { Fragment, useState, useEffect } from 'react'
import { Box, Button, CircularProgress, Drawer, Grid, IconButton, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { leadService } from '../../../../services/leadService'
import { lookupService } from '../../../../services/lookupService'
import { useSelector } from 'react-redux'
import { followUpService } from '../../../../services/followUpService'
import CustomSelect from '../../../../components/CustomSelect'
import CustomButton from '../../../../components/CustomButton'
import { Close } from '@mui/icons-material'
import FormikProvider from '../../../../context/formik'
import CustomInput from 'src/components/CustomInput'

const CreateLeadFollowup = ({ open, statechanger, oneFollowup, setOneFollowup }) => {
  const [oneFollowupData, setOneFollowupData] = useState(null)
  const [followupStatusOptions, setFollowupStatusOptions] = useState([])
  const queryClient = useQueryClient()
  const currentLeadId = useSelector(state => state.lead.currentLeadId)

  const closeModal = () => {
    statechanger(false)
    formik.resetForm()
    setOneFollowup?.(null)
  }

  //Api call to get follow up statuses
  const { isFetching: gettingStatuses } = lookupService.getFollowupStatuses('get-followup-statuses-lookup', {
    onSuccess: response => {
      if (response.data.isSuccess) {
        const temp = response.data.result.items.map(one => ({
          label: one.name,
          value: one.id
        }))
        setFollowupStatusOptions(temp)
      } else {
        setFollowupStatusOptions([])
      }
    },
    onError: () => {
      setFollowupStatusOptions([])
    }
  })

  // Api call to create update lead
  const { mutate: createUpdateFollowUp, isLoading: creatingUpdating } = followUpService.createUpdateFollowUp({
    onSuccess: response => {
      if (response.data.isSuccess) {
        Swal.fire({
          icon: 'success',
          text: response.data.message
        })
        queryClient.invalidateQueries(['get-lead-followups', currentLeadId])
        closeModal()
      } else {
        Swal.fire({
          icon: 'error',
          text: response.data.message
        })
      }
    },
    onError: error => {
      Swal.fire({
        icon: 'error',
        text: error.message
      })
    }
  })

  const schema = Yup.object().shape({
    followUpDate: Yup.string().required('Required'),
    scheduledDate: Yup.string().required('Required'),
    followUpStatusId: Yup.string().required('Required'),
    notes: Yup.string().required('Required')
  })

  const formik = useFormik({
    initialValues: {
      followUpDate: '',
      scheduledDate: '',
      followUpStatusId: '',
      notes: ''
    },
    validationSchema: schema,
    onSubmit: values => {
      const payload = {
        Id: oneFollowup ? oneFollowup : '',
        Notes: values.notes,
        FollowUpDate: values.followUpDate,
        ScheduledDate: values.scheduledDate,
        FollowUpStatusId: values.followUpStatusId,
        LeadId: currentLeadId
      }
      createUpdateFollowUp(payload)
    }
  })

  useEffect(() => {
    if (oneFollowupData != null) {
      formik.setValues({
        followUpDate: oneFollowupData.followUpDate,
        scheduledDate: oneFollowupData.scheduledDate,
        followUpStatusId: oneFollowupData.followUpStatusId,
        notes: oneFollowupData.notes
      })
    } else {
      formik.resetForm()
    }
  }, [oneFollowupData])

  return (
    <Drawer anchor='right' open={open} onClose={closeModal} PaperProps={{ style: { width: '400px' } }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: theme => theme.spacing(6),
          justifyContent: 'space-between'
        }}
      >
        <Typography variant='h5'>{oneFollowup ? 'Update Followup' : 'Add Followup'}</Typography>
        <IconButton onClick={closeModal}>
          <Close />
        </IconButton>
      </Box>
      {false ? (
        <CircularProgress />
      ) : (
        <Fragment>
          <Box sx={{ p: 6 }}>
            <FormikProvider formik={{ ...formik, isLoading: creatingUpdating }}>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <CustomInput fullWidth label='Followup Date' type='date' name='followUpDate' />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput fullWidth label='Scheduled Date' type='date' name='scheduledDate' />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomSelect
                      label='Followup Status'
                      name='followUpStatusId'
                      options={followupStatusOptions}
                      loading={gettingStatuses}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput fullWidth label='Notes' type='text' name='notes' multiline rows={4} />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={closeModal} variant='outlined' color='secondary'>
                    Cancel
                  </Button>
                  <CustomButton type='submit' loading={creatingUpdating} variant='contained' color='primary'>
                    {oneFollowup ? 'Update' : 'Add New Followup'}
                  </CustomButton>
                </Box>
              </form>
            </FormikProvider>
          </Box>
        </Fragment>
      )}
    </Drawer>
  )
}

export default CreateLeadFollowup
