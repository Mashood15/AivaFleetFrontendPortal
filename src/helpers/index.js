import axios from 'axios'
import { APIBASEURL } from '../constants/api'

// async function getAuthToken(){
//     let token;
//     try {
//         token = `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
//     } catch (error) {
//         console.log(error);
//     }
//     return token
// }

export const axiosInstance = axios.create()
//Adding A Request Interceptor
axiosInstance.interceptors.request.use(
  async function (config) {
    if (!config?.url.includes(APIBASEURL)) return config

    const token = window.localStorage.getItem('token')
    config.headers.Authorization = token != null && token != '' ? `Bearer ${token}` : null

    if (config.headers['Content-Type']) {
      // Use the provided Content-Type header if it is set
      config.headers['Content-Type'] = config.headers['Content-Type']
    } else {
      // Use the default Content-Type header
      config.headers['Content-Type'] = 'application/json'
    }

    config.headers['Accept'] = 'application/json'
    config.headers['ApiKey'] = '9x31d53d5463898793579c03d956aeb056701909769275' // Add the ApiKey header here

    return config
  },
  function (err) {
    return Promise.reject(err)
  }
)

//Adding A Response Interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // //
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    response.headers = response?.headers ?? new Headers()
    return response
  },
  function (error) {
    try {
      if (error.response.status === 401) {
        //Logout();
        localStorage.clear()
        window.location.replace('/login')
      }
    } catch (ex) {
      //Logout("apid");
      //   Common.LogError(ex, "Api Call in api.js file", "Intercepter");
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

export async function getRequest(url) {
  return await axiosInstance.get(APIBASEURL + url)
}

export async function getRequestTextPlain(url, payload) {
  return await axiosInstance.post(APIBASEURL + url, payload, {
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}

export async function getRequestById(url, id) {
  return await axiosInstance.get(APIBASEURL + url + '?id=' + id)
}

export async function getRequestByStringQuery(url, stringQuery) {
  return await axiosInstance.get(APIBASEURL + url + stringQuery)
}

export async function getRequestAsArrayBuffer(url) {
  return await axiosInstance.get(APIBASEURL + url, {
    responseType: 'blob'
  })
}

export async function postRequest(url, payload) {
  return await axiosInstance.post(APIBASEURL + url, payload)
}

export async function postRequestWithFile(url, payload) {
  return await axiosInstance.post(APIBASEURL + url, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
      accept: '*/*'
    }
  })
}

export async function putRequest(url, payload) {
  return await axiosInstance.put(APIBASEURL + url, payload)
}

export async function putRequestWithFile(url, payload) {
  return await axiosInstance.put(APIBASEURL + url, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
      accept: '*/*'
    }
  })
}

export async function deleteRequestByUrl(url) {
  return await axiosInstance.delete(APIBASEURL + url)
}

export async function deleteRequestById(url, id) {
  return await axiosInstance.delete(APIBASEURL + url + "?id=" + id)
}
