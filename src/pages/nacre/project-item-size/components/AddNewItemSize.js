import { useFormik } from 'formik'
import React, { Fragment, useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Drawer, Grid, IconButton, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'
import * as Yup from 'yup'
import { useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { itemSizeService } from 'src/services/itemSizeService'
import { lookupService } from 'src/services/lookupService'
import CustomButton from 'src/components/CustomButton'
import CustomSelect from 'src/components/CustomSelect'
import CustomInput from 'src/components/CustomInput'
import FormikProvider from 'src/context/formik'
import toast from 'react-hot-toast'

const AddNewItemSize = ({ open, statechanger, oneSize, setOneSize }) => {
  const [oneSizeData, setOneSizeData] = useState(null)
  const [itemSizeUnitOptions, setItemSizeUnitOptions] = useState([])
  const [projectOptions, setProjectOptions] = useState([])
  const [projectBlockOptions, setProjectBlockOptions] = useState([])
  const queryClient = useQueryClient()

  const closeModal = () => {
    statechanger(false)
    formik.resetForm()
    setOneSize(null)
  }

  // Api call to get one item size
  const { isFetching: gettingItemSize } = itemSizeService.getItemSizes(
    'get-one-item-size',
    oneSize,
    '',
    '',
    '',
    '',
    false,
    1,
    10,
    {
      onSuccess: response => {
        if (response.data.isSuccess) {
          setOneSizeData(response.data?.result?.items[0])
        } else {
          setOneSizeData(null)
        }
      },
      onError: error => {
        setOneSizeData(null)
      },
      enabled: oneSize != null
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

  //Api call to get project item size units
  const { isFetching: gettingUnits } = lookupService.getProjectItemSizeUnits('get-project-item-size-units', {
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
        setItemSizeUnitOptions(temp)
      } else {
        setItemSizeUnitOptions([])
      }
    },
    onError: error => {
      setItemSizeUnitOptions([])
    }
  })

  // Api call to create/update item size
  const { mutate: createUpdateItemSize, isLoading: creatingUpdating } = itemSizeService.createUpdateItemSize({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message)
        queryClient.invalidateQueries('get-item-sizes')
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
    projectId: Yup.number(),
    projectBlockId: Yup.number().required('Required'),
    projectItemSizeUnitId: Yup.number().required('Required')
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      projectId: '',
      projectBlockId: '',
      projectItemSizeUnitId: ''
    },
    validationSchema: schema,
    onSubmit: values => {
      const payload = {
        id: oneSize ? oneSize : null,
        name: values.name,
        projectBlockId: values.projectBlockId,
        projectItemSizeUnitId: values.projectItemSizeUnitId
      }
      createUpdateItemSize(payload)
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
    if (oneSizeData) {
      formik.setValues({
        name: oneSizeData.name,
        projectBlockId: oneSizeData.projectBlockId,
        projectItemSizeUnitId: oneSizeData.projectItemSizeUnitId,
        projectId: oneSizeData.projectId ?? ''
      })
    } else {
      formik.resetForm()
    }
  }, [oneSizeData])

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
        <Typography variant='h5'>{oneSize ? 'Update Item Size' : 'Add Item Size'}</Typography>
        <IconButton onClick={closeModal}>
          <Close />
        </IconButton>
      </Box>
      {gettingItemSize ? (
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
                      label='Item Size Name'
                      placeholder='Item Size Name'
                      name='name'
                      requiredField
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomSelect
                      label='Item Size Unit'
                      options={itemSizeUnitOptions}
                      name='projectItemSizeUnitId'
                      loading={gettingUnits}
                      requiredField
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomSelect
                      label='Project'
                      options={projectOptions}
                      name='projectId'
                      loading={gettingProjects}
                      requiredField
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomSelect
                      label='Project Block'
                      options={projectBlockOptions}
                      name='projectBlockId'
                      loading={gettingProjectBlock}
                      requiredField
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={closeModal} variant='outlined' color='secondary'>
                    Cancel
                  </Button>
                  <CustomButton type='submit' loading={creatingUpdating} variant='contained' color='primary'>
                    {oneSize ? 'Update' : 'Add New Item Size'}
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

export default AddNewItemSize
