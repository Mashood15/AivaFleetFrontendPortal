import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUrls } from "../constants/api";
import {
  getRequest,
  postRequestWithFile,
  deleteRequestByUrl,
  postRequest,
} from "../helpers/index";

export const followUpService = {
  getLeadFollowUps: (
    key,
    leadId,
    keyword,
    sortBy,
    sortOrder,
    pageNumber,
    pageSize,
    options
  ) => {
    return useQuery(
      [key, leadId, keyword, sortBy, sortOrder, pageNumber, pageSize],
      () => {
        let query = "";
        if (leadId != "") {
          query += `&LeadId=${leadId}`;
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
          apiUrls.getLeadFollowUps + `?SortOrder=${sortOrder}` + query
        );
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  createUpdateFollowUp: (options) => {
    return useMutation(
      (payload) => {
        return postRequestWithFile(apiUrls.createUpdateFollowUp, payload);
      },
      {
        ...options,
      }
    );
  },
  deleteFollowUp: (options) => {
    return useMutation(
      (payload) => {
        return deleteRequestByUrl(
          apiUrls.deleteFollowUp + `?id=${payload.id}`,
          {}
        );
      },
      {
        ...options,
      }
    );
  },
};
