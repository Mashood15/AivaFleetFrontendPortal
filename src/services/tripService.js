import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUrls } from "../constants/api";
import { getRequest, postRequest, deleteRequestById } from "../helpers/index";

export const tripService = {
  getTrips: (key, id, sortBy, sortOrder, pageNumber, pageSize, options) => {
    return useQuery(
      [key, id, sortBy, sortOrder, pageNumber, pageSize],
      () => {
        let query = "";
        if (id) query += `&Id=${id}`;
        if (sortBy) query += `&SortBy=${sortBy}`;
        if (pageNumber) query += `&PageNumber=${pageNumber}`;
        if (pageSize) query += `&PageSize=${pageSize}`;
        return getRequest(apiUrls.getTrips + `?SortOrder=${sortOrder}` + query);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  getTripDetails: (key, id, options) => {
    return useQuery(
      [key, id],
      () => getRequest(apiUrls.getTripDetails + `?id=${id}`),
      {
        ...options,
        retry: false,
        refetchOnWindowFocus: false,
      }
    );
  },
  createUpdateTrip: (options) => {
    return useMutation(
      (payload) => postRequest(apiUrls.createUpdateTrip, payload),
      {
        ...options,
      }
    );
  },
  deleteTrip: (options) => {
    return useMutation(
      (payload) => deleteRequestById(apiUrls.deleteTrip, payload.id),
      {
        ...options,
      }
    );
  },
};