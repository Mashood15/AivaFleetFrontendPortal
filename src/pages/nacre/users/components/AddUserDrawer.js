import { useFormik } from 'formik'
import React, { Fragment, useEffect, useState } from 'react'
import { Button, Drawer, Grid, Typography, IconButton, Box } from '@mui/material'
import * as Yup from 'yup'
import FormikProvider from 'src/context/formik'
import CustomInput from 'src/components/CustomInput'
import CustomButton from 'src/components/CustomButton'
import ModalLoading from 'src/components/ModalLoading'
import { roleService } from 'src/services/roleService'
import Swal from 'sweetalert2'
import { useQueryClient } from '@tanstack/react-query'
import { userService } from 'src/services/userService'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import CustomSelect from 'src/components/CustomSelect'
import toast from 'react-hot-toast'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

function AddUserDrawer({ open, statechanger, oneUser, setOneUser }) {
  const [oneuserData, setOneUserData] = useState(null)
  const queryClient = useQueryClient()
  const [roleOptions, setRoleOptions] = useState([])

  function closeModal() {
    statechanger(false)
    formik.handleReset()
    setOneUser(null)
    setRoleOptions([])
  }

  //Api call to get one user
  const { isFetching: gettingUser } = userService.getUsers('get-one-user', oneUser, '', false, '', '', '', '', '', {
    onSuccess: response => {
      if (response.data.isSuccess) {
        setOneUserData(response.data?.result?.items[0])
      } else {
        setOneUserData(null)
      }
    },
    onError: error => {
      setOneUserData(null)
    },
    enabled: oneUser != null
  })

  //Api call to get all roles
  const { isFetching: gettingRoles } = roleService.getRoles('get-roles', '', '', false, 1, 1000, true, {
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
        setRoleOptions(temp)
      } else {
        setRoleOptions([])
      }
    },
    onError: error => {
      setRoleOptions([])
    }
  })

  //Api call to create update User
  const { mutate: createUpdateUser, isLoading: creatingUpdatingUser } = userService.createUpdateUser({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message)
        queryClient.invalidateQueries('get-users')
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
    fullName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email format').required('Required'),
    roleId: Yup.number().required('Required')
  })

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      roleId: ''
    },
    validationSchema: schema,
    onSubmit: values => {
      let payload = {
        id: oneUser ? oneUser : null,
        name: values.fullName,
        email: values.email,
        roleId: values.roleId === '' ? null : parseInt(values.roleId)
      }
      createUpdateUser(payload)
    }
  })

  useEffect(() => {
    if (oneuserData != null) {
      formik.setValues({
        fullName: oneuserData.name ?? '',
        email: oneuserData.email ?? '',
        roleId: oneuserData.roleId ? oneuserData.roleId : ''
      })
    } else {
      formik.handleReset()
    }
  }, [oneuserData])

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={closeModal}
      PaperProps={{ style: { width: '400px' } }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>{oneUser != null ? 'Update User' : 'Add User'}</Typography>
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
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      {gettingUser ? (
        <ModalLoading />
      ) : (
        <Fragment>
          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
            <FormikProvider formik={{ ...formik, isLoading: creatingUpdatingUser }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CustomInput label='User Name' placeholder='John Doe' name='fullName' requiredField />
                </Grid>

                <Grid item xs={12}>
                  <CustomInput
                    label='Personal Email'
                    placeholder='example@example.com'
                    name='email'
                    requiredField
                    disabled={oneUser != null}
                  />
                  {oneUser != null && (
                    <Typography variant='caption' color='textSecondary'>
                      Email cannot be updated
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <CustomSelect
                    select={true}
                    label='User Role'
                    name='roleId'
                    options={roleOptions}
                    loading={false}
                    requiredField
                  />
                </Grid>
              </Grid>
            </FormikProvider>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button onClick={closeModal} color='secondary' variant='outlined'>
                Cancel
              </Button>
              <CustomButton
                disabled={creatingUpdatingUser}
                loading={creatingUpdatingUser}
                color='primary'
                variant='contained'
                onClick={formik.handleSubmit}
              >
                {oneUser ? 'Update' : 'Add New User'}
              </CustomButton>
            </Box>
          </Box>
        </Fragment>
      )}
    </Drawer>
  )
}

export default AddUserDrawer
