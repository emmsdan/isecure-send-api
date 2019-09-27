import { strictEqual } from "assert";
import request from "supertest";

import app from "../src/app";

describe("Routes Test suite", () => {
  it("should Upload file successfully", done => {
    request(app)
      .post("/upload")
      .attach("iss_file", "./test/mock/mock.txt")
      .expect(201)
      .end((err, res) => {
        if (err) {
          console.error("Error:", err);
          return done();
        }

        strictEqual(res.body.message, "Uploaded successfully.");
        strictEqual(res.body.status, "success");
        done();
      });
  });

  it("should not Upload file", done => {
    request(app)
      .post("/upload")
      .attach("iss_file", "")
      .expect(400)
      .end((err, res) => {
        if (err) {
          console.error("Error:", err);
          return done();
        }
        strictEqual(res.body.message, "No files were uploaded.");
        strictEqual(res.body.status, "error");
        done();
      });
  });
});
