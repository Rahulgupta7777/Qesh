import React from "react";
import { X, AlertTriangle } from "lucide-react"; // Optional icons for better UI

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
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-brown-900/40 backdrop-blur-sm">
      {/* Modal Container */}
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Optional Visual Indicator) */}
        <div
          className={`h-2 w-full ${isDanger ? "bg-red-500" : "bg-brown-900"}`}
        />

        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={`p-3 rounded-full shrink-0 ${isDanger ? "bg-red-50 text-red-600" : "bg-brown-50 text-brown-600"}`}
            >
              <AlertTriangle className="h-6 w-6" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-lg font-serif font-bold text-brown-900">
                {title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors border border-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl active:scale-95
                ${
                  isDanger
                    ? "bg-red-600 hover:bg-red-700 shadow-red-900/20"
                    : "bg-brown-900 hover:bg-brown-800 shadow-brown-900/20"
                }`}
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
