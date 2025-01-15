import React, { Fragment, useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Drawer, Grid, IconButton, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { leadService } from 'src/services/leadService'
import { lookupService } from 'src/services/lookupService'
import { Close } from '@mui/icons-material'
import CustomButton from 'src/components/CustomButton'
import CustomSelect from 'src/components/CustomSelect'
import CustomInput from 'src/components/CustomInput'
import FormikProvider from 'src/context/formik'
import toast from 'react-hot-toast'
import ModalLoading from 'src/components/ModalLoading'

const AddNewLead = ({ open, statechanger, oneLead, setOneLead }) => {
  const [oneLeadData, setOneLeadData] = useState(null)
  const [leadPlatformOptions, setLeadPlatformOptions] = useState([])
  const [leadStatusOptions, setLeadStatusOptions] = useState([])
  const queryClient = useQueryClient()

  const closeModal = () => {
    statechanger(false)
    formik.resetForm()
    setOneLead(null)
  }

  // Api call to get one lead
  const { isFetching: gettingLead } = leadService.getLeads('get-one-lead', oneLead, '', '', '', false, 1, 10, {
    onSuccess: response => {
      if (response.data.isSuccess) {
        setOneLeadData(response.data?.result?.items[0])
      } else {
        setOneLeadData(null)
      }
    },
    onError: error => {
      setOneLeadData(null)
    },
    enabled: oneLead != null
  })

  // Api call to get lead platforms
  const { isFetching: gettingPlatforms } = lookupService.getLeadPlatformsLookup('get-lead-platforms-lookup', {
    onSuccess: response => {
      if (response.data.isSuccess) {
        const temp = []
        response.data.result.items.map(one => {
          const element = {
            label: one.name,
            value: one.id
          }
          temp.push(element)
        })
        setLeadPlatformOptions(temp)
      } else {
        setLeadPlatformOptions([])
      }
    },
    onError: error => {
      setLeadPlatformOptions([])
    }
  })

  // Api call to get lead statuses
  const { isFetching: gettingStatuses } = lookupService.getLeadStatusesLookup('get-lead-statuses-lookup', {
    onSuccess: response => {
      if (response.data.isSuccess) {
        const temp = []
        response.data.result.items.map(one => {
          const element = {
            label: one.name,
            value: one.id
          }
          temp.push(element)
        })
        setLeadStatusOptions(temp)
      } else {
        setLeadStatusOptions([])
      }
    },
    onError: error => {
      setLeadStatusOptions([])
    }
  })

  // Api call to create/update lead
  const { mutate: createUpdateLead, isLoading: creatingUpdating } = leadService.createUpdateLead({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message)
        queryClient.invalidateQueries('get-leads')
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
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phoneNumber: Yup.string().required('Required'),
    campaignName: Yup.string().required('Required'),
    formName: Yup.string().required('Required'),
    jobTitle: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    externalId: Yup.string().required('Required'),
    addCampaignId: Yup.string().required('Required'),
    adSetId: Yup.string().required('Required'),
    formId: Yup.string().required('Required'),
    pageId: Yup.string().required('Required'),
    keyword: Yup.string().required('Required'),
    additionalInfo: Yup.string().required('Required'),
    leadPlatformId: Yup.number().required('Required'),
    leadStatusId: Yup.number().required('Required')
  })

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      campaignName: '',
      formName: '',
      jobTitle: '',
      city: '',
      externalId: '',
      addCampaignId: '',
      adSetId: '',
      formId: '',
      pageId: '',
      keyword: '',
      additionalInfo: '',
      leadPlatformId: '',
      leadStatusId: ''
    },
    validationSchema: schema,
    onSubmit: values => {
      const payload = {
        id: oneLead ? oneLead : null,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        campaignName: values.campaignName,
        formName: values.formName,
        jobTitle: values.jobTitle,
        city: values.city,
        externalId: values.externalId,
        addCampaignId: values.addCampaignId,
        adSetId: values.adSetId,
        formId: values.formId,
        pageId: values.pageId,
        keyword: values.keyword,
        additionalInfo: values.additionalInfo,
        leadPlatformId: values.leadPlatformId,
        leadStatusId: values.leadStatusId
      }
      createUpdateLead(payload)
    }
  })

  useEffect(() => {
    if (oneLeadData) {
      formik.setValues({
        firstName: oneLeadData.firstName,
        lastName: oneLeadData.lastName,
        email: oneLeadData.email,
        phoneNumber: oneLeadData.phoneNumber,
        campaignName: oneLeadData.campaignName,
        formName: oneLeadData.formName,
        jobTitle: oneLeadData.jobTitle,
        city: oneLeadData.city,
        externalId: oneLeadData.externalId,
        addCampaignId: oneLeadData.addCampaignId,
        adSetId: oneLeadData.adSetId,
        formId: oneLeadData.formId,
        pageId: oneLeadData.pageId,
        keyword: oneLeadData.keyword,
        additionalInfo: oneLeadData.additionalInfo,
        leadPlatformId: oneLeadData.leadPlatformId,
        leadStatusId: oneLeadData.leadStatusId
      })
    } else {
      formik.resetForm()
    }
  }, [oneLeadData])

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
        <Typography variant='h5'>{oneLead ? 'Update Lead' : 'Add Lead'}</Typography>
        <IconButton onClick={closeModal}>
          <Close />
        </IconButton>
      </Box>
      {gettingLead ? (
        <ModalLoading />
      ) : (
        <Fragment>
          <Box sx={{ p: 6 }}>
            <FormikProvider formik={{ ...formik, isLoading: creatingUpdating }}>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <CustomInput fullWidth label='First Name' placeholder='First Name' name='firstName' requiredField />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput fullWidth label='Last Name' placeholder='Last Name' name='lastName' requiredField />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput fullWidth label='Email' placeholder='Email' name='email' requiredField />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput
                      fullWidth
                      label='Phone Number'
                      placeholder='Phone Number'
                      name='phoneNumber'
                      requiredField
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput
                      fullWidth
                      label='Campaign Name'
                      placeholder='Campaign Name'
                      name='campaignName'
                      requiredField
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput fullWidth label='Form Name' placeholder='Form Name' name='formName' requiredField />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput fullWidth label='Job Title' placeholder='Job Title' name='jobTitle' requiredField />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput fullWidth label='City' placeholder='City' name='city' requiredField />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput
                      fullWidth
                      label='External Id'
                      placeholder='External Id'
                      name='externalId'
                      requiredField
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput
                      fullWidth
                      label='Add Campaign Id'
                      placeholder='Add Campaign Id'
                      name='addCampaignId'
                      requiredField
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput fullWidth label='Ad Set Id' placeholder='Ad Set Id' name='adSetId' requiredField />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput fullWidth label='Form Id' placeholder='Form Id' name='formId' requiredField />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput fullWidth label='Page Id' placeholder='Page Id' name='pageId' requiredField />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput fullWidth label='Keyword' placeholder='Keyword' name='keyword' requiredField />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput
                      fullWidth
                      label='Additional Info'
                      placeholder='Additional Info'
                      name='additionalInfo'
                      requiredField
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomSelect
                      label='Lead Platform'
                      options={leadPlatformOptions}
                      name='leadPlatformId'
                      loading={gettingPlatforms}
                      requiredField
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomSelect
                      label='Lead Status'
                      options={leadStatusOptions}
                      name='leadStatusId'
                      loading={gettingStatuses}
                      requiredField
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={closeModal} variant='outlined' color='secondary'>
                    Cancel
                  </Button>
                  <CustomButton type='submit' loading={creatingUpdating} variant='contained' color='primary'>
                    {oneLead ? 'Update' : 'Add New Lead'}
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

export default AddNewLead
