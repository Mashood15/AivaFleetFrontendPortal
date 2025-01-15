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

export const lookupService = {
  getProjectTypesLookup: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getProjectTypesLookup);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  getGenders: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getGenders);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  getProjectsLookup: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getProjectsLookup);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  getProjectItemSizeUnits: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getProjectItemSizeUnits);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  getProjectBlocksLookup: (key, projectId, options) => {
    return useQuery(
      [key, projectId],
      () => {
        return getRequest(
          apiUrls.getProjectBlocksLookup + `?projectId=${projectId}`
        );
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        enabled: projectId != "",
        ...options,
      }
    );
  },
  getProjectStreetsLookup: (key, blockId, options) => {
    return useQuery(
      [key, blockId],
      () => {
        return getRequest(
          apiUrls.getProjectStreetsLookup + `?projectBlockId=${blockId}`
        );
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        enabled: blockId != "",
        ...options,
      }
    );
  },
  getProjectItemTypesLookup: (key, projectId, options) => {
    return useQuery(
      [key, projectId],
      () => {
        return getRequest(
          apiUrls.getProjectItemTypesLookup + `?projectId=${projectId}`
        );
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        enabled: projectId != "",
        ...options,
      }
    );
  },
  getProjectItemCategoriesLookup: (key, projectId, options) => {
    return useQuery(
      [key, projectId],
      () => {
        return getRequest(
          apiUrls.getProjectItemCategoriesLookup + `?projectId=${projectId}`
        );
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        enabled: projectId != "",
        ...options,
      }
    );
  },
  getProjectItemStatusesLookup: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getProjectItemStatusesLookup);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  getProjectItemAttributesLookup: (key, projectId, options) => {
    return useQuery(
      [key, projectId],
      () => {
        return getRequest(
          apiUrls.getProjectItemAttributesLookup + `?projectId=${projectId}`
        );
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        enabled: projectId != "",
        ...options,
      }
    );
  },
  getLeadPlatformsLookup: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getLeadPlatformsLookup);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  getLeadStatusesLookup: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getLeadStatusesLookup);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  getSaleAgentsLookup: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getSaleAgentsLookup);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  getFollowupStatuses: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getFollowupStatuses);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
};
