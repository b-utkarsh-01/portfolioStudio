/**
 * Image compression and validation utility for JPG uploads.
 * Ensures only .jpg/.jpeg files are processed and compresses them onto canvas
 * to protect database storage limits (keeps payload ~30KB - 80KB).
 */

export const MAX_RAW_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB raw file limit
export const MAX_IMAGE_DIMENSION = 800; // max width/height in px
export const JPEG_QUALITY = 0.82; // high quality with small footprint

export const isJpgFile = (file) => {
  if (!file) return false;
  const isJpegMime = file.type === "image/jpeg" || file.type === "image/jpg";
  const hasJpgExt = /\.(jpe?g)$/i.test(file.name || "");
  return isJpegMime || hasJpgExt;
};

export const formatBytes = (bytes, decimals = 1) => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const processJpgUpload = (
  file,
  {
    maxDimension = MAX_IMAGE_DIMENSION,
    quality = JPEG_QUALITY,
    maxSizeBytes = MAX_RAW_FILE_SIZE_BYTES,
  } = {}
) => {
  return new Promise((resolve, reject) => {
    // 1. Strict JPG Check
    if (!isJpgFile(file)) {
      return reject(
        new Error("Only JPG/JPEG images are allowed. Please select a .jpg or .jpeg file.")
      );
    }

    // 2. Strict Raw Size Check
    if (file.size > maxSizeBytes) {
      return reject(
        new Error(
          `Image is too large (${formatBytes(file.size)}). Maximum allowed size is ${formatBytes(
            maxSizeBytes
          )}.`
        )
      );
    }

    // 3. Read file into image element
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read the selected file."));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to decode image data."));
      img.onload = () => {
        try {
          // Calculate downscaled dimensions maintaining aspect ratio
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          // Draw on canvas and export as optimized JPEG
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Canvas context is unavailable."));

          // Fill white background for safety
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

          // Approximate size of base64
          const head = "data:image/jpeg;base64,";
          const base64Length = compressedDataUrl.length - head.length;
          const compressedSizeBytes = Math.round((base64Length * 3) / 4);

          resolve({
            dataUrl: compressedDataUrl,
            width,
            height,
            sizeBytes: compressedSizeBytes,
            sizeLabel: formatBytes(compressedSizeBytes),
          });
        } catch (err) {
          reject(err);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};
