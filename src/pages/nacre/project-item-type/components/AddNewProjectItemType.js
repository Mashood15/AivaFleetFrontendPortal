import React, { Fragment, useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Drawer, Grid, IconButton, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { projectItemTypeService } from '../../../../services/projectItemTypeService'
import { lookupService } from '../../../../services/lookupService'
import { Close } from '@mui/icons-material'
import CustomButton from '../../../../components/CustomButton'
import CustomSelect from '../../../../components/CustomSelect'
import CustomInput from '../../../../components/CustomInput'
import FormikProvider from '../../../../context/formik'
import toast from 'react-hot-toast'

const AddNewProjectItemType = ({ open, statechanger, oneItemType, setOneItemType }) => {
  const [oneItemTypeData, setOneItemTypeData] = useState(null)
  const [projectOptions, setProjectOptions] = useState([])
  const queryClient = useQueryClient()

  const closeModal = () => {
    statechanger(false)
    formik.resetForm()
    setOneItemType(null)
  }

  // Api call to get one item type
  const { isFetching: gettingProject } = projectItemTypeService.getProjectItemTypes(
    'get-one-project-item-type',
    oneItemType,
    '',
    '',
    '',
    false,
    1,
    10,
    {
      onSuccess: response => {
        if (response.data.isSuccess) {
          setOneItemTypeData(response.data?.result?.items[0])
        } else {
          setOneItemTypeData(null)
        }
      },
      onError: error => {
        setOneItemTypeData(null)
      },
      enabled: oneItemType != null
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

  // Api call to create update project
  const { mutate: createUpdateProjectItemType, isLoading: creatingUpdating } =
    projectItemTypeService.createUpdateProjectItemType({
      onSuccess: response => {
        if (response.data.isSuccess) {
          toast.success(response.data.message)
          queryClient.invalidateQueries('get-project-item-types')
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
    projectId: Yup.number().required('Required')
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      projectId: ''
    },
    validationSchema: schema,
    onSubmit: values => {
      const payload = {
        id: oneItemType ? oneItemType : null,
        name: values.name,
        projectId: values.projectId
      }
      createUpdateProjectItemType(payload)
    }
  })

  useEffect(() => {
    if (oneItemTypeData) {
      formik.setValues({
        name: oneItemTypeData.name,
        projectId: oneItemTypeData.projectId
      })
    } else {
      formik.resetForm()
    }
  }, [oneItemTypeData])

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
        <Typography variant='h5'>{oneItemType ? 'Update Item Type' : 'Add Item Type'}</Typography>
        <IconButton onClick={closeModal}>
          <Close />
        </IconButton>
      </Box>
      {gettingProject ? (
        <CircularProgress />
      ) : (
        <Fragment>
          <Box sx={{ p: 6 }}>
            <FormikProvider formik={{ ...formik, isLoading: creatingUpdating }}>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <CustomInput
                      fullWidth
                      label='Item Type Name'
                      placeholder='Item Type Name'
                      name='name'
                      requiredField
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomSelect
                      label='Select Project'
                      options={projectOptions}
                      name='projectId'
                      loading={gettingProjects}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={closeModal} variant='outlined' color='secondary'>
                    Cancel
                  </Button>
                  <CustomButton type='submit' loading={creatingUpdating} variant='contained' color='primary'>
                    {oneItemType ? 'Update' : 'Add New Item Type'}
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

export default AddNewProjectItemType
