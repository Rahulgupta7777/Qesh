import React from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isDanger = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-brown-900/30 backdrop-blur-sm">
      <div
        className="neu-raised-lg rounded-3xl w-full max-w-sm overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-7">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-2xl shrink-0 neu-pressed ${isDanger ? "text-red-600" : "text-brown-700"}`}
            >
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-serif font-bold text-brown-900">
                {title}
              </h3>
              <p className="mt-2 text-sm text-brown-600 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="neu-btn px-5 py-2.5 rounded-full text-sm font-medium text-brown-700"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`neu-btn px-5 py-2.5 rounded-full text-sm font-medium ${isDanger ? "text-red-600" : "text-brown-900"}`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
