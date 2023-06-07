import express, { Request, Response, Application } from "express";
import "dotenv/config";
import mongoose from "mongoose";
const app: Application = express();
const PORT = process.env.PORT || 8000;

const mongodbString = process.env.CONNECTIONSTRING!;
const password = process.env.PASSWORD!;

const fullConnectionString = mongodbString.replace("<password>", password)!;

mongoose
  .connect(fullConnectionString)
  .then(() => {
    console.log(`DB connection seccesful!`);
  })
  .catch((err) => {
    console.log(`Failed to connect to mongodb`, err);
  });

app.get("/", (req: Request, res: Response): void => {
  res.send("hello typescript with node js");
});

app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
});
