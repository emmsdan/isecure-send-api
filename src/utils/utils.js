import fs from "fs";

export const env = (variable, defaultValue = "") => {
  return process.env[variable] || defaultValue;
};

export const logger = (...value) => {
  console.info(value);
};

export const isFileExist = filePath => {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.F_OK, err => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      resolve();
    });
  });
};
