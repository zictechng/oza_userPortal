import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Button, Checkbox, Flex, FormControl, FormLabel,
  Heading, Input, InputGroup, InputRightElement,
  Text, useColorModeValue,
} from '@chakra-ui/react';
import DefaultAuth from 'layouts/auth/Default';
import illustration from 'assets/img/auth/auth.png';
import { authUserLogin } from 'storeMtg/authSlice';
import { useAppContext } from 'contexts/AppContext';
import { AuthAlert } from 'components/auth/AuthCard';
import { usePasswordToggle } from 'hooks/usePasswordToggle';
import { useFormValidation } from 'hooks/useFormValidation';

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appName } = useAppContext();
  const { show, ToggleIcon } = usePasswordToggle();
  const { error, setError, clearError, validateEmail, validateRequired } = useFormValidation();

  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.500', 'gray.400');
  const brandColor = 'brand.500';
  const inputBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const { loading, userToken } = useSelector((state) => state.authUser);

  useEffect(() => {
    if (userToken) navigate('/');
  }, [navigate, userToken]);

  const handleSubmit = () => {
    clearError();
    if (!validateEmail(userEmail)) return;
    if (!validateRequired(userPassword, 'Password')) return;

    dispatch(authUserLogin({ username: userEmail, password: userPassword }))
      .then((response) => {
        if (response.payload?.status === 401) {
          setError('Invalid email or password. Please try again.');
        } else if (response.payload?.msg === '200') {
          navigate('/');
        } else {
          setError(response.payload?.message || 'Login failed. Please try again.');
        }
      });
  };

  return (
    <DefaultAuth illustrationBackground={illustration}>
      <Box maxW='400px' w='100%' mx='auto'>
        {/* Heading */}
        <Box mb='32px'>
          <Heading
            color={textColor}
            fontSize={{ base: '28px', md: '32px' }}
            fontWeight='800'
            mb='8px'
            lineHeight='1.2'>
            Welcome back 👋
          </Heading>
          <Text color={textColorSecondary} fontSize='sm' lineHeight='1.6'>
            Sign in to your {appName || 'account'} to continue where you left off
          </Text>
        </Box>

        {/* Error Alert */}
        <AuthAlert message={error} onClose={clearError} />

        {/* Form */}
        <FormControl>
          {/* Email */}
          <FormLabel
            fontSize='sm' fontWeight='600'
            color={textColor} mb='6px'>
            Email Address
          </FormLabel>
          <Input
            type='email'
            placeholder='your@email.com'
            mb='20px'
            size='lg'
            fontSize='sm'
            borderRadius='12px'
            bg={inputBg}
            borderColor={borderColor}
            _hover={{ borderColor: 'brand.500' }}
            _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' }}
            value={userEmail}
            onChange={(e) => { setUserEmail(e.target.value); clearError(); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />

          {/* Password */}
          <FormLabel
            fontSize='sm' fontWeight='600'
            color={textColor} mb='6px'>
            Password
          </FormLabel>
          <InputGroup size='lg' mb='16px'>
            <Input
              type={show ? 'text' : 'password'}
              placeholder='Enter your password'
              fontSize='sm'
              borderRadius='12px'
              bg={inputBg}
              borderColor={borderColor}
              _hover={{ borderColor: 'brand.500' }}
              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' }}
              value={userPassword}
              onChange={(e) => { setUserPassword(e.target.value); clearError(); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <InputRightElement display='flex' alignItems='center' mt='4px'>
              {ToggleIcon}
            </InputRightElement>
          </InputGroup>

          {/* Remember + Forgot */}
          <Flex justifyContent='space-between' align='center' mb='28px'>
            <Flex align='center' gap='8px'>
              <Checkbox colorScheme='brand' id='remember' size='md' />
              <FormLabel
                htmlFor='remember' mb='0'
                fontWeight='500' color={textColorSecondary}
                fontSize='sm' cursor='pointer'>
                Remember me
              </FormLabel>
            </Flex>
            <NavLink to='/auth/forgot-password'>
              <Text
                color={brandColor}
                fontSize='sm'
                fontWeight='600'
                _hover={{ textDecoration: 'underline' }}>
                Forgot password?
              </Text>
            </NavLink>
          </Flex>

          {/* Submit */}
          <Button
            bg='brand.500'
            color='white'
            fontWeight='700'
            w='100%'
            h='52px'
            mb='24px'
            borderRadius='12px'
            fontSize='sm'
            _hover={{
              bg: 'brand.600',
              transform: 'translateY(-1px)',
              shadow: 'lg',
            }}
            _active={{ bg: 'brand.700', transform: 'translateY(0)' }}
            transition='all 0.2s ease'
            isLoading={loading}
            loadingText='Signing in...'
            onClick={handleSubmit}>
            Sign In
          </Button>

          {/* Register link */}
          <Flex justify='center' align='center'>
            <Text color={textColorSecondary} fontSize='sm'>
              Don't have an account?{' '}
              <NavLink to='/auth/sign-up'>
                <Text
                  as='span'
                  color={brandColor}
                  fontWeight='700'
                  _hover={{ textDecoration: 'underline' }}>
                  Create Account
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </FormControl>
      </Box>
    </DefaultAuth>
  );
}

export default SignIn;