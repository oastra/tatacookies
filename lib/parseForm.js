// lib/parseForm.js
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export function parseForm(req) {
  const form = formidable({
    multiples: false,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // Allow up to 10MB
  });
  form.on("fileBegin", (name, file) => {
    console.log("📥 File begin:", name, file.originalFilename);
  });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}
