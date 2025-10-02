// src/utils/debug.js
export const debugApi = {
  logRequest: (config) => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  },

  logResponse: (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },

  logError: (error) => {
    console.error('API Error:', {
      message: error.message,
      response: error.response,
      config: error.config
    });
    return Promise.reject(error);
  }
};

