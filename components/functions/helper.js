var global = {};

export const setVehicle = vehicle => {
  global.vehicle = vehicle;
};

export const getVehicle = () => {
  return global;
};
