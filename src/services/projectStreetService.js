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
  deleteRequestByUrl,
} from "../helpers/index";
import { allEnums } from "../constants/enums";

export const projectStreetService = {
  getProjectStreets: (
    key,
    id,
    projectId,
    keyword,
    sortBy,
    sortOrder,
    pageNumber,
    pageSize,
    options
  ) => {
    return useQuery(
      [key, id, projectId, keyword, sortBy, sortOrder, pageNumber, pageSize],
      () => {
        let query = "";
        if (id != "") {
          query += `&Id=${id}`;
        }
        if (projectId != "") {
          query += `&ProjectId=${projectId}`;
        }
        if (keyword != "") {
          query += `&Keyword=${keyword}`;
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
        return getRequest(
          apiUrls.getProjectStreets + `?SortOrder=${sortOrder}` + query
        );
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  createUpdateProjectStreet: (options) => {
    return useMutation(
      (payload) => {
        return postRequestWithFile(apiUrls.createUpdateProjectStreet, payload);
      },
      {
        ...options,
      }
    );
  },
  deleteProjectStreet: (options) => {
    return useMutation(
      (payload) => {
        return deleteRequestByUrl(
          apiUrls.deleteProjectStreet + `?id=${payload.id}`,
          {}
        );
      },
      {
        ...options,
      }
    );
  },
};
