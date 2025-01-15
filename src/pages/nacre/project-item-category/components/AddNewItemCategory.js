import React, { Fragment, useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Drawer, Grid, IconButton, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { itemCategoryService } from '../../../../services/itemCategoryService'
import { lookupService } from '../../../../services/lookupService'
import { Close } from '@mui/icons-material'
import CustomButton from '../../../../components/CustomButton'
import CustomSelect from '../../../../components/CustomSelect'
import CustomInput from '../../../../components/CustomInput'
import FormikProvider from '../../../../context/formik'
import toast from 'react-hot-toast'

const AddNewItemCategory = ({ open, statechanger, oneCategory, setOneCategory }) => {
  const [oneCategoryData, setOneCategoryData] = useState(null)
  const [projectOptions, setProjectOptions] = useState([])
  const queryClient = useQueryClient()

  const closeModal = () => {
    statechanger(false)
    formik.resetForm()
    setOneCategory(null)
  }

  // Api call to get one item category
  const { isFetching: gettingCategory } = itemCategoryService.getItemCategories(
    'get-one-item-category',
    oneCategory,
    '',
    '',
    '',
    false,
    1,
    10,
    {
      onSuccess: response => {
        if (response.data.isSuccess) {
          setOneCategoryData(response.data?.result?.items[0])
        } else {
          setOneCategoryData(null)
        }
      },
      onError: error => {
        setOneCategoryData(null)
      },
      enabled: oneCategory != null
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

  // Api call to create/update item category
  const { mutate: createUpdateItemCategory, isLoading: creatingUpdating } =
    itemCategoryService.createUpdateItemCategory({
      onSuccess: response => {
        if (response.data.isSuccess) {
          toast.success(response.data.message)
          queryClient.invalidateQueries('get-item-categories')
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
    priceImpactPercent: Yup.number().positive('Should be a positive number').required('Required'),
    projectId: Yup.number().required('Required')
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      priceImpactPercent: '',
      projectId: ''
    },
    validationSchema: schema,
    onSubmit: values => {
      const payload = {
        id: oneCategory ? oneCategory : null,
        name: values.name,
        priceImpactPercent: values.priceImpactPercent,
        projectId: values.projectId
      }
      createUpdateItemCategory(payload)
    }
  })

  useEffect(() => {
    if (oneCategoryData) {
      formik.setValues({
        name: oneCategoryData.name,
        priceImpactPercent: oneCategoryData.priceImpactPercent,
        projectId: oneCategoryData.projectId
      })
    } else {
      formik.resetForm()
    }
  }, [oneCategoryData])

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
        <Typography variant='h5'>{oneCategory ? 'Update Category' : 'Add Category'}</Typography>
        <IconButton onClick={closeModal}>
          <Close />
        </IconButton>
      </Box>
      {gettingCategory ? (
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
                      label='Category Name'
                      placeholder='Category Name'
                      name='name'
                      requiredField
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput
                      fullWidth
                      label='Price Impact Percent'
                      placeholder='Price Impact Percent'
                      name='priceImpactPercent'
                      type='number'
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
                    {oneCategory ? 'Update' : 'Add New Category'}
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

export default AddNewItemCategory
