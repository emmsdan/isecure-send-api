import path from "path";
import AdmZip from "adm-zip";

class FileManager {
  constructor() {
    this.__filePath = path.join(__dirname, "../storage/secure/");
    this.__uploadPath = path.join(__dirname, "../storage/temp/");
  }

  setFileDir(dir) {
    this.__filePath = dir;
  }

  getFileDir() {
    return this.__filePath;
  }

  generateName(file, user = "anonymous") {
    const extension = path.extname(file);
    const timestamp = new Date().getTime();
    return `./${user} (${timestamp}) emmsdan[iss]${extension}`;
  }

  download(res, filename, callback = () => {}) {
    res.download(path.join(this.__filePath, filename), err => {
      callback(err);
      return res.json({
        error: "Could not download file, due to server error."
      });
    });
  }

  requestObject(request) {
    this.request = request;
    return this;
  }

  async zip(
    callback = file => {
      return file;
    }
  ) {
    let files = this.request.files.iss_file;
    if (!Array.isArray(files)) {
      files = [files];
    }
    const zip = new AdmZip();

    await files.forEach(file => {
      zip.addFile(file.name, Buffer.alloc(file.data.length, file.data));
    });
    await zip.toBuffer();
    const filename = this.generateName("a.zip", this.request.body.sender_name);
    const file = {
      dir: this.__filePath,
      filename,
      fullPath: path.join(this.__filePath, filename)
    };
    zip.writeZip(file.fullPath);
    callback(file);
  }
}

export default FileManager;
