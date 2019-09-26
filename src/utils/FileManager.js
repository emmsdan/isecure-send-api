import path from "path";
import AdmZip from "adm-zip";

class FileManager {
  constructor() {
    this.__filePath = path.join(__dirname, "../storage/secure/");
    this.__uploadPath = path.join(__dirname, "../storage/temp/");
  }

  setDir(dir) {
    this.__filePath = dir;
  }

  getDir() {
    return this.__filePath;
  }

  generateName(file, user = "anonymous") {
    const extension = path.extname(file);
    const timestamp = new Date().getTime();
    return `./${user}_${timestamp}_emmsdan-iss${extension}`;
  }

  download(res, filename) {
    res.download(path.join(this.__filePath, filename), err => {
      if (err) {
        return res.json({
          error: "Could not download file, due to server error."
        });
      }
    });
  }

  async zip(files, callback = () => {}) {
    const zip = new AdmZip();

    await files.forEach(file => {
      zip.addFile(file.name, Buffer.alloc(file.data.length, file.data));
    });
    await zip.toBuffer();
    const filename = this.generateName("a.zip");
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
