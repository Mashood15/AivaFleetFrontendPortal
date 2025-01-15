import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUrls } from "../constants/api";
import {
  getRequest,
  postRequestWithFile,
  deleteRequestByUrl,
  postRequest,
} from "../helpers/index";

export const leadService = {
  getLeads: (
    key,
    id,
    userId,
    keyword,
    sortBy,
    sortOrder,
    pageNumber,
    pageSize,
    options
  ) => {
    return useQuery(
      [key, id, userId, keyword, sortBy, sortOrder, pageNumber, pageSize],
      () => {
        let query = "";
        if (id != "") {
          query += `&Id=${id}`;
        }
        if (userId != "") {
          query += `&UserId=${userId}`;
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
        return getRequest(apiUrls.getLeads + `?SortOrder=${sortOrder}` + query);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  createUpdateLead: (options) => {
    return useMutation(
      (payload) => {
        return postRequestWithFile(apiUrls.createUpdateLead, payload);
      },
      {
        ...options,
      }
    );
  },
  deleteLead: (options) => {
    return useMutation(
      (payload) => {
        return deleteRequestByUrl(apiUrls.deleteLead + `?id=${payload.id}`, {});
      },
      {
        ...options,
      }
    );
  },
  assignLeadToUser: (options) => {
    return useMutation(
      (payload) => {
        return postRequestWithFile(
          apiUrls.assignLeadToUser + `?userId=${payload.userId}`,
          payload.body
        );
      },
      {
        ...options,
      }
    );
  },
};
