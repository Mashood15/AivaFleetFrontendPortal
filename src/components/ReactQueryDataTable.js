import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRequestByStringQuery } from '../helpers/index'
import { DataGrid } from '@mui/x-data-grid'
import Pagination from '@mui/material/Pagination'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const ReactQueryDataTable = ({
  columns,
  url,
  setItems,
  loading,
  setLoading,
  data,
  isEnable = false,
  extraPayload,
  queryKey,
  searchText,
  pageSize = 10,
  setPageSize
}) => {
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [additionalPayload, setAdditionalPayload] = useState('')
  const [sortDirection, setSortDirection] = useState(false)
  const [sortColumn, setSortColumn] = useState('')

  const { isFetching: gettingData } = useQuery(
    [queryKey, pageSize, pageNumber, searchText, sortColumn, sortDirection, additionalPayload, extraPayload],
    () => {
      let queryParams = ''

      if (searchText) {
        queryParams += `&Keyword=${searchText}`
      }
      if (extraPayload) {
        queryParams += `${extraPayload}`
      }
      if (additionalPayload) {
        queryParams += `${additionalPayload}`
      }
      if (sortColumn) {
        queryParams += `&SortBy=${sortColumn}`
      }

      return getRequestByStringQuery(
        url,
        `?pageNumber=${pageNumber}&pageSize=${pageSize}&SortOrder=${sortDirection}${queryParams}`
      )
    },
    {
      onSuccess: response => {
        if (response?.data?.isSuccess) {
          const { result } = response?.data
          setTotalPages(result?.paginationInfo?.totalPages)
          setTotalItems(result?.paginationInfo?.totalCount)
          setItems(
            result?.items?.map((el, idx) => ({
              ...el,
              srno: pageNumber === 1 ? idx + 1 : `${idx !== 9 ? `${pageNumber - 1}${idx + 1}` : `${pageNumber}0`}`
            }))
          )
        }
      },
      onError: error => {
        return [null, error]
      },
      retry: false,
      enabled: isEnable,
      refetchOnWindowFocus: false
    }
  )

  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage)
  }

  const handlePageSizeChange = params => {
    setPageSize(params)
    setPageNumber(1) // Reset to the first page when page size changes
  }

  const handleSort = params => {
    if (params.length > 0) {
      setSortDirection(params[0].sort === 'asc')
      setSortColumn(params[0].field)
    }
  }

  return (
    <Box>
      <DataGrid
        autoHeight
        rows={data}
        columns={columns}
        // pageSize={pageSize}
        // pageSizeOptions={[10, 25, 50]}
        rowHeight={62}
        rowCount={totalItems}
        // paginationMode='server'
        // onPageChange={handlePageChange}
        // onPageSizeChange={handlePageSizeChange}
        disableRowSelectionOnClick
        // onSortModelChange={handleSort}
        loading={gettingData || loading}
        hideFooterPagination={true}
        hideFooter={true}
      />

      <Box display='flex' justifyContent='space-between' alignItems='center' padding={5}>
        <Typography fontSize={15} variant='body2'>
          {`Showing ${Math.min((pageNumber - 1) * pageSize + 1, totalItems)} to ${Math.min(
            pageNumber * pageSize,
            totalItems
          )} of ${totalItems} entries`}
        </Typography>

        <Pagination
          color='primary'
          count={totalPages}
          page={pageNumber}
          onChange={handlePageChange}
          shape='rounded'
          siblingCount={1}
          boundaryCount={1}
        />
      </Box>
    </Box>
  )
}

ReactQueryDataTable.defaultProps = {
  filters: []
}

export default ReactQueryDataTable
