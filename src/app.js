import express from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

import { logger, env, isFileExist } from "./utils/utils";
import FileManager from "./utils/FileManager";
import validator from "./utils/validator";

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
  res.send("Welcome to iSecure-sharer");
});

app.post("/upload", validator.form, async (req, res) => {
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

      return res.status(201).json({
        message: "Uploaded successfully.",
        status: "success"
      });
    });
  } catch (error) {
    res.send(error);
  }
});

app.listen(PORT, () => logger(`Server Started on: http://localhost:${PORT}`));

export default app;
