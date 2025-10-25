import React, { useEffect, useState, useRef } from "react";
import toastService from "../../services/toastService";

// Simple toast component and provider
// Renders toasts at bottom-right. Each toast auto-dismisses after `duration` ms (default 4000).

const Toast = ({ id, type, message, onClose }) => {
  const base = "mb-3 px-4 py-2 rounded shadow-lg max-w-xs break-words";
  const typeStyles =
    type === "success"
      ? "bg-green-500 text-white"
      : type === "error"
      ? "bg-red-500 text-white"
      : "bg-gray-700 text-white";

  return (
    <div className={`${base} ${typeStyles}`} role="status" aria-live="polite">
      <div className="flex justify-between items-start gap-4">
        <div className="text-sm">{message}</div>
        <button
          onClick={() => onClose(id)}
          className="ml-2 text-white opacity-75 hover:opacity-100"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(1);

  useEffect(() => {
    // register show fn
    toastService.setShowFunction(
      ({ type = "info", message = "", duration = 4000 }) => {
        const id = idRef.current++;
        setToasts((t) => [{ id, type, message, duration }, ...t]);
      }
    );

    return () => {
      toastService.setShowFunction(null);
    };
  }, []);

  useEffect(() => {
    // setup auto-dismiss timers
    const timers = toasts.map((t) => {
      if (!t.duration || t.duration <= 0) return null;
      return setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, t.duration);
    });

    return () => {
      timers.forEach((id) => {
        if (id) clearTimeout(id);
      });
    };
  }, [toasts]);

  const handleClose = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <>
      {children}

      {/* Toast container */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-[70] flex flex-col items-end">
        <div className="w-full flex flex-col items-end">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <Toast {...t} onClose={handleClose} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ToastProvider;
