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

export const roleService = {
  getRoles: (
    key,
    id,
    sortBy,
    sortOrder,
    pageNumber,
    pageSize,
    status,
    options
  ) => {
    return useQuery(
      [key, id, sortBy, sortOrder, pageNumber, pageSize, status],
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
        if (status != "") {
          query += `&Status=${status}`;
        }
        return getRequest(
          apiUrls.getRoles + `?SortOrder=${sortOrder}` + query
        );
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  createUpdateRole: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.createUpdateRole, payload)
    },{
      ...options
    })
  },
  deleteRole: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.deleteRole + `?id=${payload.id}`, {})
    },{
      ...options
    })
  },
  activateDeactivateRole: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.activateDeactivateRole + `?id=${payload.id}`, {})
    },{
      ...options
    })
  }
};
