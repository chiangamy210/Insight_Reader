import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadMiddleware = upload.array("files", 3);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
// export default async function handler(req, res) {
//   await runMiddleware(req, res, uploadMiddleware);
//   console.log(req.file.buffer);
//   const stream = await cloudinary.uploader.upload_stream(
//     {
//       folder: "demo",
//     },
//     (error, result) => {
//       if (error) return send.error(error);
//       res.status(200).json(result);
//       if (!req.files) {
//         return res.status(400).send("No files uploaded.");
//       }
//       filePaths = req.files.map((file) => file.path);
//       res.send(filePaths);
//     }
//   );
//   streamifier.createReadStream(req.file.buffer).pipe(stream);
// }

export default async function handler(req, res) {
  try {
    await runMiddleware(req, res, uploadMiddleware);
    if (!req.files) {
      return res.status(400).send("No files uploaded.");
    }

    const uploadResults = [];

    for (const file of req.files) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "uploads" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });
      uploadResults.push(uploadResult.secure_url);
    }
    res.status(200).json({ filePaths: uploadResults });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Failed to upload file.");
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
