import { useState, Fragment } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileText, X, DownloadCloud } from 'react-feather'
import Swal from 'sweetalert2'
import classNames from 'classnames'
import { Box, Button, List, ListItem, Typography, IconButton, CircularProgress } from '@mui/material'

const FileUploaderSingle = ({ formik, disabled, name }) => {
  const [files, setFiles] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.ms-excel': ['.xls', '.xlsx']
    },
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length) {
        Swal.fire({
          icon: 'error',
          text: 'Only png, jpg, jpeg, pdf, doc, docx, xls, or xlsx files are allowed.'
        })
      } else if (acceptedFiles.length === 1) {
        const file = acceptedFiles[0]
        const isFileSizeValid = file.size <= 20 * 1024 * 1024 // 20MB limit

        if (isFileSizeValid) {
          setFiles(Object.assign(file))
          formik.setFieldValue(name, file)
          setErrorMessage('')
        } else {
          setErrorMessage('File size should not exceed 20MB.')
          formik.setFieldValue(name, null)
        }
      } else {
        setErrorMessage('Only one file is allowed.')
        formik.setFieldValue(name, null)
      }
    }
  })

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='28' width='28' />
    } else {
      return <FileText size='28' />
    }
  }

  const handleRemoveFile = () => {
    setFiles(null)
    setErrorMessage('')
    formik.setFieldValue(name, null)
  }

  const renderFileSize = sizeInBytes => {
    if (sizeInBytes < 1024) {
      return sizeInBytes + ' B'
    } else if (sizeInBytes < 1024 * 1024) {
      var sizeInKilobytes = (sizeInBytes / 1024).toFixed(2)
      return sizeInKilobytes + ' KB'
    } else {
      var sizeInMegabytes = (sizeInBytes / (1024 * 1024)).toFixed(2)
      return sizeInMegabytes + ' MB'
    }
  }

  const fileList = files && (
    <ListItem sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ mr: 2 }}>{renderFilePreview(files)}</Box>
        <Box>
          <Typography variant='body2'>{files.name}</Typography>
          <Typography variant='body2' color='textSecondary'>
            {renderFileSize(files.size)}
          </Typography>
        </Box>
      </Box>
      <IconButton size='small' color='error' onClick={handleRemoveFile}>
        <X size={14} />
      </IconButton>
    </ListItem>
  )

  return (
    <Box
      onBlur={() => {
        formik.setFieldTouched(name, true)
      }}
      className={classNames('p-2 border', { 'disabled-div': disabled })}
    >
      <Box {...getRootProps({ className: 'dropzone' })} sx={{ textAlign: 'center' }}>
        <input {...getInputProps()} />
        <DownloadCloud size={64} />
        <Typography variant='h6'>Drop File here or click to upload new file</Typography>
        <Typography variant='body2' color='primary'>
          You can upload file with the extension PNG, JPG, JPEG, DOC, DOCX, XLS, XLSX, and PDF, each not exceeding 20 MB
          in size.
        </Typography>
      </Box>
      {errorMessage ||
        (formik.errors[name] && formik.touched[name] && (
          <Typography variant='body2' color='error' textAlign='center'>
            {formik.errors[name] || errorMessage}
          </Typography>
        ))}
      {files && (
        <Fragment>
          <List>{fileList}</List>
        </Fragment>
      )}
    </Box>
  )
}

FileUploaderSingle.defaultProps = {
  disabled: false
}

export default FileUploaderSingle
