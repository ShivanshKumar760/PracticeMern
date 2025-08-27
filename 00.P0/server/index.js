import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/todoPZero";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// mongoose
//   .connect(mongoURI)
//   .then(() => {
//     console.log("Connected to MongoDB");
//     console.log("Starting server...");
//   })
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Server running at http://localhost:${port}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB", err);
//   });

async function connectMongo(mongoURI) {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
}

await connectMongo(mongoURI);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
