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
import AddNewStreet from './components/AddNewStreet'
import ReactQueryDataTable from 'src/components/ReactQueryDataTable'
import { apiUrls } from 'src/constants/api'
import { truncateString } from 'src/utility/util'
import { projectStreetService } from 'src/services/projectStreetService'
import Swal from 'sweetalert2'
import { useQueryClient } from '@tanstack/react-query'
import { lookupService } from 'src/services/lookupService'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import SimpleSelect from 'src/components/SimpleSelect'
import CustomTextField from 'src/@core/components/mui/text-field'

function ProjectStreets() {
  const [addNewStreet, setAddNewStreet] = useState(false)
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiData, setApiData] = useState([])
  const [currentDelID, setCurrentDelID] = useState(null)
  const [oneStreet, setOneStreet] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [extraPayload, setExtraPayload] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const queryClient = useQueryClient()
  const [projectOptions, setProjectOptions] = useState([])
  const [project, setProject] = useState('')
  const [projectBlockOptions, setProjectBlockOptions] = useState([])
  const [projectBlock, setProjectBlock] = useState('')
  const { t } = useTranslation()
  const rowOptionsOpen = Boolean(anchorEl)

  // Api call to delete a project street
  const { mutate: deleteProjectStreet, isLoading: deletingStreet } = projectStreetService.deleteProjectStreet({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message)
        setCurrentDelID(null)
        queryClient.invalidateQueries('get-project-streets')
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
      text: `Are you sure you want to delete this street?`,
      showCancelButton: true,
      confirmButtonColor: '#4e766e',
      cancelButtonColor: '#ea5455'
    }).then(result => {
      if (result.isConfirmed) {
        const payload = { id: id }
        deleteProjectStreet(payload)
      }
    })
  }

  const handleRowOptionsClick = (event, id) => {
    setAnchorEl(event.currentTarget)
    setOneStreet(id)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
    setOneStreet(null)
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
      field: 'projectBlockName',
      headerName: t('Block Name'),
      renderCell: ({ row }) => (
        <Typography noWrap title={row.projectBlockName}>
          {truncateString(row.projectBlockName, 30)}
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
            open={rowOptionsOpen && oneStreet === row.id}
            onClose={handleRowOptionsClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ style: { minWidth: '8rem' } }}
          >
            <MenuItem
              disabled={deletingStreet}
              onClick={() => {
                setOneStreet(row.id)
                setAddNewStreet(true)
                handleRowOptionsClose()
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              <Icon icon='tabler:edit' fontSize={20} />
              Edit
            </MenuItem>
            <MenuItem
              disabled={deletingStreet}
              onClick={() => {
                handleDelete(row.id)
                handleRowOptionsClose()
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              {currentDelID === row.id && deletingStreet ? (
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

  //Api call to get project blocks
  const { isFetching: gettingProjectBlock } = lookupService.getProjectBlocksLookup(
    'get-project-blocks-lookup',
    project,
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

  useEffect(() => {
    if (apiData?.length > 0) {
      setTableData(apiData)
    } else {
      setTableData([])
    }
  }, [apiData])

  useEffect(() => {
    const queryParams = []
    if (projectBlock !== '') {
      queryParams.push(`&ProjectBlockId=${projectBlock}`)
    }
    const queryString = queryParams.join('')
    setExtraPayload(queryString)
  }, [projectBlock])

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
              <Grid item sm={4} xs={12}>
                <SimpleSelect
                  label='Select Project Block'
                  placeholder={project == '' ? 'Select project to get options' : 'Select Project Block'}
                  options={projectBlockOptions}
                  value={projectBlock}
                  onChange={obj => setProjectBlock(obj.value)}
                  loading={gettingProjectBlock}
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
                placeholder='Search Street'
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
                  setOneStreet(null)
                  setAddNewStreet(true)
                }}
                variant='contained'
                sx={{ '& svg': { mr: 2 } }}
              >
                <Add fontSize='1.125rem' />
                Add New Street
              </Button>
            </Box>
          </Box>
          <ReactQueryDataTable
            data={tableData}
            loading={loading}
            columns={columns}
            border={false}
            url={apiUrls.getProjectStreets}
            filters={[]}
            items={apiData}
            setItems={setApiData}
            setLoading={setLoading}
            queryKey={'get-project-streets'}
            isEnable
            searchText={searchText}
            extraPayload={extraPayload}
          />
        </Card>
      </Grid>
      {addNewStreet && (
        <AddNewStreet
          open={addNewStreet}
          statechanger={setAddNewStreet}
          oneStreet={oneStreet}
          setOneStreet={setOneStreet}
        />
      )}
    </Grid>
  )
}

export default ProjectStreets
