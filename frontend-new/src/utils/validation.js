// src/utils/validation.js

export const validateName = (name) => {
  if (!name || !name.trim()) {
    return "Name is required";
  }

  if (name.trim().length < 3) {
    return "Name must be at least 3 characters";
  }

  return "";
};

export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    return "Please enter a valid email";
  }

  return "";
};

export const validateMobile = (mobile) => {
  if (!mobile || !mobile.trim()) {
    return "Mobile number is required";
  }

  if (!/^\d+$/.test(mobile)) {
    return "Mobile number must contain digits only";
  }

  if (mobile.length !== 10) {
    return "Mobile number must be exactly 10 digits";
  }

  return "";
};

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return "";
};

export const validateConfirmPassword = (
  password,
  confirmPassword
) => {
  if (!confirmPassword) {
    return "Confirm password is required";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return "";
};