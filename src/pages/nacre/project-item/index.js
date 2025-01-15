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
import { Edit, Add, Search, Delete } from '@mui/icons-material'
import { Icon } from '@iconify/react'
import AddNewItem from './components/AddNewItem'
import ReactQueryDataTable from '../../../components/ReactQueryDataTable'
import { apiUrls } from '../../../constants/api'
import { truncateString } from '../../../utility/util'
import { projectItemService } from '../../../services/projectItemService'
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

function ProjectItems() {
  const [addNewItem, setAddNewItem] = useState(false)
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiData, setApiData] = useState([])
  const [currentDelID, setCurrentDelID] = useState(null)
  const [oneItem, setOneItem] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [extraPayload, setExtraPayload] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const queryClient = useQueryClient()
  const user = useSelector(state => state.auth.user)
  const [projectOptions, setProjectOptions] = useState([])
  const [project, setProject] = useState('')
  const [projectBlockOptions, setProjectBlockOptions] = useState([])
  const [projectBlock, setProjectBlock] = useState('')
  const [projectStreetOptions, setProjectStreetOptions] = useState([])
  const [projectStreet, setProjectStreet] = useState('')
  const [projectItemTypeOptions, setProjectItemTypeOptions] = useState([])
  const [projectItemType, setProjectItemType] = useState('')
  const [projectItemCategoryOptions, setProjectItemCategoryOptions] = useState([])
  const [projectItemCategory, setProjectItemCategory] = useState('')
  const [projectItemStatusOptions, setProjectItemStatusOptions] = useState([])
  const [projectItemStatus, setProjectItemStatus] = useState('')
  const { t } = useTranslation()
  const rowOptionsOpen = Boolean(anchorEl)

  // Api call to delete a project item
  const { mutate: deleteProjectItem, isLoading: deletingItem } = projectItemService.deleteProjectItem({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message)
        setCurrentDelID(null)
        queryClient.invalidateQueries('get-project-items')
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
      text: `Are you sure you want to delete this item?`,
      showCancelButton: true,
      confirmButtonColor: '#4e766e',
      cancelButtonColor: '#ea5455'
    }).then(result => {
      if (result.isConfirmed) {
        const payload = { id: id }
        deleteProjectItem(payload)
      }
    })
  }

  const handleRowOptionsClick = (event, id) => {
    setAnchorEl(event.currentTarget)
    setOneItem(id)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
    setOneItem(null)
  }

  const columns = [
    {
      flex: 0.15,
      minWidth: 150,
      field: 'name',
      headerName: t('Name'),
      renderCell: ({ row }) => (
        <Typography noWrap title={row.name}>
          {truncateString(row.name, 30)}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'price',
      headerName: t('Price'),
      renderCell: ({ row }) => (
        <Typography noWrap title={row.price}>
          {truncateString(row.price, 30)}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'authorityNumber',
      headerName: t('Authority Number'),
      renderCell: ({ row }) => (
        <Typography noWrap title={row.authorityNumber}>
          {truncateString(row.authorityNumber, 30)}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'projectStreetName',
      headerName: t('Project Street Name'),
      renderCell: ({ row }) => (
        <Typography noWrap title={row.projectStreetName}>
          {truncateString(row.projectStreetName, 30)}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'projectItemTypeName',
      headerName: t('Item Type'),
      renderCell: ({ row }) => (
        <Typography noWrap title={row.projectItemTypeName}>
          {truncateString(row.projectItemTypeName, 30)}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'projectItemCategoryName',
      headerName: t('Category'),
      renderCell: ({ row }) => (
        <Typography noWrap title={row.projectItemCategoryName}>
          {truncateString(row.projectItemCategoryName, 30)}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'projectItemStatusName',
      headerName: t('Status'),
      renderCell: ({ row }) => (
        <Typography noWrap title={row.projectItemStatusName}>
          {truncateString(row.projectItemStatusName, 30)}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 100,
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
            open={rowOptionsOpen && oneItem === row.id}
            onClose={handleRowOptionsClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ style: { minWidth: '8rem' } }}
          >
            <MenuItem
              disabled={deletingItem}
              onClick={() => {
                setOneItem(row.id)
                setAddNewItem(true)
                handleRowOptionsClose()
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              <Icon icon='tabler:edit' fontSize={20} />
              Edit
            </MenuItem>
            <MenuItem
              disabled={deletingItem}
              onClick={() => {
                handleDelete(row.id)
                handleRowOptionsClose()
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              {currentDelID === row.id && deletingItem ? (
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

  //Api call to get project streets
  const { isFetching: gettingProjectStreets } = lookupService.getProjectStreetsLookup(
    'get-project-streets-lookup',
    projectBlock,
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

  useEffect(() => {
    const queryParams = []
    if (projectStreet !== '') {
      queryParams.push(`&ProjectStreetId=${projectStreet}`)
    }
    if (projectItemType !== '') {
      queryParams.push(`&ProjectItemTypeId=${projectItemType}`)
    }
    if (projectItemCategory !== '') {
      queryParams.push(`&ProjectItemCategoryId=${projectItemCategory}`)
    }
    if (projectItemStatus !== '') {
      queryParams.push(`&ProjectItemStatusId=${projectItemStatus}`)
    }
    const queryString = queryParams.join('')
    setExtraPayload(queryString)
  }, [projectStreet, projectItemType, projectItemCategory, projectItemStatus])

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
              <Grid item sm={4} xs={12}>
                <SimpleSelect
                  label='Select Block Street'
                  placeholder={project == '' ? 'Select project block to get options' : 'Select Block Street'}
                  options={projectStreetOptions}
                  value={projectStreet}
                  onChange={obj => setProjectStreet(obj.value)}
                  loading={gettingProjectStreets}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <SimpleSelect
                  label='Select Item Type'
                  placeholder={project == '' ? 'Select project to get options' : 'Select Item Type'}
                  options={projectItemTypeOptions}
                  value={projectItemType}
                  onChange={obj => setProjectItemType(obj.value)}
                  loading={gettingProjectItemTypes}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <SimpleSelect
                  label='Select Item Category'
                  placeholder={project == '' ? 'Select project to get options' : 'Select Item Type'}
                  options={projectItemCategoryOptions}
                  value={projectItemCategory}
                  onChange={obj => setProjectItemCategory(obj.value)}
                  loading={gettingProjectItemCategories}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <SimpleSelect
                  label='Select Item Status'
                  placeholder='Select Item Status'
                  options={projectItemStatusOptions}
                  value={projectItemStatus}
                  onChange={obj => setProjectItemStatus(obj.value)}
                  loading={gettingProjectItemStatues}
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
                placeholder='Search Item'
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
                  setOneItem(null)
                  setAddNewItem(true)
                }}
                variant='contained'
                sx={{ '& svg': { mr: 2 } }}
              >
                <Add fontSize='1.125rem' />
                Add New Item
              </Button>
            </Box>
          </Box>
          <ReactQueryDataTable
            data={tableData}
            loading={loading}
            columns={columns}
            border={false}
            url={apiUrls.getProjectItems}
            filters={[]}
            items={apiData}
            setItems={setApiData}
            setLoading={setLoading}
            queryKey={'get-project-items'}
            isEnable
            searchText={searchText}
            extraPayload={extraPayload}
          />
        </Card>
      </Grid>
      {addNewItem && (
        <AddNewItem open={addNewItem} statechanger={setAddNewItem} oneItem={oneItem} setOneItem={setOneItem} />
      )}
    </Grid>
  )
}

export default ProjectItems
