import toast from 'react-hot-toast';

/**
 * Toast utility wrapper for react-hot-toast
 * Provides a consistent API similar to the old toast store
 */
export const showToast = {
  success: (message, title) => {
    toast.success(title ? `${title}\n${message}` : message, {
      duration: 3000,
    });
  },

  error: (message, title) => {
    toast.error(title ? `${title}\n${message}` : message, {
      duration: 4000,
    });
  },

  info: (message, title) => {
    toast(title ? `${title}\n${message}` : message, {
      icon: 'ℹ️',
      duration: 3000,
    });
  },

  loading: (message) => {
    return toast.loading(message);
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  promise: (promise, messages) => {
    return toast.promise(promise, messages);
  },
};

// For backwards compatibility with existing code
export const useToast = () => ({
  push: ({ type = 'info', title, message }) => {
    if (type === 'success') {
      showToast.success(message, title);
    } else if (type === 'error') {
      showToast.error(message, title);
    } else {
      showToast.info(message, title);
    }
  },
});

export default showToast;
