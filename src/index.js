// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "/.env" });

const port = process.env.PORT;

connectDB()
  .then(() => {
    app.on("error:", (error) => {
      console.error("Failed to receive Data:", error);
      throw error;
    });
    app.listen(port || 8000, () => {
      console.log(`Server is running at port: ${port}`);
    });
  })
  .catch((error) => console.error("MongoDB connection failed", error));

/*
import express from "express";
const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.DB_NAME}/${DB_NAME}`);

    app.on("error", (error) => {
      console.log("error:", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`App is listening at port: ${process.env.PORT} `);
    });
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
})();
*/
