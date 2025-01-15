import React, { Fragment, useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Drawer, Grid, IconButton, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { projectItemService } from '../../../../services/projectItemService'
import { lookupService } from '../../../../services/lookupService'
import { Close } from '@mui/icons-material'
import CustomButton from '../../../../components/CustomButton'
import CustomSelect from '../../../../components/CustomSelect'
import CustomInput from '../../../../components/CustomInput'
import FormikProvider from '../../../../context/formik'
import toast from 'react-hot-toast'
import Select from 'react-select'
// import { multiSelectCustomStyles } from '../../../../utility/Utils'

const AddNewItem = ({ open, statechanger, oneItem, setOneItem }) => {
  const [oneItemData, setOneItemData] = useState(null)
  const [projectOptions, setProjectOptions] = useState([])
  const [projectBlockOptions, setProjectBlockOptions] = useState([])
  const [projectStreetOptions, setProjectStreetOptions] = useState([])
  const [projectItemTypeOptions, setProjectItemTypeOptions] = useState([])
  const [projectItemCategoryOptions, setProjectItemCategoryOptions] = useState([])
  const [projectItemStatusOptions, setProjectItemStatusOptions] = useState([])
  const [projectItemAttributeOptions, setProjectItemAttributeOptions] = useState([])
  const queryClient = useQueryClient()

  const closeModal = () => {
    statechanger(false)
    formik.resetForm()
    setOneItem(null)
  }

  // Api call to get one item
  const { isFetching: gettingItem } = projectItemService.getProjectItems(
    'get-one-project-item',
    oneItem,
    '',
    '',
    '',
    false,
    1,
    10,
    {
      onSuccess: response => {
        if (response.data.isSuccess) {
          setOneItemData(response.data?.result?.items[0])
        } else {
          setOneItemData(null)
        }
      },
      onError: error => {
        setOneItemData(null)
      },
      enabled: oneItem != null
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

  // Api call to create/update item
  const { mutate: createUpdateProjectItem, isLoading: creatingUpdating } = projectItemService.createUpdateProjectItem({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message)
        queryClient.invalidateQueries('get-project-items')
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
    price: Yup.number().required('Required'),
    description: Yup.string().required('Required'),
    authorityNumber: Yup.string().required('Required'),
    projectId: Yup.number(),
    projectBlockId: Yup.number(),
    projectStreetId: Yup.number().required('Required'),
    projectItemTypeId: Yup.number().required('Required'),
    projectItemCategoryId: Yup.number().required('Required'),
    projectItemStatusId: Yup.number().required('Required'),
    projectAttributes: Yup.array()
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      description: '',
      authorityNumber: '',
      projectId: '',
      projectBlockId: '',
      projectStreetId: '',
      projectItemTypeId: '',
      projectItemCategoryId: '',
      projectItemStatusId: '',
      projectAttributes: []
    },
    validationSchema: schema,
    onSubmit: values => {
      const payload = {
        id: oneItem ? oneItem : null,
        name: values.name,
        price: values.price,
        description: values.description,
        authorityNumber: values.authorityNumber,
        projectStreetId: values.projectStreetId,
        projectItemTypeId: values.projectItemTypeId,
        projectItemCategoryId: values.projectItemCategoryId,
        projectItemStatusId: values.projectItemStatusId,
        projectAttributes: values.projectAttributes
      }

      createUpdateProjectItem(payload)
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

  //Api call to get project streets
  const { isFetching: gettingProjectStreets } = lookupService.getProjectStreetsLookup(
    'get-project-streets-lookup',
    formik.values.projectBlockId,
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
          setProjectStreetOptions(temp)
        } else {
          setProjectStreetOptions([])
        }
      },
      onError: error => {
        setProjectStreetOptions([])
      }
    }
  )

  //Api call to get project item types
  const { isFetching: gettingProjectItemTypes } = lookupService.getProjectItemTypesLookup(
    'get-project-item-types-lookup',
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
          setProjectItemTypeOptions(temp)
        } else {
          setProjectItemTypeOptions([])
        }
      },
      onError: error => {
        setProjectItemTypeOptions([])
      }
    }
  )

  //Api call to get project item Category
  const { isFetching: gettingProjectItemCategories } = lookupService.getProjectItemCategoriesLookup(
    'get-project-item-categories-lookup',
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
          setProjectItemCategoryOptions(temp)
        } else {
          setProjectItemCategoryOptions([])
        }
      },
      onError: error => {
        setProjectItemCategoryOptions([])
      }
    }
  )

  //Api call to get project item status
  const { isFetching: gettingProjectItemStatues } = lookupService.getProjectItemStatusesLookup(
    'get-project-item-statuses-lookup',
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
          setProjectItemStatusOptions(temp)
        } else {
          setProjectItemStatusOptions([])
        }
      },
      onError: error => {
        setProjectItemStatusOptions([])
      }
    }
  )

  //Api call to get project item Attributes
  const { isFetching: gettingProjectItemAttributes } = lookupService.getProjectItemAttributesLookup(
    'get-project-item-attributes-lookup',
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
          setProjectItemAttributeOptions(temp)
        } else {
          setProjectItemAttributeOptions([])
        }
      },
      onError: error => {
        setProjectItemAttributeOptions([])
      }
    }
  )

  useEffect(() => {
    if (oneItemData) {
      formik.setValues({
        name: oneItemData.name,
        price: oneItemData.price,
        description: oneItemData.description,
        authorityNumber: oneItemData.authorityNumber,
        projectStreetId: oneItemData.projectStreetId,
        projectItemTypeId: oneItemData.projectItemTypeId,
        projectItemCategoryId: oneItemData.projectItemCategoryId,
        projectItemStatusId: oneItemData.projectItemStatusId,
        projectAttributes:
          oneItemData.projectItemAttributeNames?.length > 0
            ? oneItemData.projectItemAttributeNames.map(one => {
                return one.id
              })
            : [],
        projectId: oneItemData.projectId ?? '',
        projectBlockId: oneItemData.projectBlockId ?? ''
      })
    } else {
      formik.resetForm()
    }
  }, [oneItemData])

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
        <Typography variant='h5'>{oneItem ? 'Update Item' : 'Add Item'}</Typography>
        <IconButton onClick={closeModal}>
          <Close />
        </IconButton>
      </Box>
      {gettingItem ? (
        <CircularProgress />
      ) : (
        <Fragment>
          <Box sx={{ p: 6 }}>
            <FormikProvider formik={{ ...formik, isLoading: creatingUpdating }}>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <CustomInput fullWidth label='Item Name' placeholder='Item Name' name='name' requiredField />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput fullWidth label='Price' placeholder='Price' name='price' requiredField />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput
                      fullWidth
                      label='Description'
                      placeholder='Description'
                      name='description'
                      requiredField
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomInput
                      fullWidth
                      label='Authority Number'
                      placeholder='Authority Number'
                      name='authorityNumber'
                      requiredField
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomSelect
                      label='Select Project'
                      name='projectId'
                      options={projectOptions}
                      loading={gettingProjects}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomSelect
                      label='Select Project Block'
                      name='projectBlockId'
                      options={projectBlockOptions}
                      loading={gettingProjectBlock}
                      placeholder='Select project to get blocks'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomSelect
                      label='Select Project Street'
                      name='projectStreetId'
                      options={projectStreetOptions}
                      loading={gettingProjectStreets}
                      placeholder='Select block to get streets'
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomSelect
                      label='Select Item Type'
                      name='projectItemTypeId'
                      options={projectItemTypeOptions}
                      loading={gettingProjectItemTypes}
                      placeholder='Select project to get item types'
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomSelect
                      label='Select Item Category'
                      name='projectItemCategoryId'
                      options={projectItemCategoryOptions}
                      loading={gettingProjectItemCategories}
                      placeholder='Select project to get item categories'
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomSelect
                      label='Select Item Status'
                      name='projectItemStatusId'
                      options={projectItemStatusOptions}
                      loading={gettingProjectItemStatues}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='h6'>Item Attributes</Typography>
                    <Select
                      isMulti
                      //   styles={multiSelectCustomStyles}
                      options={projectItemAttributeOptions}
                      isLoading={gettingProjectItemAttributes}
                      isDisabled={creatingUpdating}
                      value={projectItemAttributeOptions.filter(option =>
                        formik.values.projectAttributes.includes(option.value)
                      )}
                      onChange={arr => {
                        const temp = arr.map(one => one.value)
                        formik.setFieldValue('projectAttributes', temp)
                      }}
                      onBlur={() => {
                        formik.setFieldTouched('projectAttributes', true)
                      }}
                    />
                    {formik.errors.projectAttributes && formik.touched.projectAttributes && (
                      <div style={{ display: 'block' }} className='invalid-feedback'>
                        {formik.errors.projectAttributes}
                      </div>
                    )}
                  </Grid>
                </Grid>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={closeModal} variant='outlined' color='secondary'>
                    Cancel
                  </Button>
                  <CustomButton type='submit' loading={creatingUpdating} variant='contained' color='primary'>
                    {oneItem ? 'Update' : 'Add New Item'}
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

export default AddNewItem
