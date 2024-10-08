import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import chat from "./chat.js";

dotenv.config();

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const port = 5001;

// app.get("/chat", async (req, res) => {
//   try {
//     const resp = await chat(filePath, req.query.question);
//     res.send(resp.text);
//   } catch (e) {
//     res.send(`chat is wrong ${e}`);
//   }
// });

app.get("/chat", async (req, res) => {
  try {
    const result = await chat(req.query.question);
    res.send(result);
  } catch (error) {
    console.error("Error generating content:", error);
  }
});

// post up to 4 files
app.post("/upload", upload.array("files", 4), (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).send("No files uploaded.");
    }

    const filePaths = req.files.map((file) => file.path);
    res.send(filePaths.join(", ") + " upload sueccesfeully");
  } catch (e) {
    res.send(`uppload error ${e}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//for single upload
// app.post("/upload", upload.single("file"), (req, res) => {
//   rea.send(req);
//   try {
//     filePath = req.file.path;
//     res.send(filePath + "upload sueccesfeully");
//   } catch (e) {
//     res.send(`uppload error ${e}`);
//   }
// });
