import { useState, useEffect } from 'react'
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
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomChip from 'src/@core/components/mui/chip'
import SimpleSelect from 'src/components/SimpleSelect'
import ReactQueryDataTable from 'src/components/ReactQueryDataTable'

// ** Third-Party Components
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'
import { Icon } from '@iconify/react'

// ** Services & Constants
import { tripService } from 'src/services/tripService'
import { apiUrls } from 'src/constants/api'
import { allEnums } from 'src/constants/enums'

// ** Drawer for Adding/Editing Trips
import AddTripDrawer from './components/AddTripDrawer'

const TripList = () => {
  const [status, setStatus] = useState('')
  const [searchText, setSearchText] = useState('')
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiData, setApiData] = useState([])
  const [extraPayload, setExtraPayload] = useState('')
  const [addTripDrawer, setAddTripDrawer] = useState(false)
  const [oneTrip, setOneTrip] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentDelId, setCurrentDelId] = useState(null)
  const queryClient = useQueryClient()
  const rowOptionsOpen = Boolean(anchorEl)
  const [pageSize, setPageSize] = useState(10)

  const { mutate: deleteTrip, isLoading: deletingTrip } = tripService.deleteTrip({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message)
        setCurrentDelId(null)
        queryClient.invalidateQueries('get-trips')
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

  const delTrip = id => {
    Swal.fire({
      icon: 'warning',
      text: 'Are you sure you want to delete this trip?',
      showCancelButton: true,
      confirmButtonColor: '#4e766e',
      cancelButtonColor: '#ea5455'
    }).then(result => {
      if (result.isConfirmed) {
        deleteTrip({ id })
      }
    })
  }

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const columns = [
    {
      flex: 0.2,
      minWidth: 150,
      headerName: 'Vehicle',
      field: 'vehicleRegistrationNumber'
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: 'Route',
      field: 'routeName'
    },
    {
      flex: 0.2,
      minWidth: 200,
      headerName: 'Start Time',
      field: 'startTime'
    },
    {
      flex: 0.2,
      minWidth: 200,
      headerName: 'End Time',
      field: 'endTime'
    },
    {
      flex: 0.1,
      minWidth: 150,
      headerName: 'Status',
      field: 'status',
      renderCell: ({ row }) => (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={row.status}
          color={row.status === 'Active' ? 'success' : 'warning'}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    },
    {
      flex: 0.1,
      minWidth: 120,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <>
          {/* Delete Button */}
          <IconButton
            size='small'
            onClick={() => {
              setCurrentDelId(row.id)
              delTrip(row.id)
            }}
            disabled={deletingTrip}
          >
            {currentDelId === row.id && deletingTrip ? (
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
              disabled={deletingTrip}
              onClick={() => {
                setOneTrip(row.id)
                setAddTripDrawer(true)
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
  ]

  useEffect(() => {
    if (apiData?.length > 0) {
      const tempArray = apiData.map(one => ({
        id: one.id,
        vehicleRegistrationNumber: one.vehicleRegistrationNumber,
        vehicleId: one.vehicleId,
        routeId: one.routeId,
        routeName: one.routeName,
        startTime: one.startTime,
        endTime: one.endTime,
        status: one.status
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
          <CardHeader title='Trips' />
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
                placeholder='Search Trip'
                onChange={e => setSearchText(e.target.value)}
              />

              <Button sx={{ mr: 4 }} color='secondary' variant='tonal' startIcon={<Icon icon='tabler:upload' />}>
                Export
              </Button>
              <Button
                onClick={() => {
                  setOneTrip(null)
                  setAddTripDrawer(true)
                }}
                variant='contained'
                sx={{ '& svg': { mr: 2 } }}
              >
                <Icon fontSize='1.125rem' icon='tabler:plus' />
                Add New Trip
              </Button>
            </Box>
          </Box>

          <ReactQueryDataTable
            data={tableData}
            loading={loading}
            columns={columns}
            border={false}
            url={apiUrls.getTrips}
            filters={[]}
            items={apiData}
            setItems={setApiData}
            setLoading={setLoading}
            queryKey='get-trips'
            isEnable
            searchText={searchText}
            extraPayload={extraPayload}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        </Card>
      </Grid>
      {addTripDrawer && (
        <AddTripDrawer open={addTripDrawer} statechanger={setAddTripDrawer} oneTrip={oneTrip} setOneTrip={setOneTrip} />
      )}
    </Grid>
  )
}

export default TripList