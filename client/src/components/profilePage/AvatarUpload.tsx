import React, { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import axios from "axios";
import getCroppedImg from "./imageCropping";


interface AvatarUploaderProps {
  onUpload: (imageUrl: string) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ onUpload }) => {
  const [image, setImage] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);

  const token = localStorage.getItem("token");
  const handleCropComplete = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (): Promise<void> => {
    if (!image || !croppedAreaPixels) return;

    const blob = await getCroppedImg(image, croppedAreaPixels);
    if (!blob) return;

    const formData = new FormData();
    formData.append("image", blob, "avatar.jpg");

    try {
      const res = await axios.post("/api/v1/user/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" ,Authorization: `Bearer ${token}`,},
      });

      onUpload(res.data.imageUrl);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {image && (
        <div className="relative w-[300px] h-[300px] mt-4">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
          />
        </div>
      )}
      <button
        onClick={handleUpload}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload & Save
      </button>
    </div>
  );
};

export default AvatarUploader;
