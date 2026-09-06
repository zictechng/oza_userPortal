import { useState } from 'react';
import IsValidEmail from 'components/EmailValidation';

export const useFormValidation = () => {
  const [error, setError] = useState('');

  const clearError = () => setError('');

  const validateRequired = (value, fieldName) => {
    if (!value || value.trim() === '') {
      setError(`${fieldName} is required`);
      return false;
    }
    return true;
  };

  const validateEmail = (email) => {
    if (!validateRequired(email, 'Email address')) return false;
    if (!IsValidEmail(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validatePassword = (password, minLength = 8) => {
    if (!validateRequired(password, 'Password')) return false;
    if (password.length < minLength) {
      setError(`Password must be at least ${minLength} characters`);
      return false;
    }
    return true;
  };

  const validatePasswordMatch = (password, confirm) => {
    if (!validateRequired(confirm, 'Confirm password')) return false;
    if (password !== confirm) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  return {
    error,
    setError,
    clearError,
    validateRequired,
    validateEmail,
    validatePassword,
    validatePasswordMatch,
  };
};