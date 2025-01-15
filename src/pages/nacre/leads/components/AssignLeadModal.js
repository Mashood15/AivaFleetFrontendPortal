import React, { Fragment, useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { leadService } from 'src/services/leadService'
import { lookupService } from 'src/services/lookupService'
import CustomSelect from 'src/components/CustomSelect'
import { Close } from '@mui/icons-material'
import Avatar from '@mui/material/Avatar'
import BlankAvatar from 'public/images/avatars/1.png'
import FormikProvider from 'src/context/formik'
import toast from 'react-hot-toast'

const AssignLeadModal = ({ open, statechanger, oneLead, setOneLead }) => {
  const [oneLeadData, setOneLeadData] = useState(null)
  const [saleAgentsOptions, setSaleAgentsOptions] = useState([])
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

  // Assign lead to user
  const { mutate: assignLeadToUser, isLoading: assigning } = leadService.assignLeadToUser({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message)
        formik.resetForm()
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

  // Api call to get sale agents
  const { isFetching: gettingSaleAgents } = lookupService.getSaleAgentsLookup('get-sale-agents-lookup', {
    onSuccess: response => {
      if (response.data.isSuccess) {
        const temp = response.data.result.items.map(one => ({
          label: one.name,
          value: one.id,
          avatar: BlankAvatar
        }))
        setSaleAgentsOptions(temp)
      } else {
        setSaleAgentsOptions([])
      }
    },
    onError: () => {
      setSaleAgentsOptions([])
    }
  })

  const schema = Yup.object().shape({
    userId: Yup.string().required('Required')
  })

  const formik = useFormik({
    initialValues: {
      userId: ''
    },
    validationSchema: schema,
    onSubmit: () => {}
  })

  const customOption = option => (
    <Box display='flex' alignItems='center'>
      <Avatar src={option.avatar} alt={option.label} />
      <Typography variant='body2' ml={1}>
        {option.label}
      </Typography>
    </Box>
  )

  const confirmationPopup = id => {
    statechanger(false)
    Swal.fire({
      icon: 'info',
      text: `Are you sure you want to assign this lead?`,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: '#ea5455',
      confirmButtonColor: '#4e766e'
    }).then(result => {
      if (result.isConfirmed) {
        const formData = new FormData()
        formData.append('leadId', oneLead)
        const payload = { userId: id, body: formData }
        assignLeadToUser(payload)
      } else {
        formik.setFieldValue('userId', '')
        statechanger(true)
      }
    })
  }

  return (
    <Dialog open={open} onClose={closeModal} fullWidth maxWidth='md'>
      <DialogTitle>
        <Typography variant='h6'>Assign Lead</Typography>
        <IconButton onClick={closeModal} style={{ position: 'absolute', right: 8, top: 8 }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormikProvider formik={{ ...formik, isLoading: assigning }}>
          <Typography variant='subtitle1' align='center'>
            Assign lead to a team member
          </Typography>
          <CustomSelect
            label='Add Members'
            options={saleAgentsOptions}
            loading={gettingSaleAgents}
            components={customOption}
            name='userId'
            customOnChange={value => {
              confirmationPopup(value)
            }}
          />
          <List>
            {[] /* Placeholder for members list */
              .map(item => (
                <ListItem key={item.name}>
                  <ListItemAvatar>
                    <Avatar src={item.img} />
                  </ListItemAvatar>
                  <ListItemText primary={item.name} secondary={item.username} />
                </ListItem>
              ))}
          </List>
        </FormikProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} variant='outlined' color='secondary'>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AssignLeadModal
