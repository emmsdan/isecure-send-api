import express from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

import { logger, env, isFileExist } from "./utils/utils";
import FileManager from "./utils/FileManager";

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

app.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  try {
    fileSystem.zip(req.files.iss_file, async file => {
      const exist = await isFileExist(file.fullPath);
      if (exist) return res.json("sorry we would not upload file");

      return res.json({ message: "Uploaded successfully." });
    });
  } catch (error) {
    res.send(error);
  }
});

app.listen(PORT, () => logger(`Server Started on: http://localhost:${PORT}`));
