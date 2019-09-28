import express from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

import { logger, env, isFileExist, isValidId } from "./utils/utils";
import FileManager from "./utils/FileManager";
import validator from "./utils/validator";
import ISSController from "./controller/ISSController";

const app = express();
const PORT = env("PORT", 5900);
const fileSystem = new FileManager();

app.use(fileUpload());
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  // fileSystem.download(res);
  res.json("Welcome to iSecure-sharer");
});

app.get("/api/refresh", async (req, res) => {
  ISSController.refreshDB();
  res.json({ message: "Database Tables refresh" });
});

app.post("/api/upload", validator.form, async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(400)
        .json({ message: "No files were uploaded.", status: "error" });
    }
    await fileSystem.requestObject(req).zip(async file => {
      const exist = await isFileExist(file.fullPath);
      if (exist) {
        return res.json("sorry we would not upload file").status(400);
      }
      req.body.file_url = file.filename;
      const fileInfo = await ISSController.secureFile(req, res);
      return res.status(201).json({
        message: "Uploaded successfully.",
        status: "success",
        fileInfo
      });
    });
  } catch (error) {
    res.send(error);
  }
});

app.post("/api/:fileID", async (req, res) => {
  if (isValidId(req.params)) {
    return ISSController.accessFile(req, res);
  } else {
    res.json("help");
  }
});
app.listen(PORT, () => logger(`Server Started on: http://localhost:${PORT}`));

export default app;
