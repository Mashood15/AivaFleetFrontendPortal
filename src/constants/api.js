export const APIBASEURL = "https://aivafleet-api-g3drfwe6fyb8auh7.canadacentral-01.azurewebsites.net/api";

export const apiUrls = {
  //Auth Urls
  login: "/Account/Authenticate",
  getUserData: "/Account/GetProfileSettings",
  getUserDetails: "/Account/GetUserDetails",
  updateProfileSettings: "/Account/UpdateProfileSettings",
  changePassword: "/Account/ChangePassword",
  forgotPassword: "/Account/ForgotPassword",
  resetPassword: "/Account/ResetPassword",
  //Role Urls
  getRoles: "/Role/GetRoles",
  createUpdateRole: "/Role/CreateRole",
  deleteRole: "/Role/DeleteRole",
  activateDeactivateRole: "/Role/ActivateDeactivateRole",
  //User Urls
  getUsers: "/Account/GetUsers",
  createUpdateUser: "/Account/CreateUpdateUser",
  deleteUser: "/Account/DeleteUser",
  //Driver Urls
  getDrivers: "/Driver/GetDrivers",
  createUpdateDriver: "/Driver/CreateUpdateDriver",
  deleteDriver: "/Driver/DeleteDriver",
  getDriver: "/Driver/GetDriver",
  //Project Urls
  getProjects: "/Project/GetProjects",
  createUpdateProject: "/Project/CreateUpdateProject",
  deleteProject: "/Project/DeleteProject",
  //Project Block Urls
  getProjectBlocks: "/ProjectBlock/GetProjectBlocks",
  createUpdateProjectBlock: "/ProjectBlock/CreateUpdateProjectBlock",
  deleteProjectBlock: "/ProjectBlock/DeleteProjectBlock",
  // Item Category URLs
  getItemCategories: "/ProjectItemCategory/GetProjectItemCategories",
  createUpdateItemCategory:
    "/ProjectItemCategory/CreateUpdateProjectItemCategory",
  deleteItemCategory: "/ProjectItemCategory/DeleteProjectItemCategory",
  // Item Size URLs
  getItemSizes: "/ProjectItemSize/GetProjectItemSizes",
  createUpdateItemSize: "/ProjectItemSize/CreateUpdateProjectItemSize",
  deleteItemSize: "/ProjectItemSize/DeleteProjectItemSize",
  //Project Item Type Urls
  getProjectItemTypes: "/ProjectItemType/GetProjectItemTypes",
  createUpdateProjectItemType: "/ProjectItemType/CreateUpdateProjectItemType",
  deleteProjectItemType: "/ProjectItemType/DeleteProjectItemType",
  // Project Street URLs
  getProjectStreets: "/ProjectStreet/GetProjectStreets",
  createUpdateProjectStreet: "/ProjectStreet/CreateUpdateProjectStreet",
  deleteProjectStreet: "/ProjectStreet/DeleteProjectStreet",
  // Project Item URLs
  getProjectItems: "/ProjectItem/GetProjectItems",
  createUpdateProjectItem: "/ProjectItem/CreateUpdateProjectItem",
  deleteProjectItem: "/ProjectItem/DeleteProjectItem",
  //Lookup Urls
  getProjectTypesLookup: "/Lookup/GetProjectTypes",
  getGenders: "/Lookup/GetGenders",
  getProjectsLookup: "/Lookup/GetProjects",
  getProjectItemSizeUnits: "/Lookup/GetProjectItemSizeUnits",
  getProjectBlocksLookup: "/Lookup/GetProjectBlocks",
  getProjectStreetsLookup: "/Lookup/GetProjectStreets",
  getProjectItemTypesLookup: "/Lookup/GetProjectItemTypes",
  getProjectItemCategoriesLookup: "/Lookup/GetProjectItemCategories",
  getProjectItemStatusesLookup: "/Lookup/GetProjectItemStatuses",
  getProjectItemAttributesLookup: "/Lookup/GetProjectItemAttributes",
  getLeadPlatformsLookup: "/Lookup/GetLeadPlatforms",
  getLeadStatusesLookup: "/Lookup/GetLeadStatuses",
  getSaleAgentsLookup: "/Lookup/GetSaleAgents",
  getFollowupStatuses: "/Lookup/getFollowUpStatuses",
  // Lead URLs
  getLeads: "/Lead/GetLeads",
  createUpdateLead: "/Lead/CreateUpdateLead",
  deleteLead: "/Lead/DeleteLead",
  assignLeadToUser: "/Lead/AssignLeadToUser",
  // Follow Up URLs
  getLeadFollowUps: "/FollowUp/getLeadFollowUps",
  createUpdateFollowUp: "/FollowUp/CreateUpdateFollowUp",
  deleteFollowUp: "/FollowUp/DeleteFollowUp",
};
