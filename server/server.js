import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";

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

let filePath;

app.get("/chat", async (req, res) => {
  try {
    const resp = await chat(filePath, req.query.question);
    res.send(resp.text);
  } catch (e) {
    res.send(`chat is wrong ${e}`);
  }
});

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    filePath = req.file.path;
    res.send(filePath + "upload sueccesfeully");
  } catch (e) {
    res.send(`uppload error ${e}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// post up to 4 files
// app.post("bulk", upload.array("files", 4), (req, res) => {
//   filePath = req.file.path;
//   res.send(filePath + "upload sueccesfeully");
// });
