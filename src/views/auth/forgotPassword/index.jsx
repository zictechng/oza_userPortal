
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Box, Button, Flex, FormControl, FormLabel,
  Heading, Input, Text, useColorModeValue,
} from '@chakra-ui/react';
import DefaultAuth from 'layouts/auth/Default';
import illustration from 'assets/img/auth/auth.png';
import client from 'components/client';
import { useAppContext } from 'contexts/AppContext';
import { AuthAlert, AuthSuccess } from 'components/auth/AuthCard';
import { useFormValidation } from 'hooks/useFormValidation';

function ForgotPassword() {
  const { appName } = useAppContext();
  const { error, setError, clearError, validateEmail } = useFormValidation();
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.500', 'gray.400');
  const inputBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  const handleSubmit = async () => {
    clearError();
    if (!validateEmail(email)) return;
    setLoading(true);
    try {
      const res = await client.post('/api/forgot_password', { email });
      if (res.data.msg === '200' || res.data.msg === '201') {
        setSuccess(`Password reset instructions sent to ${email}. Please check your inbox.`);
        setSent(true);
      } else {
        setError(res.data.message || 'Email not found. Please check and try again.');
      }
    } catch (e) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultAuth illustrationBackground={illustration}>
      <Box maxW='400px' w='100%' mx='auto'>
        <Box mb='32px'>
          <Heading
            color={textColor}
            fontSize={{ base: '26px', md: '30px' }}
            fontWeight='800'
            mb='8px'
            lineHeight='1.2'>
            Forgot password? 🔐
          </Heading>
          <Text color={textColorSecondary} fontSize='sm' lineHeight='1.6'>
            Enter your {appName || ''} account email and we will send you
            instructions to reset your password.
          </Text>
        </Box>

        <AuthAlert message={error} onClose={clearError} />
        <AuthSuccess message={success} />

        {!sent ? (
          <FormControl>
            <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
              Email Address
            </FormLabel>
            <Input
              type='email'
              placeholder='your@email.com'
              mb='24px'
              size='lg'
              fontSize='sm'
              borderRadius='12px'
              bg={inputBg}
              borderColor={borderColor}
              _hover={{ borderColor: 'brand.500' }}
              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' }}
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError(); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />

            <Button
              bg='brand.500' color='white'
              fontWeight='700' w='100%' h='52px'
              borderRadius='12px' fontSize='sm' mb='16px'
              _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'lg' }}
              _active={{ bg: 'brand.700', transform: 'translateY(0)' }}
              transition='all 0.2s ease'
              isLoading={loading}
              loadingText='Sending...'
              onClick={handleSubmit}>
              Send Reset Instructions
            </Button>
          </FormControl>
        ) : (
          <Button
            variant='outline'
            borderColor='brand.500'
            color='brand.500'
            fontWeight='700'
            w='100%' h='52px'
            borderRadius='12px'
            fontSize='sm'
            mb='16px'
            onClick={() => { setSent(false); setSuccess(''); setEmail(''); }}>
            Send Again
          </Button>
        )}

        <Flex justify='center'>
          <NavLink to='/auth/sign-in'>
            <Text color='brand.500' fontSize='sm' fontWeight='600'
              _hover={{ textDecoration: 'underline' }}>
              ← Back to Sign In
            </Text>
          </NavLink>
        </Flex>
      </Box>
    </DefaultAuth>
  );
}

export default ForgotPassword;