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

export const projectService = {
  getProjects: (
    key,
    id,
    keyword,
    sortBy,
    sortOrder,
    pageNumber,
    pageSize,
    options
  ) => {
    return useQuery(
      [key, id, keyword, sortBy, sortOrder, pageNumber, pageSize],
      () => {
        let query = "";
        if (id != "") {
          query += `&Id=${id}`;
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
          apiUrls.getProjects + `?SortOrder=${sortOrder}` + query
        );
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  createUpdateProject: (options) => {
    return useMutation(
      (payload) => {
        return postRequestWithFile(apiUrls.createUpdateProject, payload);
      },
      {
        ...options,
      }
    );
  },
  deleteProject: (options) => {
    return useMutation(
      (payload) => {
        return deleteRequestByUrl(apiUrls.deleteProject + `?id=${payload.id}`, {});
      },
      {
        ...options,
      }
    );
  },
};
