var global = {};
export const setVehicle = vehicle => {
  console.log(vehicle);
  global.vehicle = vehicle;
};

export const getVehicle = () => {
  return global;
};

export const setDomain = (url) => {
  global.domain_url = url;
};
export const getDomain = () => {
  return global.domain_url;
};
export const setUserDetail = (url) => {
  global.user = url;
};
export const getUser = () => {
  return global.user;
};

export const setlogUserDetail = (url) => {
  global.logUser = url;
};
export const getlogUser = () => {
  return global.logUser;
};

export const setlogUserDetailFull = (url) => {
  global.logUser = url;
};
export const getlogUserFull = () => {
  return global.logUser;
};