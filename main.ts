import express, { Application } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import router from "./src/routes/routes";

const app: Application = express();

app.use(express.json());
app.use(cors());

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

app.use("/api/v1", router);

app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
});
