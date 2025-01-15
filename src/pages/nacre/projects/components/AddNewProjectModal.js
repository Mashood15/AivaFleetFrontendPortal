import { useFormik } from 'formik'
import React, { Fragment, useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Drawer, Grid, IconButton, TextField, Typography } from '@mui/material'
import * as Yup from 'yup'
import FormikProvider from 'src/context/formik'
import CustomInput from 'src/components/CustomInput'
import CustomButton from 'src/components/CustomButton'
import CustomSelect from 'src/components/CustomSelect'
import ModalLoading from 'src/components/ModalLoading'
import FileUploaderSingle from 'src/components/FileUploaderSingle'
import { projectService } from 'src/services/projectService'
import { lookupService } from 'src/services/lookupService'
import Swal from 'sweetalert2'
import { useQueryClient } from '@tanstack/react-query'
import { Close } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import toast from 'react-hot-toast'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

function AddNewProjectModal({ open, statechanger, oneProject, setOneProject }) {
  const [oneProjectData, setOneProjectData] = useState(null)
  const [projectTypeOptions, setProjectTypeOptions] = useState([])
  const queryClient = useQueryClient()

  function closeModal() {
    statechanger(false)
    formik.handleReset()
    setOneProject(null)
  }

  // Api call to get one project
  const { isFetching: gettingProject } = projectService.getProjects(
    'get-one-project',
    oneProject,
    '',
    '',
    false,
    1,
    10,
    {
      onSuccess: response => {
        if (response.data.isSuccess) {
          setOneProjectData(response.data?.result?.items[0])
        } else {
          setOneProjectData(null)
        }
      },
      onError: error => {
        setOneProjectData(null)
      },
      enabled: oneProject != null
    }
  )

  //Api call to get project types
  const { isFetching: gettingProjectTypes } = lookupService.getProjectTypesLookup('get-project-types-lookup', {
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
        setProjectTypeOptions(temp)
      } else {
        setProjectTypeOptions([])
      }
    },
    onError: error => {
      setProjectTypeOptions([])
    }
  })

  // Api call to create update project
  const { mutate: createUpdateProject, isLoading: creatingUpdatingProject } = projectService.createUpdateProject({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message)
        queryClient.invalidateQueries('get-projects')
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
    name: Yup.string().required('Required'),
    punchLine: Yup.string().required('Required'),
    longDescription: Yup.string().required('Required'),
    headOfficeAddress: Yup.string().required('Required'),
    contactEmail: Yup.string().email('Invalid email format').required('Required'),
    projectTypeId: Yup.number().required('Required'),
    landLine1: Yup.string().required('Required'),
    landLine2: Yup.string(),
    mobile1: Yup.string().required('Required'),
    mobile2: Yup.string(),
    fax: Yup.string(),
    logo: Yup.mixed()
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      punchLine: '',
      longDescription: '',
      headOfficeAddress: '',
      contactEmail: '',
      projectTypeId: '',
      landLine1: '',
      landLine2: '',
      mobile1: '',
      mobile2: '',
      fax: '',
      logo: null
    },
    validationSchema: schema,
    onSubmit: values => {
      let formData = new FormData()
      formData.append('id', oneProject ? oneProject : '')
      formData.append('name', values.name)
      formData.append('punchLine', values.punchLine)
      formData.append('longDescription', values.longDescription)
      formData.append('headOfficeAddress', values.headOfficeAddress)
      formData.append('contactEmail', values.contactEmail)
      formData.append('projectTypeId', values.projectTypeId === '' ? '' : parseInt(values.projectTypeId))
      formData.append('landLine1', values.landLine1)
      formData.append('landLine2', values.landLine2)
      formData.append('mobile1', values.mobile1)
      formData.append('mobile2', values.mobile2)
      formData.append('fax', values.fax)
      formData.append('logo', values.logo)

      createUpdateProject(formData)
    }
  })

  useEffect(() => {
    if (oneProjectData != null) {
      formik.setValues({
        name: oneProjectData.name,
        punchLine: oneProjectData.punchLine,
        longDescription: oneProjectData.longDescription,
        headOfficeAddress: oneProjectData.headOfficeAddress,
        contactEmail: oneProjectData.contactEmail,
        projectTypeId: oneProjectData.projectTypeId ? oneProjectData.projectTypeId : '',
        landLine1: oneProjectData.landLine1,
        landLine2: oneProjectData.landLine2,
        mobile1: oneProjectData.mobile1,
        mobile2: oneProjectData.mobile2,
        fax: oneProjectData.fax
      })
    } else {
      formik.handleReset()
    }
  }, [oneProjectData])

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={closeModal}
      PaperProps={{ style: { width: '400px' } }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>{oneProject != null ? 'Update Project' : 'Add Project'}</Typography>
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
          <Close />
        </IconButton>
      </Header>
      {gettingProject ? (
        <ModalLoading />
      ) : (
        <Fragment>
          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
            <FormikProvider formik={{ ...formik, isLoading: creatingUpdatingProject }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CustomInput label='Project Name' placeholder='Project Name' name='name' requiredField />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput label='Punch Line' placeholder='Punch Line' name='punchLine' requiredField />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput
                    label='Head Office Address'
                    placeholder='Head Office Address'
                    name='headOfficeAddress'
                    requiredField
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput
                    label='Contact Email'
                    placeholder='example@example.com'
                    name='contactEmail'
                    requiredField
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput
                    type='tel'
                    label='Land Line 1'
                    placeholder='Land Line 1'
                    name='landLine1'
                    requiredField
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput type='tel' label='Land Line 2' placeholder='Land Line 2' name='landLine2' />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput type='tel' label='Mobile 1' placeholder='Mobile 1' name='mobile1' requiredField />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput type='tel' label='Mobile 2' placeholder='Mobile 2' name='mobile2' />
                </Grid>
                <Grid item xs={12}>
                  <CustomSelect
                    label='Project Type'
                    name='projectTypeId'
                    options={projectTypeOptions}
                    loading={gettingProjectTypes}
                    requiredField
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput label='Fax' placeholder='Fax' name='fax' />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput
                    type='textarea'
                    label='Long Description'
                    placeholder='Long Description'
                    name='longDescription'
                    requiredField
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='caption' color='textSecondary'>
                    Logo
                  </Typography>
                  <FileUploaderSingle formik={formik} name={'logo'} disabled={creatingUpdatingProject} />
                </Grid>
              </Grid>
            </FormikProvider>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button onClick={closeModal} color='secondary' variant='outlined'>
                Cancel
              </Button>
              <CustomButton
                disabled={creatingUpdatingProject}
                loading={creatingUpdatingProject}
                color='primary'
                variant='contained'
                onClick={formik.handleSubmit}
              >
                {oneProject ? 'Update' : 'Add New Project'}
              </CustomButton>
            </Box>
          </Box>
        </Fragment>
      )}
    </Drawer>
  )
}

export default AddNewProjectModal
