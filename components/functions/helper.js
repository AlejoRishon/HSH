var global = {};

export const setVehicle = vehicle => {
  console.log(vehicle)
  global.vehicle = vehicle;
};

export const getVehicle = () => {
  return global;
};
