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

export const projectItemTypeService = {
  getProjectItemTypes: (
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
          apiUrls.getProjectItemTypes + `?SortOrder=${sortOrder}` + query
        );
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  createUpdateProjectItemType: (options) => {
    return useMutation(
      (payload) => {
        return postRequestWithFile(
          apiUrls.createUpdateProjectItemType,
          payload
        );
      },
      {
        ...options,
      }
    );
  },
  deleteProjectItemType: (options) => {
    return useMutation(
      (payload) => {
        return deleteRequestByUrl(
          apiUrls.deleteProjectItemType + `?id=${payload.id}`,
          {}
        );
      },
      {
        ...options,
      }
    );
  },
};
