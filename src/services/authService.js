import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUrls } from "../constants/api";
import { getRequest, postRequest, putRequestWithFile } from "../helpers/index";
import axios from "axios";

export const authService = {
  login: (options) => {
    return useMutation(
      (payload) => {
        return postRequest(apiUrls.login, payload);
      },
      {
        ...options,
      }
    );
  },
  getProfileSettings: (key, options) => {
    return useQuery(
      [key],
      () => {
        const userData = getRequest(apiUrls.getUserData);

        return userData;
      },
      {
        refetchOnWindowFocus: false,
        retry: false,
        ...options,
      }
    );
  },
  forgotPassword: (options) => {
    return useMutation(
      (payload) => {
        return postRequest(apiUrls.forgotPassword, payload);
      },
      {
        ...options,
      }
    );
  },
  resetPassword: (options) => {
    return useMutation(
      (payload) => {
        return postRequest(apiUrls.resetPassword, payload);
      },
      {
        ...options,
      }
    );
  },
  changePassword: (options) => {
    return useMutation(
      (payload) => {
        return postRequest(apiUrls.changePassword, payload);
      },
      {
        ...options,
      }
    );
  },
  updateProfileSettings: (options) => {
    return useMutation(
      (payload) => {
        return putRequestWithFile(apiUrls.updateProfileSettings, payload);
      },
      {
        ...options,
      }
    );
  },
  me: (key, options) => {
    return useQuery(
      key,
      () => {
        return getRequest(apiUrls.me);
      },
      options
    );
  },
};
