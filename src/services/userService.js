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

export const userService = {
  getUsers: (
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
        role,
        department,
        status,
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
        if (role != "") {
          query += `&Role=${role}`;
        }
        if (department != "") {
          query += `&Department=${department}`;
        }
        if (status != "") {
          query += `&Status=${status}`;
        }
        return getRequest(apiUrls.getUsers + `?SortOrder=${sortOrder}` + query);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  createUpdateUser: (options) => {
    return useMutation(
      (payload) => {
        return postRequest(apiUrls.createUpdateUser, payload);
      },
      {
        ...options,
      }
    );
  },
  deleteUser: (options) => {
    return useMutation(
      (payload) => {
        return postRequest(apiUrls.deleteUser + `?userId=${payload.id}`, {});
      },
      {
        ...options,
      }
    );
  },
};
