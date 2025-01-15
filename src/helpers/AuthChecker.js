import { useRouter } from 'next/router'
import React, { Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { siteInfo } from 'src/constants'
import { authRoutes } from 'src/constants/authRoutes'

function AuthChecker(props) {
  const login = useSelector(state => state.auth.login)
  const router = useRouter()

  useEffect(() => {
    const isAuthRoute = authRoutes.includes(router.pathname)
    if (login == false && router.pathname != '/login') {
      router.push('/login')
    }
    if (router.pathname == '/') {
      login == true ? router.push(siteInfo.defaultRoute) : '/login'
    }
    if (login && isAuthRoute) {
      router.push(siteInfo.defaultRoute)
    }
  }, [login])

  return <Fragment>{props.children}</Fragment>
}

export default AuthChecker
