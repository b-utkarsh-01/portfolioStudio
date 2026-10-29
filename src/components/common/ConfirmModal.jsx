import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, AlertCircle, Info, RotateCcw, X, Loader2 } from "lucide-react";

/**
 * Universal Reusable Confirmation Modal using React Portal.
 * Guaranteed to cover 100% of the viewport/entire screen regardless of parent CSS.
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone. Please confirm to proceed.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
  icon: CustomIcon,
  loading = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen || !mounted) return null;

  // Variants styling configuration
  const variantConfig = {
    danger: {
      icon: CustomIcon || AlertCircle,
      iconBg: "bg-rose-500/15 border-rose-500/30 text-rose-400",
      buttonBg: "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30",
    },
    warning: {
      icon: CustomIcon || AlertTriangle,
      iconBg: "bg-amber-500/15 border-amber-500/30 text-amber-400",
      buttonBg: "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30",
    },
    restore: {
      icon: CustomIcon || RotateCcw,
      iconBg: "bg-orange-500/15 border-orange-500/30 text-orange-400",
      buttonBg: "bg-orange-500 hover:bg-orange-400 text-white shadow-orange-900/30",
    },
    info: {
      icon: CustomIcon || Info,
      iconBg: "bg-sky-500/15 border-sky-500/30 text-sky-400",
      buttonBg: "bg-sky-600 hover:bg-sky-500 text-white shadow-sky-900/30",
    },
  };

  const currentVariant = variantConfig[variant] || variantConfig.warning;
  const IconComponent = currentVariant.icon;

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={() => !loading && onClose()}
      role="dialog"
      aria-modal="true"
      style={{ isolation: "isolate" }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-slate-700/80 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl animate-scaleUp text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => !loading && onClose()}
          disabled={loading}
          className="absolute right-4 top-4 rounded-xl border border-slate-800 p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition disabled:opacity-50"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Icon + Title */}
        <div className="flex items-start gap-4 mb-4">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${currentVariant.iconBg}`}
          >
            <IconComponent className="h-6 w-6" />
          </span>

          <div className="min-w-0 pr-6">
            <h3 className="text-lg font-bold text-slate-100 tracking-tight leading-tight">{title}</h3>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">{message}</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto rounded-xl border border-slate-800 bg-slate-800/60 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition shadow-lg active:scale-95 disabled:opacity-60 ${currentVariant.buttonBg}`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmModal;
