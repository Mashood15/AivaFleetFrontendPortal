import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
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
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { Edit, Eye, Plus, Search, Trash2 } from 'react-feather'
import Swal from 'sweetalert2'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import ReactQueryDataTable from 'src/components/ReactQueryDataTable'
import AddNewProjectModal from './components/AddNewProjectModal'
import { projectService } from 'src/services/projectService'
import { apiUrls } from 'src/constants/api'
import { Icon } from '@iconify/react'
import toast from 'react-hot-toast'
import { truncateString } from 'src/utility/util'
import CustomTextField from 'src/@core/components/mui/text-field'
import SimpleSelect from 'src/components/SimpleSelect'
import { allEnums } from 'src/constants/enums'

const Projects = () => {
  const [addNewProjectModal, setAddNewProjectModal] = useState(false)
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiData, setApiData] = useState([])
  const [currentDelID, setCurrentDelID] = useState(null)
  const [oneProject, setOneProject] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [status, setStatus] = useState('')
  const [extraPayload, setExtraPayload] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const rowOptionsOpen = Boolean(anchorEl)
  const [pageSize, setPageSize] = useState(10)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  // Api call to delete a project
  const { mutate: deleteProject, isLoading: deletingProject } = projectService.deleteProject({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message)
        setCurrentDelID(null)
        queryClient.invalidateQueries('get-projects')
      } else {
        toast.error(response.data.message)
      }
    },
    onError: error => {
      toast.error(error.message)
    }
  })

  function delProject(id) {
    Swal.fire({
      icon: 'warning',
      text: `Are you sure you want to delete this project?`,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: '#ea5455',
      confirmButtonColor: '#4e766e'
    }).then(result => {
      if (result.isConfirmed) {
        const payload = { id: id }
        deleteProject(payload)
      }
    })
  }

  const columns = [
    {
      flex: 0.25,
      minWidth: 150,
      field: 'name',
      headerName: t('Name'),
      renderCell: ({ row }) => {
        return <div title={row.name}>{truncateString(row.name, 30)}</div>
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'landLine1',
      headerName: t('Landline'),
      renderCell: ({ row }) => {
        return <div title={row.landLine1}>{truncateString(row.landLine1, 30)}</div>
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'contactEmail',
      headerName: t('Contact Email'),
      renderCell: ({ row }) => {
        return <div title={row.contactEmail}>{truncateString(row.contactEmail, 30)}</div>
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'projectTypeName',
      headerName: t('Project Type'),
      renderCell: ({ row }) => {
        return <div title={row.projectTypeName}>{truncateString(row.projectTypeName, 30)}</div>
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'mobile1',
      headerName: t('Mobile'),
      renderCell: ({ row }) => {
        return <div title={row.mobile1}>{truncateString(row.mobile1, 30)}</div>
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'actions',
      headerName: t('Actions'),
      renderCell: ({ row }) => {
        return (
          <>
            {/* Delete Button */}
            <IconButton
              size='small'
              onClick={() => {
                delProject(row.id)
              }}
              disabled={deletingProject}
            >
              {currentDelID == row.id && deletingProject ? (
                <CircularProgress size={25} />
              ) : (
                <Icon icon='tabler:trash' fontSize={20} />
              )}
            </IconButton>

            {/* View Button */}
            <IconButton size='small' onClick={() => handleViewProject(row.id)}>
              <Icon icon='tabler:eye' fontSize={20} />
            </IconButton>

            {/* Three Dot Menu */}
            <IconButton size='small' onClick={handleRowOptionsClick}>
              <Icon icon='tabler:dots-vertical' fontSize={20} />
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
              {/* Edit Option */}
              <MenuItem
                disabled={deletingProject}
                onClick={() => {
                  setOneProject(row.id)
                  setAddNewProjectModal(true)
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
      setTableData(apiData)
    } else {
      setTableData([])
    }
  }, [apiData])

  useEffect(() => {
    const queryParams = []
    if (status !== '') {
      queryParams.push(`&Status=${status}`)
    }
    const queryString = queryParams.join('')
    setExtraPayload(queryString)
  }, [status])

  return (
    <Fragment>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            {/* <CardHeader title='Search Filters' /> */}
            {/* <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <SimpleSelect
                  label='Select Role'
                  options={roleOptions}
                  value={role}
                  onChange={obj => setRole(obj.value)}
                  loading={gettingRoles}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <SimpleSelect
                  label='Select Status'
                  options={allEnums.StatusOptions}
                  value={status}
                  onChange={obj => setStatus(obj.value)}
                />
              </Grid>
            </Grid>
          </CardContent> */}
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
                  placeholder='Search Project'
                  onChange={e => setSearchText(e.target.value)}
                />
                <Button
                  onClick={() => {
                    setOneProject(null)
                    setAddNewProjectModal(true)
                  }}
                  variant='contained'
                  sx={{ '& svg': { mr: 2 } }}
                >
                  <Icon fontSize='1.125rem' icon='tabler:plus' />
                  Add New Project
                </Button>
              </Box>
            </Box>
            <ReactQueryDataTable
              data={tableData}
              loading={loading}
              columns={columns}
              border={false}
              url={apiUrls.getProjects}
              filters={[]}
              items={apiData}
              setItems={setApiData}
              setLoading={setLoading}
              queryKey='get-projects'
              isEnable
              searchText={searchText}
              extraPayload={extraPayload}
              pageSize={pageSize}
              setPageSize={setPageSize}
            />
          </Card>
        </Grid>
      </Grid>
      {addNewProjectModal && (
        <AddNewProjectModal
          open={addNewProjectModal}
          statechanger={setAddNewProjectModal}
          oneProject={oneProject}
          setOneProject={setOneProject}
        />
      )}
    </Fragment>
  )
}

export default Projects
