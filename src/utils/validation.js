export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.length >= 2 && name.length <= 50;
};

export const validateUserData = (userData) => {
  const errors = {};
  
  if (!validateEmail(userData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!validatePassword(userData.password)) {
    errors.password = 'Password must be at least 6 characters long';
  }
  
  if (!validateName(userData.first_name)) {
    errors.first_name = 'First name must be between 2 and 50 characters';
  }
  
  if (!validateName(userData.last_name)) {
    errors.last_name = 'Last name must be between 2 and 50 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};