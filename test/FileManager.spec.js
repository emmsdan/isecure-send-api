import assert, { strictEqual } from "assert";
import { describe, it } from "mocha";

import FileManager from "../src/utils/FileManager";
import { responseObject } from "./mock/mockData";

describe("FileManager.js Test Suit", () => {
  let fm;
  beforeEach("before running tests cases", done => {
    fm = new FileManager();
    done();
  });

  it("should Set/Get Upload Path", done => {
    const filePath = "./mock/upload";
    fm.setFileDir(filePath);
    strictEqual(fm.getFileDir(), filePath);
    done();
  });

  it("should Get request object", done => {
    const json = { json: "true" };
    fm.requestObject(json);
    strictEqual(fm.request, json);
    done();
  });

  it("should zip files", done => {
    const json = {
      body: { name: "emmsdan" },
      files: {
        iss_file: {
          name: "0uin.txt",
          data: "c7 7vy8uio yvyubi"
        }
      }
    };
    fm.requestObject(json);
    fm.zip(file => {
      strictEqual(file.dir, fm.getFileDir());
      done();
    });
  });

  it("should download file", async done => {
    const fileName = "somefile.txt";
    fm.download(responseObject, fileName, err => {
      if (!err) {
        assert.deepStrictEqual(undefined, err);
      }
    });

    done();
  });
});
