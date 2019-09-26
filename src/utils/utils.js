export const env = (variable, defaultValue = "") => {
  return process.env[variable] || defaultValue;
};

export const logger = (...value) => {
  console.log(value);
};
