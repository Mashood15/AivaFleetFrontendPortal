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

export const vehicleService = {
    getVehicles: (key, id, sortBy, sortOrder, pageNumber, pageSize, options) => {
      return useQuery(
        [key, id, sortBy, sortOrder, pageNumber, pageSize],
        () => {
          let query = "";
          if (id) query += `&Id=${id}`;
          if (sortBy) query += `&SortBy=${sortBy}`;
          if (pageNumber) query += `&PageNumber=${pageNumber}`;
          if (pageSize) query += `&PageSize=${pageSize}`;
          return getRequest(apiUrls.getVehicles + `?SortOrder=${sortOrder}` + query);
        },
        {
          retry: false,
          refetchOnWindowFocus: false,
          ...options,
        }
      );
    },
    getFob: (key, id, options) => {
      return useQuery(
        [key, id],
        () => getRequest(apiUrls.getFOB + `?id=${id}`),
        {
          ...options,
          retry: false,
          refetchOnWindowFocus: false,
        }
      );
    },
    createUpdateFob: (options) => {
      return useMutation(
        (payload) => postRequest(apiUrls.createUpdateFOB, payload),
        {
          ...options,
        }
      );
    },
    deleteFob: (options) => {
      return useMutation(
        (payload) => deleteRequestById(apiUrls.deleteFOB, payload.id),
        {
          ...options,
        }
      );
    },
  };
  
