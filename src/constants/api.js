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
  //Fob Urls
  getFOBs: "/FOB/GetFOBs",
  createUpdateFOB: "/FOB/CreateUpdateFOB",
  deleteFOB: "/FOB/DeleteFOB",
  getFOB: "/FOB/GetFOB",
  //Fob Urls
  getVehicles: "/Vehicle/GetVehicles",
};
