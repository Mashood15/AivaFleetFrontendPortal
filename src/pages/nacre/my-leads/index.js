import React, { Fragment, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import { Add, Search } from '@mui/icons-material'
import { Icon } from '@iconify/react'
import ReactQueryDataTable from 'src/components/ReactQueryDataTable'
import { apiUrls } from 'src/constants/api'
import { truncateString } from 'src/utility/util'
import { leadService } from 'src/services/leadService'
import Swal from 'sweetalert2'
import { useQueryClient } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import SimpleSelect from 'src/components/SimpleSelect'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { setCurrentLeadId } from '../../../redux/lead'
import { allEnums } from '../../../constants/enums'
import LeadFollowup from '../leads/components/LeadFollowup'
import CustomTextField from 'src/@core/components/mui/text-field'

function MyLeadListing() {
  const [addNewLead, setAddNewLead] = useState(false)
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiData, setApiData] = useState([])
  const [currentDelID, setCurrentDelID] = useState(null)
  const [oneLead, setOneLead] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [extraPayload, setExtraPayload] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const queryClient = useQueryClient()
  const [assignLeadModal, setAssignLeadModal] = useState(false)
  const { t } = useTranslation()
  const user = useSelector(state => state.auth.user)
  const [viewType, setViewType] = useState(allEnums.LeadScreenViewType.listingView)
  const dispatch = useDispatch()
  const rowOptionsOpen = Boolean(anchorEl)

  // Api call to delete a lead
  const { mutate: deleteLead, isLoading: deletingLead } = leadService.deleteLead({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message)
        setCurrentDelID(null)
        queryClient.invalidateQueries('get-leads')
      } else {
        toast.error(response.data.message)
      }
    },
    onError: error => {
      toast.error(error.message)
    }
  })

  const handleDelete = id => {
    Swal.fire({
      icon: 'warning',
      text: `Are you sure you want to delete this lead?`,
      showCancelButton: true,
      confirmButtonColor: '#4e766e',
      cancelButtonColor: '#ea5455'
    }).then(result => {
      if (result.isConfirmed) {
        const payload = { id }
        deleteLead(payload)
      }
    })
  }

  const handleRowOptionsClick = (event, id) => {
    setAnchorEl(event.currentTarget)
    setOneLead(id)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const columns = [
    {
      flex: 0.25,
      minWidth: 280,
      field: 'firstName',
      headerName: t('First Name'),
      renderCell: ({ row }) => (
        <div
          onClick={() => {
            dispatch(setCurrentLeadId(row.id))
            setViewType(allEnums.LeadScreenViewType.followUpView)
          }}
        >
          <Typography noWrap title={row.firstName}>
            {truncateString(row.firstName, 30)}
          </Typography>
        </div>
      )
    },
    {
      flex: 0.25,
      minWidth: 280,
      field: 'lastName',
      headerName: t('Last Name'),
      renderCell: ({ row }) => (
        <Typography noWrap title={row.lastName}>
          {truncateString(row.lastName, 30)}
        </Typography>
      )
    },
    {
      flex: 0.25,
      minWidth: 280,
      field: 'email',
      headerName: t('Email'),
      renderCell: ({ row }) => (
        <Typography noWrap title={row.email}>
          {truncateString(row.email, 30)}
        </Typography>
      )
    },
    {
      flex: 0.25,
      minWidth: 280,
      field: 'phoneNumber',
      headerName: t('Phone Number'),
      renderCell: ({ row }) => (
        <Typography noWrap title={row.phoneNumber}>
          {truncateString(row.phoneNumber, 30)}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: t('Actions'),
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton size='small' onClick={e => handleRowOptionsClick(e, row.id)}>
            <Icon icon='tabler:dots-vertical' />
          </IconButton>
          <Menu
            keepMounted
            anchorEl={anchorEl}
            open={rowOptionsOpen && oneLead === row.id}
            onClose={handleRowOptionsClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ style: { minWidth: '8rem' } }}
          >
            <MenuItem
              disabled={deletingLead}
              onClick={() => {
                setOneLead(row.id)
                setAddNewLead(true)
                handleRowOptionsClose()
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              <Icon icon='tabler:edit' fontSize={20} />
              Edit
            </MenuItem>
            <MenuItem
              disabled={deletingLead}
              onClick={() => {
                handleDelete(row.id)
                handleRowOptionsClose()
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              {currentDelID === row.id && deletingLead ? (
                <CircularProgress size={25} />
              ) : (
                <>
                  <Icon icon='tabler:trash' fontSize={20} />
                  Delete
                </>
              )}
            </MenuItem>
          </Menu>
        </Box>
      )
    }
  ]

  useEffect(() => {
    if (apiData?.length > 0) {
      setTableData(apiData)
    } else {
      setTableData([])
    }
  }, [apiData])

  useEffect(() => {
    const queryParams = []
    if (user != null) {
      queryParams.push(`&userId=${user.id}`)
    }
    const queryString = queryParams.join('')
    setExtraPayload(queryString)
  }, [user])

  return (
    <Fragment>
      <AnimatePresence>
        {allEnums.LeadScreenViewType.listingView == viewType ? (
          <Card>
            <CardHeader title={t('My Leads')} />
            <CardContent>
              <Divider sx={{ m: '2rem 0' }} />
              <Box
                sx={{
                  py: 4,
                  px: 6,
                  rowGap: 2,
                  columnGap: 4,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'end'
                }}
              >
                <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                  <CustomTextField
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        setSearchText(e.target.value)
                      }
                    }}
                    sx={{ mr: 4 }}
                    id='search-keyword-input'
                    placeholder='Search Keyword'
                    // InputProps={{
                    //   endAdornment: (
                    //     <IconButton onClick={() => setSearchText('')}>
                    //       <Search />
                    //     </IconButton>
                    //   )
                    // }}
                  />
                </Box>
              </Box>
              <ReactQueryDataTable
                data={tableData}
                loading={loading}
                columns={columns}
                border={false}
                url={apiUrls.getLeads}
                filters={[]}
                items={apiData}
                setItems={setApiData}
                setLoading={setLoading}
                queryKey={'get-leads'}
                isEnable
                searchText={searchText}
                extraPayload={extraPayload}
              />
            </CardContent>
          </Card>
        ) : viewType == allEnums.LeadScreenViewType.followUpView ? (
          <motion.div
            key='lead-follow-up'
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', height: '100%' }}
          >
            <LeadFollowup setViewType={setViewType} />
          </motion.div>
        ) : (
          <></>
        )}
      </AnimatePresence>

      {addNewLead && (
        <AddNewLead open={addNewLead} statechanger={setAddNewLead} oneLead={oneLead} setOneLead={setOneLead} />
      )}
      {assignLeadModal && (
        <AssignLeadModal
          open={assignLeadModal}
          statechanger={setAssignLeadModal}
          oneLead={oneLead}
          setOneLead={setOneLead}
        />
      )}
    </Fragment>
  )
}

export default MyLeadListing
