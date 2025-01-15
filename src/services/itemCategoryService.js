import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUrls } from "../constants/api";
import {
  getRequest,
  postRequestWithFile,
  deleteRequestByUrl,
} from "../helpers/index";

export const itemCategoryService = {
  getItemCategories: (
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
          apiUrls.getItemCategories + `?SortOrder=${sortOrder}` + query
        );
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  createUpdateItemCategory: (options) => {
    return useMutation(
      (payload) => {
        return postRequestWithFile(apiUrls.createUpdateItemCategory, payload);
      },
      {
        ...options,
      }
    );
  },
  deleteItemCategory: (options) => {
    return useMutation(
      (payload) => {
        return deleteRequestByUrl(
          apiUrls.deleteItemCategory + `?id=${payload.id}`,
          {}
        );
      },
      {
        ...options,
      }
    );
  },
};
