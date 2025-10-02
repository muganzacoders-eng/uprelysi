// Add more specific error handling
export const handleApiError = (error, context) => {
  console.error(`Error in ${context}:`, error);
  
  // Handle specific HTTP status codes
  if (error.response) {
    switch (error.response.status) {
      case 401:
        return {
          message: 'Authentication required. Please log in again.',
          status: 401,
          action: 'redirectToLogin'
        };
      case 403:
        return {
          message: 'You do not have permission to perform this action.',
          status: 403,
          action: 'showWarning'
        };
      case 404:
        return {
          message: 'The requested resource was not found.',
          status: 404,
          action: 'showWarning'
        };
      case 500:
        return {
          message: 'Server error. Please try again later.',
          status: 500,
          action: 'showError'
        };
      default:
        return {
          message: error.response.data.error || 'An error occurred',
          status: error.response.status,
          details: error.response.data.details
        };
    }
  } else if (error.request) {
    return {
      message: 'Network error. Please check your connection.',
      status: null,
      action: 'showError'
    };
  } else {
    return {
      message: error.message || 'An unexpected error occurred',
      status: null,
      action: 'showError'
    };
  }
};