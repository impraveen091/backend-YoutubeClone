import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Generate unique public ID
const publicId = `shoes_${Date.now()}`;

// Cloudinary Upload Function
const uploadOnCloudinary = async (localFilePath) => {
  try {
    // Upload an image
    const uploadResult = await cloudinary.uploader
      .upload(localFilePath, { resource_type: "auto", public_id: publicId })
      .catch((error) => {
        console.error("Error uploading file to Cloudinary:", error);
        if (fs.existsSync(localFilePath))
          fs.promises.unlink(localFilePath).catch((unlinkError) => {
            console.error("Error deleting file:", unlinkError);
          });
        return null;
      });

    if (!uploadResult) return null;

    console.log("Upload Result:", uploadResult);

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(publicId, {
      fetch_format: "auto",
      quality: "auto",
    });
    console.log("Optimized URL:", optimizeUrl);

    // Transform the image: auto-crop to square aspect ratio
    const autoCropUrl = cloudinary.url(publicId, {
      crop: "auto",
      gravity: "auto",
      width: 500,
      height: 500,
    });
    console.log("Auto-Cropped URL:", autoCropUrl);

    return { uploadResult, optimizeUrl, autoCropUrl };
  } catch (error) {
    console.error("Error in uploadOnCloudinary:", error);
    return null;
  }
};

export { uploadOnCloudinary };
