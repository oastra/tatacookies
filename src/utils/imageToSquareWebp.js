export default async function imageToSquareWebp(
  file,
  { size = 1200, quality = 0.9 } = {}
) {
  if (!file || !file.type?.startsWith("image/")) return file;
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;

  const bitmap = await loadBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - side) / 2;
  const sy = (bitmap.height - side) / 2;
  const target = Math.min(size, side);

  const canvas =
    typeof OffscreenCanvas !== "undefined"
      ? new OffscreenCanvas(target, target)
      : Object.assign(document.createElement("canvas"), {
          width: target,
          height: target,
        });

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, target, target);
  bitmap.close?.();

  const blob = await canvasToBlob(canvas, "image/webp", quality);
  const base = (file.name || "image").replace(/\.[^.]+$/, "");
  return new File([blob], `${base}.webp`, { type: "image/webp" });
}

async function loadBitmap(file) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      // fall through
    }
  }
  const url = URL.createObjectURL(file);
  const img = await new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = url;
  });
  URL.revokeObjectURL(url);
  img.width = img.naturalWidth;
  img.height = img.naturalHeight;
  return img;
}

function canvasToBlob(canvas, type, quality) {
  if (canvas.convertToBlob) {
    return canvas.convertToBlob({ type, quality });
  }
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      type,
      quality
    );
  });
}
