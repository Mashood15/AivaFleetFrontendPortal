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
    getVehicle: (key, id, options) => {
      return useQuery(
        [key, id],
        () => getRequest(apiUrls.getVehicle + `?id=${id}`),
        {
          ...options,
          retry: false,
          refetchOnWindowFocus: false,
        }
      );
    },
    createUpdateVehicle: (options) => {
      return useMutation(
        (payload) => postRequest(apiUrls.createUpdateVehicle, payload),
        {
          ...options,
        }
      );
    },
    deleteVehicle: (options) => {
      return useMutation(
        (payload) => deleteRequestById(apiUrls.deleteVehicle, payload.id),
        {
          ...options,
        }
      );
    },
  };
  
