import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import chat from "../chat.js";

dotenv.config();

const app = express();
// app.use(cors());

app.use(
  cors({
    origin: "https://insight-reader-client.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

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

// post up to 3 files
let filePaths;
app.post("/upload", upload.array("files", 3), (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).send("No files uploaded.");
    }

    filePaths = req.files.map((file) => file.path);
    res.send(filePaths);
  } catch (e) {
    res.send(`uppload error ${e}`);
  }
});

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

//add delete file API
//TODO fix multer upload file to vercel
