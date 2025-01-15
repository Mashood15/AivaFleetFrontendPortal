import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getRequest } from './index'
import { APIBASEURL, apiUrls } from 'src/constants/api'
import { handleLogin, handleLogout } from 'src/redux/authSlice'
import axios from 'axios'
import Spinner from 'src/@core/components/spinner'

function AuthWrapper(props) {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  async function getUserDetails() {
    try {
      const response = await getRequest(apiUrls.getUserData)
      if (response.data.isSuccess === true && response.data.result !== null) {
        const payload = {
          login: true,
          user: response.data.result
        }
        dispatch(handleLogin(payload))
        setLoading(false)
      } else {
        dispatch(handleLogout())
        setLoading(false)
      }
    } catch (error) {
      dispatch(handleLogout())
      setLoading(false)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('token')
      if (token) {
        getUserDetails()
      } else {
        setLoading(false)
        dispatch(handleLogout())
      }
    }
  }, [])

  return <Fragment>{loading || props.routeLoading ? <Spinner /> : props.children}</Fragment>
}

export default AuthWrapper
