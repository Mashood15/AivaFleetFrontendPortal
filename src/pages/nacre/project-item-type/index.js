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
import { Edit, Add, Search, Trash } from '@mui/icons-material'
import { Icon } from '@iconify/react'
import AddNewProjectItemType from './components/AddNewProjectItemType'
import ReactQueryDataTable from '../../../components/ReactQueryDataTable'
import { apiUrls } from '../../../constants/api'
import { truncateString } from '../../../utility/util'
import { projectItemTypeService } from '../../../services/projectItemTypeService'
import Swal from 'sweetalert2'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { lookupService } from '../../../services/lookupService'
import { useTranslation } from 'react-i18next'
import CustomSelect from '../../../components/CustomSelect'
import toast from 'react-hot-toast'
import SimpleSelect from 'src/components/SimpleSelect'
import CustomTextField from 'src/@core/components/mui/text-field'

function ProjectItemType() {
  const [addNewProjectItemType, setAddNewProjectItemType] = useState(false)
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiData, setApiData] = useState([])
  const [currentDelID, setCurrentDelID] = useState(null)
  const [oneItemType, setOneItemType] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [extraPayload, setExtraPayload] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const queryClient = useQueryClient()
  const user = useSelector(state => state.auth.user)
  const [projectOptions, setProjectOptions] = useState([])
  const [project, setProject] = useState('')
  const { t } = useTranslation()
  const rowOptionsOpen = Boolean(anchorEl)

  // Api call to delete a project block
  const { mutate: deleteProjectBlock, isLoading: deleting } = projectItemTypeService.deleteProjectItemType({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message)
        setCurrentDelID(null)
        queryClient.invalidateQueries('get-project-item-types')
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
      text: `Are you sure you want to delete this item type?`,
      showCancelButton: true,
      confirmButtonColor: '#4e766e',
      cancelButtonColor: '#ea5455'
    }).then(result => {
      if (result.isConfirmed) {
        const payload = { id: id }
        deleteProjectBlock(payload)
      }
    })
  }

  const handleRowOptionsClick = (event, id) => {
    setAnchorEl(event.currentTarget)
    setOneItemType(id)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
    setOneItemType(null)
  }

  const columns = [
    {
      flex: 0.25,
      minWidth: 280,
      field: 'name',
      headerName: t('Name'),
      renderCell: ({ row }) => (
        <Typography noWrap title={row.name}>
          {truncateString(row.name, 30)}
        </Typography>
      )
    },
    {
      flex: 0.25,
      minWidth: 280,
      field: 'projectName',
      headerName: t('Project Name'),
      renderCell: ({ row }) => (
        <Typography noWrap title={row.projectName}>
          {truncateString(row.projectName, 30)}
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
            open={rowOptionsOpen && oneItemType === row.id}
            onClose={handleRowOptionsClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ style: { minWidth: '8rem' } }}
          >
            <MenuItem
              disabled={deleting}
              onClick={() => {
                setOneItemType(row.id)
                setAddNewProjectItemType(true)
                handleRowOptionsClose()
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              <Icon icon='tabler:edit' fontSize={20} />
              Edit
            </MenuItem>
            <MenuItem
              disabled={deleting}
              onClick={() => {
                handleDelete(row.id)
                handleRowOptionsClose()
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              {currentDelID === row.id && deleting ? (
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

  useEffect(() => {
    if (apiData?.length > 0) {
      setTableData(apiData)
    } else {
      setTableData([])
    }
  }, [apiData])

  useEffect(() => {
    const queryParams = []
    if (project !== '') queryParams.push(`&ProjectId=${project}`)
    setExtraPayload(queryParams.join(''))
  }, [project])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <SimpleSelect
                  label='Select Project'
                  placeholder='Select Project'
                  options={projectOptions}
                  value={project}
                  onChange={obj => setProject(obj.value)}
                  loading={gettingProjects}
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
              justifyContent: 'end'
            }}
          >
            <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <CustomTextField
                value={searchText}
                sx={{ mr: 4 }}
                placeholder='Search Item Type'
                onChange={e => setSearchText(e.target.value)}
                // InputProps={{
                //   endAdornment: (
                //     <IconButton onClick={() => setSearchText('')}>
                //       <Search />
                //     </IconButton>
                //   )
                // }}
              />
              <Button
                onClick={() => {
                  setOneItemType(null)
                  setAddNewProjectItemType(true)
                }}
                variant='contained'
                sx={{ '& svg': { mr: 2 } }}
              >
                <Add fontSize='1.125rem' />
                Add New Item Type
              </Button>
            </Box>
          </Box>
          <ReactQueryDataTable
            data={tableData}
            loading={loading}
            columns={columns}
            border={false}
            url={apiUrls.getProjectItemTypes}
            filters={[]}
            items={apiData}
            setItems={setApiData}
            setLoading={setLoading}
            queryKey={'get-project-item-types'}
            isEnable
            searchText={searchText}
            extraPayload={extraPayload}
          />
        </Card>
      </Grid>
      {addNewProjectItemType && (
        <AddNewProjectItemType
          open={addNewProjectItemType}
          statechanger={setAddNewProjectItemType}
          oneItemType={oneItemType}
          setOneItemType={setOneItemType}
        />
      )}
    </Grid>
  )
}

export default ProjectItemType
