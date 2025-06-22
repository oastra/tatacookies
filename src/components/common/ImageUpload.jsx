"use client";

import { useState } from "react";

const ImageUpload = () => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-[16px] px-4 py-6 text-center bg-white shadow-cookie">
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
        />
      </label>
    </div>
  );
};

export default ImageUpload;
