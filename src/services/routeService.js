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

export const RouteService = {
  getRoutes: (
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
        return getRequest(apiUrls.getRoutes + `?SortOrder=${sortOrder}` + query);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  getRoute: (key, id, options) => {
    return useQuery([key, id], () => {
      return getRequest(apiUrls.getRouteDetails + "?id=" + id)
    }, {
      ...options,
      retry: false,
      refetchOnWindowFocus: false
    })
  },

  createUpdateRoute: (options) => {
    return useMutation(
      (payload) => {
        return postRequest(apiUrls.createUpdateRoute, payload);
      },
      {
        ...options,
      }
    );
  },
  deleteRoute: (options) => {
    return useMutation(
      (payload) => {
        return deleteRequestById(apiUrls.deleteRoute, payload.id);
      },
      {
        ...options,
      }
    );
  },
};
