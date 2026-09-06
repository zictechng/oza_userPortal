
import React from 'react';
import {
  Alert, AlertDescription, AlertIcon, CloseButton,
} from '@chakra-ui/react';

// Reusable error alert for auth pages
export const AuthAlert = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <Alert
      status='error'
      mb='20px'
      borderRadius='12px'
      fontSize='sm'>
      <AlertIcon />
      <AlertDescription flex='1'>{message}</AlertDescription>
      <CloseButton
        position='absolute'
        right='8px'
        top='8px'
        onClick={onClose}
        size='sm'
      />
    </Alert>
  );
};

// Reusable success alert
export const AuthSuccess = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <Alert
      status='success'
      mb='20px'
      borderRadius='12px'
      fontSize='sm'>
      <AlertIcon />
      <AlertDescription flex='1'>{message}</AlertDescription>
      {onClose && (
        <CloseButton
          position='absolute'
          right='8px'
          top='8px'
          onClick={onClose}
          size='sm'
        />
      )}
    </Alert>
  );
};