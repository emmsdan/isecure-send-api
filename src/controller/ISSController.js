import uuid from "uuid/v1";

import Database from "../model/Database";
import {
  logger,
  randomString,
  isValidId,
  hasExpired,
  isDownloadable
} from "../utils/utils";
import { RANDOM_STRING_LENGTH } from "../utils/constant";
import FileManager from "../utils/FileManager";

const DB = new Database();
if (!DB.isConnected()) logger(DB.errorMessage());

class ISSController {
  static refreshDB() {
    return DB.refreshDB();
  }

  static async secureFile(req, res) {
    const { body } = req;
    const id = uuid();
    const dbResp = await DB.create("iss_files", {
      fields: ["id", ...Object.keys(body)],
      values: [id, ...Object.values(body)]
    });
    if (dbResp.affectedRows === 0) {
      return false;
    }
    delete body.file_url;
    const url = await ISSController.generateFileURL(id);
    return { url, ...body };
  }

  static async generateFileURL(fileId) {
    const response = await DB.create("iss_file_url", {
      fields: ["file_id"],
      values: [fileId]
    });
    if (response.affectedRows === 0) {
      return false;
    }
    const rndStr = randomString(RANDOM_STRING_LENGTH);
    const rndStr2 = randomString(RANDOM_STRING_LENGTH + 1);
    return `/${rndStr}${response.insertId}${rndStr2}`;
  }

  static async accessFile(req, res) {
    const fileID = isValidId(req.params);
    const [fileData] = await DB.query(
      `SELECT
        iss_files.expires_in, iss_files.downloads_allowed, iss_files.file_url, iss_files.created_at, iss_file_url.downloads, iss_file_url.updated_at
      FROM iss_files
      INNER JOIN iss_file_url
      ON iss_files.id = iss_file_url.file_id
      WHERE iss_files.receiver_email=? AND iss_file_url.id=?;`,
      [req.body.email, fileID]
    );
    if (!hasExpired(fileData) && isDownloadable(fileData)) {
      await DB.query(
        `UPDATE iss_file_url SET downloads = downloads + 1 WHERE id=?`,
        fileID
      );
      return new FileManager().download(res, fileData.file_url, f => {
        console.log(f, "why");
      });
    } else {
      res.json({ message: "URL has expired or is invalid." });
    }
  }
}

export default ISSController;
