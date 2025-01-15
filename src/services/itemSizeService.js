import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUrls } from "../constants/api";
import {
  getRequest,
  postRequestWithFile,
  deleteRequestByUrl,
} from "../helpers/index";

export const itemSizeService = {
  getItemSizes: (
    key,
    id,
    projectBlockId,
    projectItemSizeUnitId,
    keyword,
    sortBy,
    sortOrder,
    pageNumber,
    pageSize,
    options
  ) => {
    return useQuery(
      [
        key,
        id,
        projectBlockId,
        projectItemSizeUnitId,
        keyword,
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
        if (projectBlockId != "") {
          query += `&ProjectBlockId=${projectBlockId}`;
        }
        if (projectItemSizeUnitId != "") {
          query += `&ProjectItemSizeUnitId=${projectItemSizeUnitId}`;
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
          apiUrls.getItemSizes + `?SortOrder=${sortOrder}` + query
        );
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  createUpdateItemSize: (options) => {
    return useMutation(
      (payload) => {
        return postRequestWithFile(apiUrls.createUpdateItemSize, payload);
      },
      {
        ...options,
      }
    );
  },
  deleteItemSize: (options) => {
    return useMutation(
      (payload) => {
        return deleteRequestByUrl(
          apiUrls.deleteItemSize + `?id=${payload.id}`,
          {}
        );
      },
      {
        ...options,
      }
    );
  },
};
