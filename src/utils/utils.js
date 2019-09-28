import fs from "fs";
import { RANDOM_STRING_LENGTH } from "./constant";

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

export const randomString = (max, min = 2) => {
  return Math.random()
    .toString(36)
    .substr(min, max);
};

export const isValidId = ({ fileID }) => {
  const user = Number(
    fileID.substr(
      RANDOM_STRING_LENGTH,
      fileID.length - (RANDOM_STRING_LENGTH * 2 + 1)
    )
  );
  if (typeof user === "number" && !isNaN(user)) {
    return user;
  }
  return false;
};

export const hasExpired = date => {
  const createdAt = new Date(date.created_at).getTime();
  let time = 1;
  if (date.expires_in.endsWith("m")) {
    time = toNumber(date.expires_in, 1) * 60;
  }
  if (date.expires_in.endsWith("h")) {
    time = toNumber(date.expires_in, 1) * 60 * 60;
  }
  if (date.expires_in.endsWith("d")) {
    time = toNumber(date.expires_in, 1) * 60 * 60 * 24;
  }
  const expiresOn = createdAt + time * 1000;

  return !(expiresOn > new Date().getTime());
};

export const isDownloadable = data => {
  const dAllowed = data.downloads_allowed;
  const total = data.downloads;
  return total <= dAllowed;
};

export const toNumber = (string, length = 4) => {
  return Number(string.substr(0, string.length - length));
};
