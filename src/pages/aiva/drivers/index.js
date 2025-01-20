// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Button, CircularProgress } from '@mui/material'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { deleteUser } from 'src/store/apps/user'

// ** Third Party Components
import Swal from 'sweetalert2'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

// ** Services Imports
import { authService } from 'src/services/authService'
import { userService } from 'src/services/userService'
import { roleService } from 'src/services/roleService'

// ** Custom Table Components Imports
import SimpleSelect from 'src/components/SimpleSelect'
import ReactQueryDataTable from 'src/components/ReactQueryDataTable'
import { apiUrls } from 'src/constants/api'

// ** Constants Imports
import { allEnums } from 'src/constants/enums'

// ** Icons Imports
import { Icon } from '@iconify/react'
import { IoReload } from 'react-icons/io5'
import AddDriverDrawer from './components/AddDriverDrawer'
import toast from 'react-hot-toast'
import { driverService } from 'src/services/driverService'

const renderClient = row => {
  return (
    <CustomAvatar
      skin='light'
      color='primary'
      sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
    >
      {getInitials(row.name ? row.name : 'John Doe')}
    </CustomAvatar>
  )
}

const DriverList = () => {
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [searchText, setSearchText] = useState('')
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiData, setApiData] = useState([])
  const [extraPayload, setExtraPayload] = useState('')
  const [addDriverDrawer, setAddDriverDrawer] = useState(false)
  const [oneDriver, setOneDriver] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const queryClient = useQueryClient()
  const [roleOptions, setRoleOptions] = useState([])
  const [currentDelId, setCurrentDelId] = useState(null)
  const { t } = useTranslation()
  const rowOptionsOpen = Boolean(anchorEl)
  const [pageSize, setPageSize] = useState(10)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  //Api call to delete a user
  const { mutate: deleteDriver, isLoading: deletingDriver } = driverService.deleteDriver({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message)
        setCurrentDelId(null)
        queryClient.invalidateQueries('get-drivers')
      } else {
        toast.error(response.data.message)
        setCurrentDelId(null)
      }
    },
    onError: error => {
      toast.error(error.message)
      setCurrentDelId(null)
    }
  })

  const delDriver = id => {
    Swal.fire({
      icon: 'warning',
      text: `Are you sure you want to delete this driver?`,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: '#ea5455',
      confirmButtonColor: '#4e766e'
    }).then(result => {
      if (result.isConfirmed) {
        const payload = { id: id }
        deleteDriver(payload)
      }
    })
  }

  const columns = [
    {
      flex: 0.25,
      minWidth: 280,
      headerName: 'Name',
      renderCell: ({ row }) => {
        const { firstName, lastName, email } = row
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                component={Link}
                href='/apps/user/view/account'
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {firstName + " " + lastName}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                {email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      field: 'phoneNumber',
      minWidth: 170,
      headerName: 'Phone Number',
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.phoneNumber}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      field: 'licenseNumber',
      minWidth: 170,
      headerName: 'License Number',
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.licenseNumber}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }) => {
        return (
          <CustomChip
            rounded
            skin='light'
            size='small'
            label={row.isActive ? 'Active' : 'Inactive'}
            color={row.isActive ? 'success' : 'warning'}
            sx={{ textTransform: 'capitalize' }}
          />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => {
        return (
          <>
            {/* Delete Button */}
            <IconButton
              size='small'
              onClick={() => {
                setCurrentDelId(row.id)
                delDriver(row.id)
              }}
              disabled={deletingDriver}
            >
              {currentDelId == row.id && deletingDriver ? (
                <CircularProgress size={25} />
              ) : (
                <Icon icon='tabler:trash' fontSize={20} />
              )}
            </IconButton>

            {/* Three Dot Menu */}
            <IconButton size='small' onClick={handleRowOptionsClick}>
              <Icon icon='tabler:dots-vertical' />
            </IconButton>
            <Menu
              keepMounted
              anchorEl={anchorEl}
              open={rowOptionsOpen}
              onClose={handleRowOptionsClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{ style: { minWidth: '8rem' } }}
            >
              <MenuItem
                disabled={deletingDriver}
                onClick={() => {
                  setOneDriver(row.id)
                  setAddDriverDrawer(true)
                  handleRowOptionsClose()
                }}
                sx={{ '& svg': { mr: 2 } }}
              >
                <Icon icon='tabler:edit' fontSize={20} />
                Edit
              </MenuItem>
            </Menu>
          </>
        )
      }
    }
  ]

  useEffect(() => {
    if (apiData?.length > 0) {
      const tempArray = apiData.map(one => ({
        id: one.id,
        firstName: one.firstName,
        lastName: one.lastName,
        email: one.email,
        licenseNumber: one.licenseNumber,
        isActive: one.isActive
      }))
      setTableData(tempArray)
    } else {
      setTableData([])
    }
  }, [apiData])

  useEffect(() => {
    const queryParams = []
    if (status !== '') queryParams.push(`&Status=${status}`)
    setExtraPayload(queryParams.join(''))
  }, [status])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Drivers' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <SimpleSelect
                  label='Select Status'
                  placeholder='Select Status'
                  options={allEnums.StatusOptions}
                  value={status}
                  onChange={obj => setStatus(obj.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <Box
            sx={{
              py: 4,
              px: 6,
              rowGap: 2,
              columnGap: 4,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Grid item>
              <SimpleSelect
                fullWidth={false}
                options={allEnums.PageSizeOptions}
                value={pageSize}
                onChange={obj => setPageSize(obj.value)}
              />
            </Grid>

            <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <CustomTextField
                value={searchText}
                sx={{ mr: 4 }}
                placeholder='Search Driver'
                onChange={e => setSearchText(e.target.value)}
              />

              <Button sx={{ mr: 4 }} color='secondary' variant='tonal' startIcon={<Icon icon='tabler:upload' />}>
                Export
              </Button>
              <Button
                onClick={() => {
                  setOneDriver(null)
                  setAddDriverDrawer(true)
                }}
                variant='contained'
                sx={{ '& svg': { mr: 2 } }}
              >
                <Icon fontSize='1.125rem' icon='tabler:plus' />
                Add New Driver
              </Button>
            </Box>
          </Box>
          <ReactQueryDataTable
            data={tableData}
            loading={loading}
            columns={columns}
            border={false}
            url={apiUrls.getDrivers}
            filters={[]}
            items={apiData}
            setItems={setApiData}
            setLoading={setLoading}
            queryKey='get-drivers'
            isEnable
            searchText={searchText}
            extraPayload={extraPayload}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        </Card>
      </Grid>

      {addDriverDrawer && (
        <AddDriverDrawer open={addDriverDrawer} statechanger={setAddDriverDrawer} oneDriver={oneDriver} setOneDriver={setOneDriver} />
      )}
    </Grid>
  )
}

export default DriverList
