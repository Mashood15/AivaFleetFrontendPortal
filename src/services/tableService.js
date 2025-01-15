import { getRequest } from "../helpers/index";

export const tableService = {
  getTableUsers: async (
    url,
    pageNumber,
    pageSize,
    keyword,
    sortColumn,
    sortDirection,
    additionalPayload = '',
    extraPayload = ''
  ) => {
    try {
      const response = await getRequest(
        url +
          `?pageNumber=${pageNumber}&pageSize=${pageSize}&keyword=${keyword}&sortingCol=${sortColumn}&sortDirection=${sortDirection}${additionalPayload}${extraPayload}`
      );
      return [response, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default tableService;
