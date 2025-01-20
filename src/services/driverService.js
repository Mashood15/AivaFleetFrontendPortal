import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUrls } from "../constants/api";
import {
  getRequest,
  postRequest,
  deleteRequestById,
  putRequest,
  postRequestWithFile,
  axiosInstance,
  putRequestWithFile,
} from "../helpers/index";
import { allEnums } from "../constants/enums";

export const driverService = {
  getDrivers: (
    key,
    id,
    sortBy,
    sortOrder,
    pageNumber,
    pageSize,
    role,
    department,
    status,
    options
  ) => {
    return useQuery(
      [
        key,
        id,
        sortBy,
        sortOrder,
        pageNumber,
        pageSize,
      ],
      () => {
        let query = "";
        if (id != "") {
          query += `&Id=${id}`;
        }
        if (sortBy != "") {
          query += `&SortBy=${sortBy}`;
        }
        if (pageNumber != "") {
          query += `&PageNumber=${pageNumber}`;
        }
        if (pageSize != "") {
          query += `&PageSize=${pageSize}`;
        }
        return getRequest(apiUrls.getDrivers + `?SortOrder=${sortOrder}` + query);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  getDriver: (key, id, options) => {
    return useQuery([key, id], () => {
      return getRequest(apiUrls.getDriver + "?id=" + id)
    }, {
      ...options,
      retry: false,
      refetchOnWindowFocus: false
    })
  },

  createUpdateDriver: (options) => {
    return useMutation(
      (payload) => {
        return postRequest(apiUrls.createUpdateDriver, payload);
      },
      {
        ...options,
      }
    );
  },
  deleteDriver: (options) => {
    return useMutation(
      (payload) => {
        return deleteRequestById(apiUrls.deleteDriver, payload.id);
      },
      {
        ...options,
      }
    );
  },
};
