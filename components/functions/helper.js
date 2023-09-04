var global = {};
export const setVehicle = vehicle => {
  // console.log(vehicle);
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
