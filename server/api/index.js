import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chat from "../chat.js";
import handler from "./upload.js";

const app = express();
app.use(cors());

// app.use(
//   cors({
//     origin: "https://insight-reader-client.vercel.app",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type"],
//   })
// );

dotenv.config();

const port = 5001;

app.post("/upload", handler);

app.get("/chat", async (req, res) => {
  try {
    const question = req.query.question;
    const filePaths = req.query.filePaths ? req.query.filePaths.split(",") : [];
    const result = await chat(question, filePaths);

    res.send(result);
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).send("Error generating content:");
  }
});

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
