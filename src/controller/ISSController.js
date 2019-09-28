import uuid from "uuid/v1";

import Database from "../model/Database";
import { logger, randomString } from "../utils/utils";

const DB = new Database();
if (!DB.isConnected()) logger(DB.errorMessage());

class ISSController {
  static refreshDB() {
    return DB.refreshDB();
  }

  static async secureFile(req, res) {
    const { body } = req;
    // console.error(body);
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
    return `/${randomString(4)}/${response.insertId}${randomString(4)}`;
  }
}

export default ISSController;
