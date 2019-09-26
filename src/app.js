import express from "express";
import "dotenv/config";
import { logger, env } from "./utils/utils";
const app = express();

const PORT = env("PORT", 5900);
app.get("/", (req, res) => {
  res.send("I am EmmsDan");
});
app.listen(PORT, () => logger(`Server Started on: http://localhost:${PORT}`));
