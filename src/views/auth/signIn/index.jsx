import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Button, Checkbox, Flex, FormControl, FormLabel,
  Heading, Icon, Input, InputGroup, InputRightElement,
  Text, useColorModeValue, Spinner, Alert, AlertIcon,
  AlertDescription, CloseButton,
} from '@chakra-ui/react';
import DefaultAuth from 'layouts/auth/Default';
import illustration from 'assets/img/auth/auth.png';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import IsValidEmail from 'components/EmailValidation';
import { authUserLogin } from 'storeMtg/authSlice';
import { useAppContext } from 'contexts/AppContext';

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appName } = useAppContext();

  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const brandColor = useColorModeValue('brand.500', 'white');

  const [show, setShow] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errors, setErrors] = useState(false);
  const [errorMessages, setErrorMessages] = useState('');

  const { loading, error, userToken } = useSelector((state) => state.authUser);

  useEffect(() => {
    if (userToken) navigate('/');
  }, [navigate, userToken]);

  const submitLoginForm = () => {
    if (!userEmail) {
      setErrors(true); setErrorMessages('Please enter your email'); return;
    }
    if (!userPassword) {
      setErrors(true); setErrorMessages('Please enter your password'); return;
    }
    if (!IsValidEmail(userEmail)) {
      setErrors(true); setErrorMessages('Email format not valid'); return;
    }
    dispatch(authUserLogin({ username: userEmail, password: userPassword }))
      .then((response) => {
        if (response.payload?.status === 401) {
          setErrors(true); setErrorMessages('Invalid username or password');
        } else if (response.payload?.msg === '200') {
          setUserEmail(''); setUserPassword(''); navigate('/');
        } else {
          setErrors(true); setErrorMessages(response.payload?.message || 'Login failed');
        }
      });
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w='100%'
        mx={{ base: 'auto', lg: '0px' }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '14vh' }}
        flexDirection='column'>

        <Box me='auto' mb='30px'>
          <Heading color={textColor} fontSize='32px' mb='8px' fontWeight='700'>
            Welcome back 👋
          </Heading>
          <Text color={textColorSecondary} fontWeight='400' fontSize='md'>
            Sign in to your {appName || ''} account to continue
          </Text>
        </Box>

        {(errors || error) && (
          <Alert status='error' mb='20px' borderRadius='12px'>
            <AlertIcon />
            <AlertDescription>{errorMessages || error}</AlertDescription>
            <CloseButton
              position='absolute' right='8px' top='8px'
              onClick={() => setErrors(false)} />
          </Alert>
        )}

        <Flex
          zIndex='2'
          direction='column'
          w={{ base: '100%', md: '420px' }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: 'auto', lg: 'unset' }}
          me='auto'
          mb={{ base: '20px', md: 'auto' }}>

          <FormControl>
            <FormLabel
              display='flex' ms='4px' fontSize='sm'
              fontWeight='600' color={textColor} mb='8px'>
              Email Address <Text color='brand.500' ms='2px'>*</Text>
            </FormLabel>
            <Input
              variant='auth'
              fontSize='sm'
              type='email'
              placeholder='your@email.com'
              mb='20px'
              fontWeight='500'
              size='lg'
              borderRadius='12px'
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitLoginForm()}
            />

            <FormLabel
              ms='4px' fontSize='sm' fontWeight='600'
              color={textColor} display='flex'>
              Password <Text color='brand.500' ms='2px'>*</Text>
            </FormLabel>
            <InputGroup size='md'>
              <Input
                fontSize='sm'
                placeholder='Min. 8 characters'
                mb='20px'
                size='lg'
                type={show ? 'text' : 'password'}
                variant='auth'
                borderRadius='12px'
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitLoginForm()}
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: 'pointer' }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={() => setShow(!show)}
                />
              </InputRightElement>
            </InputGroup>

            <Flex justifyContent='space-between' align='center' mb='24px'>
              <FormControl display='flex' alignItems='center' w='auto'>
                <Checkbox
                  id='remember-login'
                  colorScheme='brandScheme'
                  me='10px'
                />
                <FormLabel
                  htmlFor='remember-login'
                  mb='0'
                  fontWeight='normal'
                  color={textColor}
                  fontSize='sm'>
                  Remember Me
                </FormLabel>
              </FormControl>
              <NavLink to='/auth/forgot-password'>
                <Text color={brandColor} fontSize='sm' fontWeight='600'>
                  Forgot password?
                </Text>
              </NavLink>
            </Flex>

            <Button
              fontSize='sm'
              bg={loading ? 'gray.400' : 'brand.500'}
              color='white'
              fontWeight='600'
              w='100%'
              h='50px'
              mb='24px'
              borderRadius='12px'
              _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'md' }}
              _active={{ bg: 'brand.700' }}
              transition='all 0.2s'
              onClick={submitLoginForm}
              isLoading={loading}
              loadingText='Signing in...'>
              Sign In
            </Button>
          </FormControl>

          <Flex justifyContent='center' alignItems='center'>
            <Text color={textColorSecondary} fontWeight='400' fontSize='sm'>
              Don't have an account?{' '}
              <NavLink to='/auth/sign-up'>
                <Text color={brandColor} as='span' ms='5px' fontWeight='600'>
                  Create Account
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;