// Simple toast service to interact with ToastProvider
// Usage:
// import toast from 'src/services/toastService'
// toast.showSuccess('Saved successfully')
// toast.showError('Failed to save')

let _showFn = null;

const setShowFunction = (fn) => {
  _showFn = fn;
};

const show = (type, message, options = {}) => {
  if (!_showFn) {
    // fallback to console when provider not mounted
    // but still keep behavior predictable
    console[type === "success" ? "log" : "error"](
      `${type.toUpperCase()}: ${message}`
    );
    return;
  }
  _showFn({ type, message, ...options });
};

const showSuccess = (message, options = {}) =>
  show("success", message, options);
const showError = (message, options = {}) => show("error", message, options);

export default {
  setShowFunction,
  showSuccess,
  showError,
};
