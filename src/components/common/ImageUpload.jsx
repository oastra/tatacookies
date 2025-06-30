// components/common/ImageUpload.jsx
"use client";
import { useState, forwardRef } from "react";

const ImageUpload = forwardRef((props, ref) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-[8px] px-4 py-4 text-center bg-white">
      {fileName ? (
        <p className="text-text mb-2">{fileName}</p>
      ) : (
        <p className="text-text mb-2">Upload an image here or</p>
      )}
      <label className="underline text-primary cursor-pointer">
        Choose here
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          hidden
          name="image"
          ref={ref} // ✅ Forwarded ref goes here
        />
      </label>
    </div>
  );
});

ImageUpload.displayName = "ImageUpload"; // ✅ Required for forwardRef

export default ImageUpload;
