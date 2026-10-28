import React, { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Link as LinkIcon, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { processJpgUpload } from "../../lib/imageCompression";

const ImageInputWithUpload = ({
  value = "",
  onChange,
  placeholder = "Paste image URL or upload JPG below",
  className = "",
  maxDimension = 800,
  maxSizeBytes = 2 * 1024 * 1024,
}) => {
  const fileInputRef = useRef(null);
  const [processing, setProcessing] = useState(false);
  const isBase64 = typeof value === "string" && value.startsWith("data:image/");

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input so re-selecting same file triggers change
    event.target.value = "";

    setProcessing(true);
    try {
      const result = await processJpgUpload(file, { maxDimension, maxSizeBytes });
      onChange?.({ target: { value: result.dataUrl } });
      toast.success(`JPG uploaded & compressed to ${result.sizeLabel}!`);
    } catch (err) {
      toast.error(err.message || "Failed to process image.");
    } finally {
      setProcessing(false);
    }
  };

  const handleClear = () => {
    onChange?.({ target: { value: "" } });
  };

  return (
    <div className={`space-y-2.5 min-w-0 ${className}`}>
      {/* Top Input Bar: URL input + Upload Button */}
      <div className="flex gap-2 min-w-0">
        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            value={isBase64 ? "[Uploaded JPG Image]" : value}
            onChange={(e) => {
              if (isBase64) return;
              onChange?.(e);
            }}
            readOnly={isBase64}
            placeholder={placeholder}
            className="w-full min-w-0 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30 sm:px-3.5 sm:py-2.5 sm:text-sm"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-400 transition"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Hidden File Input (Strictly JPG) */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,image/jpeg"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload JPG Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={processing}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-dashed border-cyan-500/50 bg-cyan-500/10 px-2.5 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20 hover:border-cyan-400 active:scale-95 disabled:opacity-50 sm:px-3.5 sm:py-2.5"
          title="Upload a .jpg / .jpeg image (max 2MB, optimized for database storage)"
        >
          <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>{processing ? "Compressing..." : "Upload JPG"}</span>
        </button>
      </div>

      {/* Visual Preview Thumbnail (when image exists) */}
      {value && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-slate-800 bg-slate-950/50 p-2 sm:gap-3 sm:p-2.5 min-w-0 overflow-hidden">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 sm:h-12 sm:w-12">
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>

          <div className="min-w-0 flex-1 space-y-0.5 overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  isBase64
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                    : "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                }`}
              >
                {isBase64 ? (
                  <>
                    <CheckCircle className="h-3 w-3 shrink-0" />
                    <span className="truncate">Uploaded JPG</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-3 w-3 shrink-0" />
                    <span className="truncate">External URL</span>
                  </>
                )}
              </span>
            </div>
            <p className="truncate font-mono text-[11px] text-slate-400 sm:text-xs">
              {isBase64 ? "Storage-optimized in database" : value}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
            title="Clear image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageInputWithUpload;
