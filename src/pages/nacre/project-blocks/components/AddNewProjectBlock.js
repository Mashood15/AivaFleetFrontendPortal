import { useEffect, useState, Fragment } from 'react'
import { Box, Button, Drawer, Grid, IconButton, TextField, Typography, CircularProgress } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { projectBlockService } from 'src/services/projectBlockService'
import { lookupService } from 'src/services/lookupService'
import { Close } from '@mui/icons-material'
import CustomButton from 'src/components/CustomButton'
import ModalLoading from 'src/components/ModalLoading'
import SimpleSelect from 'src/components/SimpleSelect'
import CustomSelect from 'src/components/CustomSelect'
import CustomInput from 'src/components/CustomInput'
import FormikProvider from 'src/context/formik'
import toast from 'react-hot-toast'

const AddNewProjectBlock = ({ open, statechanger, oneBlock, setOneBlock }) => {
  const [oneBlockData, setOneBlockData] = useState(null)
  const [projectOptions, setProjectOptions] = useState([])
  const queryClient = useQueryClient()

  const closeModal = () => {
    statechanger(false)
    formik.resetForm()
    setOneBlock(null)
  }

  // Api call to get one project
  const { isFetching: gettingProject } = projectBlockService.getProjectBlocks(
    'get-one-project-block',
    oneBlock,
    '',
    '',
    '',
    false,
    1,
    10,
    {
      onSuccess: response => {
        if (response.data.isSuccess) {
          setOneBlockData(response.data?.result?.items[0])
        } else {
          setOneBlockData(null)
        }
      },
      onError: error => {
        setOneBlockData(null)
      },
      enabled: oneBlock != null
    }
  )

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
        id: oneBlock ? oneBlock : null,
        name: values.name,
        projectId: values.projectId
      }
      createUpdateProjectBlock(payload)
    }
  })

  useEffect(() => {
    if (oneBlockData) {
      formik.setValues({
        name: oneBlockData.name,
        projectId: oneBlockData.projectId
      })
    } else {
      formik.resetForm()
    }
  }, [oneBlockData])

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

  const { mutate: createUpdateProjectBlock, isLoading: creatingUpdating } =
    projectBlockService.createUpdateProjectBlock({
      onSuccess: response => {
        if (response.data.isSuccess) {
          toast.success(response.data.message)
          queryClient.invalidateQueries('get-project-blocks')
          closeModal()
        } else {
          toast.error(response.data.message)
        }
      },
      onError: error => {
        toast.error(error.message)
      }
    })

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
        <Typography variant='h5'>{oneBlock ? 'Update Block' : 'Add Block'}</Typography>
        <IconButton onClick={closeModal}>
          <Close />
        </IconButton>
      </Box>
      {gettingProject ? (
        <ModalLoading />
      ) : (
        <Fragment>
          <Box sx={{ p: 6 }}>
            <FormikProvider formik={{ ...formik, isLoading: creatingUpdating }}>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <CustomInput fullWidth label='Block Name' placeholder='Block Name' name='name' requiredField />
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
                    {oneBlock ? 'Update' : 'Add New Block'}
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

export default AddNewProjectBlock
