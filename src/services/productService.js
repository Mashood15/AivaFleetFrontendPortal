import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUrls } from "../constants/api"
import {
  getRequest,
  putRequest,
  postRequestWithFile,
  deleteRequestByUrl,
  putRequestWithFile,
} from "../helpers/index";

export const ProductService = {
  getProducts: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getProductListing({categoryID : 0}));
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  getOneProduct: (key, id, options) => {
    return useQuery(
      [key, id],
      () => {
        return getRequest(apiUrls.getOneProduct(id));
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  addProduct: (options) => {
    return useMutation((payload) => {
      return postRequestWithFile(apiUrls.addProduct, payload);
    }, options);
  },
  updateProduct: (options) => {
    return useMutation((payload) => {
      return putRequestWithFile(apiUrls.updateProduct, payload);
    }, options);
  },
  deleteProduct: (options) => {
    return useMutation((payload) => {
      return deleteRequestByUrl(apiUrls.deleteProduct(payload?.id));
    }, options);
  },
  changeStatus: (options) => {
    return useMutation((payload) => {
      return putRequest(
        apiUrls.changeProductStatus(payload?.id, payload?.status)
      );
    }, options);
  },
};
