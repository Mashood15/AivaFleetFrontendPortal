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
import AddNewItemSize from './components/AddNewItemSize'
import ReactQueryDataTable from 'src/components/ReactQueryDataTable'
import { apiUrls } from 'src/constants/api'
import { truncateString } from 'src/utility/util'
import { itemSizeService } from 'src/services/itemSizeService'
import Swal from 'sweetalert2'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { lookupService } from 'src/services/lookupService'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import SimpleSelect from 'src/components/SimpleSelect'
import { Edit, Edit2, Trash } from 'react-feather'

function ItemSize() {
  const [addNewItemSize, setAddNewItemSize] = useState(false)
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiData, setApiData] = useState([])
  const [currentDelID, setCurrentDelID] = useState(null)
  const [oneSize, setOneSize] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [extraPayload, setExtraPayload] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const queryClient = useQueryClient()
  const user = useSelector(state => state.auth.user)
  const [projectOptions, setProjectOptions] = useState([])
  const [project, setProject] = useState('')
  const [projectBlockOptions, setProjectBlockOptions] = useState([])
  const [projectBlock, setProjectBlock] = useState('')
  const [itemSizeUnitOptions, setItemSizeUnitOptions] = useState([])
  const [itemSizeUnit, setItemSizeUnit] = useState('')
  const { t } = useTranslation()
  const rowOptionsOpen = Boolean(anchorEl)

  // Api call to delete a project item size
  const { mutate: deleteItemSize, isLoading: deletingItemSize } = itemSizeService.deleteItemSize({
    onSuccess: response => {
      if (response.data.isSuccess) {
        toast.success(response.data.message)
        setCurrentDelID(null)
        queryClient.invalidateQueries('get-item-sizes')
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
      text: `Are you sure you want to delete this item size?`,
      showCancelButton: true,
      confirmButtonColor: '#4e766e',
      cancelButtonColor: '#ea5455'
    }).then(result => {
      if (result.isConfirmed) {
        const payload = { id: id }
        deleteItemSize(payload)
      }
    })
  }

  const handleRowOptionsClick = (event, id) => {
    setAnchorEl(event.currentTarget)
    setOneSize(id)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
    setOneSize(null)
  }

  const columns = [
    {
      flex: 0.25,
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
      flex: 0.25,
      minWidth: 150,
      field: 'projectBlockName',
      headerName: t('Block Name'),
      renderCell: ({ row }) => (
        <Typography noWrap title={row.projectBlockName}>
          {truncateString(row.projectBlockName, 30)}
        </Typography>
      )
    },
    {
      flex: 0.25,
      minWidth: 150,
      field: 'projectItemSizeUnitName',
      headerName: t('Item Size Unit Name'),
      renderCell: ({ row }) => (
        <Typography noWrap title={row.projectItemSizeUnitName}>
          {truncateString(row.projectItemSizeUnitName, 30)}
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
            open={rowOptionsOpen && oneSize === row.id}
            onClose={handleRowOptionsClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ style: { minWidth: '8rem' } }}
          >
            <MenuItem
              disabled={deletingItemSize}
              onClick={() => {
                setOneSize(row.id)
                setAddNewItemSize(true)
                handleRowOptionsClose()
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              <Edit fontSize='small' />
              Edit
            </MenuItem>
            <MenuItem
              disabled={deletingItemSize}
              onClick={() => {
                handleDelete(row.id)
                handleRowOptionsClose()
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              {currentDelID === row.id && deletingItemSize ? (
                <CircularProgress size={25} />
              ) : (
                <>
                  <Trash fontSize='small' />
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

  //Api call to get project item size units
  const { isFetching: gettingUnits } = lookupService.getProjectItemSizeUnits('get-project-item-size-units', {
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
        setItemSizeUnitOptions(temp)
      } else {
        setItemSizeUnitOptions([])
      }
    },
    onError: error => {
      setItemSizeUnitOptions([])
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
    if (projectBlock !== '') {
      queryParams.push(`&ProjectBlockId=${projectBlock}`)
    }
    if (itemSizeUnit !== '') {
      queryParams.push(`&ProjectItemSizeUnitId=${itemSizeUnit}`)
    }
    const queryString = queryParams.join('')
    setExtraPayload(queryString)
  }, [projectBlock, itemSizeUnit])

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <SimpleSelect
                  options={projectOptions}
                  isLoading={gettingProjects}
                  label='Select Project'
                  placeholder='Select Project'
                  onChange={obj => {
                    if (obj) {
                      setProject(obj.value)
                    } else {
                      setProject('')
                      setProjectBlock('')
                    }
                  }}
                  value={project}
                />
              </Grid>

              <Grid item sm={4} xs={12}>
                <SimpleSelect
                  options={projectBlockOptions}
                  isLoading={gettingProjectBlock}
                  placeholder={project == '' ? 'Select project to get options' : 'Select Project Block'}
                  label='Select Project Block'
                  onChange={obj => {
                    if (obj) {
                      setProjectBlock(obj.value)
                    } else {
                      setProjectBlock('')
                    }
                  }}
                  value={projectBlock}
                />
              </Grid>

              <Grid item sm={4} xs={12}>
                <SimpleSelect
                  label='Select Item Size Unit'
                  options={itemSizeUnitOptions}
                  isLoading={gettingUnits}
                  placeholder='Select Item Size Unit'
                  onChange={obj => {
                    setItemSizeUnit(obj.value)
                  }}
                  value={itemSizeUnit}
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
                placeholder='Search Item Size'
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
                  setOneSize(null)
                  setAddNewItemSize(true)
                }}
                variant='contained'
                sx={{ '& svg': { mr: 2 } }}
              >
                <Add fontSize='1.125rem' />
                Add New Item Size
              </Button>
            </Box>
          </Box>
          <ReactQueryDataTable
            data={tableData}
            loading={loading}
            columns={columns}
            border={false}
            url={apiUrls.getItemSizes}
            filters={[]}
            items={apiData}
            setItems={setApiData}
            setLoading={setLoading}
            queryKey={'get-item-sizes'}
            isEnable
            searchText={searchText}
            extraPayload={extraPayload}
          />
        </Card>
      </Grid>
      {addNewItemSize && (
        <AddNewItemSize
          open={addNewItemSize}
          statechanger={setAddNewItemSize}
          oneSize={oneSize}
          setOneSize={setOneSize}
        />
      )}
    </Grid>
  )
}

export default ItemSize
