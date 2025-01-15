import React, { Fragment, useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Drawer, Grid, IconButton, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { projectStreetService } from '../../../../services/projectStreetService'
import { lookupService } from '../../../../services/lookupService'
import { Close } from '@mui/icons-material'
import CustomButton from '../../../../components/CustomButton'
import CustomSelect from '../../../../components/CustomSelect'
import CustomInput from '../../../../components/CustomInput'
import FormikProvider from '../../../../context/formik'
import toast from 'react-hot-toast'

const AddNewStreet = ({ open, statechanger, oneStreet, setOneStreet }) => {
  const [oneStreetData, setOneStreetData] = useState(null)
  const [projectOptions, setProjectOptions] = useState([])
  const [projectBlockOptions, setProjectBlockOptions] = useState([])
  const queryClient = useQueryClient()

  const closeModal = () => {
    statechanger(false)
    formik.resetForm()
    setOneStreet(null)
  }

  // Api call to get one street
  const { isFetching: gettingStreet } = projectStreetService.getProjectStreets(
    'get-one-project-street',
    oneStreet,
    '',
    '',
    '',
    false,
    1,
    10,
    {
      onSuccess: response => {
        if (response.data.isSuccess) {
          setOneStreetData(response.data?.result?.items[0])
        } else {
          setOneStreetData(null)
        }
      },
      onError: error => {
        setOneStreetData(null)
      },
      enabled: oneStreet != null
    }
  )

  //Api call to get projects
  const { isFetching: gettingProjects } = lookupService.getProjectsLookup('get-projects-lookup', {
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
        setProjectOptions(temp)
      } else {
        setProjectOptions([])
      }
    },
    onError: error => {
      setProjectOptions([])
    }
  })

  // Api call to create/update street
  const { mutate: createUpdateProjectStreet, isLoading: creatingUpdating } =
    projectStreetService.createUpdateProjectStreet({
      onSuccess: response => {
        if (response.data.isSuccess) {
          toast.success(response.data.message)
          queryClient.invalidateQueries('get-project-streets')
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
    projectId: Yup.number().required('Required'),
    projectBlockId: Yup.number().required('Required')
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      projectId: '',
      projectBlockId: ''
    },
    validationSchema: schema,
    onSubmit: values => {
      const payload = {
        id: oneStreet ? oneStreet : null,
        name: values.name,
        projectId: values.projectId,
        projectBlockId: values.projectBlockId
      }
      createUpdateProjectStreet(payload)
    }
  })

  //Api call to get project blocks
  const { isFetching: gettingProjectBlock } = lookupService.getProjectBlocksLookup(
    'get-project-blocks-lookup',
    formik.values.projectId,
    {
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
          setProjectBlockOptions(temp)
        } else {
          setProjectBlockOptions([])
        }
      },
      onError: error => {
        setProjectBlockOptions([])
      }
    }
  )

  useEffect(() => {
    if (oneStreetData) {
      formik.setValues({
        name: oneStreetData.name,
        projectBlockId: oneStreetData.projectBlockId,
        projectId: oneStreetData.projectId ?? ''
      })
    } else {
      formik.resetForm()
    }
  }, [oneStreetData])

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
        <Typography variant='h5'>{oneStreet ? 'Update Street' : 'Add Street'}</Typography>
        <IconButton onClick={closeModal}>
          <Close />
        </IconButton>
      </Box>
      {gettingStreet ? (
        <CircularProgress />
      ) : (
        <Fragment>
          <Box sx={{ p: 6 }}>
            <FormikProvider formik={{ ...formik, isLoading: creatingUpdating }}>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <CustomInput fullWidth label='Street Name' placeholder='Street Name' name='name' requiredField />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomSelect
                      label='Select Project'
                      options={projectOptions}
                      name='projectId'
                      loading={gettingProjects}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomSelect
                      label='Select Project Block'
                      options={projectBlockOptions}
                      name='projectBlockId'
                      loading={gettingProjectBlock}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={closeModal} variant='outlined' color='secondary'>
                    Cancel
                  </Button>
                  <CustomButton type='submit' loading={creatingUpdating} variant='contained' color='primary'>
                    {oneStreet ? 'Update' : 'Add New Street'}
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

export default AddNewStreet
