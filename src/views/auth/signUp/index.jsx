import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box, Button, Flex, FormControl, FormLabel,
  Heading, Icon, Input, InputGroup, InputRightElement,
  Text, useColorModeValue, Alert, AlertIcon,
  AlertDescription, CloseButton, SimpleGrid, Select,
  Progress,
} from '@chakra-ui/react';
import DefaultAuth from 'layouts/auth/Default';
import illustration from 'assets/img/auth/auth.png';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import IsValidEmail from 'components/EmailValidation';
import client from 'components/client';
import { useAppContext } from 'contexts/AppContext';

function SignUp() {
  const navigate = useNavigate();
  const { appName } = useAppContext();

  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const brandColor = useColorModeValue('brand.500', 'white');

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(false);
  const [errorMessages, setErrorMessages] = useState('');
  const [step, setStep] = useState(1); // Multi-step form

  const [form, setForm] = useState({
    display_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dob: '',
    state: '',
    city: '',
    address: '',
    user_country: 'Nigeria',
    currency_type: 'NGN',
    acct_type: 'User',
    share_code: '', // referral tag ID
    username: '',
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(false);
  };

  const validateStep1 = () => {
    if (!form.display_name) { setErrors(true); setErrorMessages('Full name is required'); return false; }
    if (!form.email) { setErrors(true); setErrorMessages('Email is required'); return false; }
    if (!IsValidEmail(form.email)) { setErrors(true); setErrorMessages('Invalid email format'); return false; }
    if (!form.phone) { setErrors(true); setErrorMessages('Phone number is required'); return false; }
    if (!form.password) { setErrors(true); setErrorMessages('Password is required'); return false; }
    if (form.password.length < 8) { setErrors(true); setErrorMessages('Password must be at least 8 characters'); return false; }
    if (form.password !== form.confirmPassword) { setErrors(true); setErrorMessages('Passwords do not match'); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (!form.gender) { setErrors(true); setErrorMessages('Please select gender'); return false; }
    if (!form.dob) { setErrors(true); setErrorMessages('Date of birth is required'); return false; }
    if (!form.state) { setErrors(true); setErrorMessages('State is required'); return false; }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        username: form.email,
      };
      const res = await client.post('/api/register', payload);
      if (res.data.msg === '200' || res.data.status === 200) {
        navigate('/auth/sign-in');
      } else if (res.data.status === 409) {
        setErrors(true); setErrorMessages('Email already exists. Please sign in.');
        setStep(1);
      } else if (res.data.status === 403) {
        setErrors(true); setErrorMessages('Phone number already exists.');
      } else {
        setErrors(true); setErrorMessages(res.data.message || 'Registration failed. Try again.');
      }
    } catch (e) {
      setErrors(true); setErrorMessages('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
        mt={{ base: '40px', md: '8vh' }}
        flexDirection='column'>

        <Box me='auto' mb='24px'>
          <Heading color={textColor} fontSize='28px' mb='8px' fontWeight='700'>
            Create your account 🚀
          </Heading>
          <Text color={textColorSecondary} fontWeight='400' fontSize='md'>
            Join {appName || ''} today. Step {step} of 2
          </Text>
          <Progress
            value={step === 1 ? 50 : 100}
            size='sm'
            colorScheme='brand'
            borderRadius='full'
            mt='12px'
            w={{ base: '100%', md: '420px' }}
          />
        </Box>

        {errors && (
          <Alert status='error' mb='16px' borderRadius='12px' w={{ base: '100%', md: '420px' }}>
            <AlertIcon />
            <AlertDescription>{errorMessages}</AlertDescription>
            <CloseButton position='absolute' right='8px' top='8px' onClick={() => setErrors(false)} />
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
          me='auto'>

          {step === 1 && (
            <FormControl>
              <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
                Full Name *
              </FormLabel>
              <Input
                variant='auth' fontSize='sm' placeholder='John Doe'
                mb='16px' size='lg' borderRadius='12px'
                value={form.display_name}
                onChange={e => handleChange('display_name', e.target.value)}
              />

              <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
                Email Address *
              </FormLabel>
              <Input
                variant='auth' fontSize='sm' type='email' placeholder='your@email.com'
                mb='16px' size='lg' borderRadius='12px'
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
              />

              <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
                Phone Number *
              </FormLabel>
              <Input
                variant='auth' fontSize='sm' placeholder='+234...'
                mb='16px' size='lg' borderRadius='12px'
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
              />

              <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
                Password *
              </FormLabel>
              <InputGroup size='md' mb='16px'>
                <Input
                  fontSize='sm' placeholder='Min. 8 characters'
                  size='lg' type={show ? 'text' : 'password'}
                  variant='auth' borderRadius='12px'
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
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

              <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
                Confirm Password *
              </FormLabel>
              <Input
                variant='auth' fontSize='sm' placeholder='Repeat password'
                mb='16px' size='lg' type='password' borderRadius='12px'
                value={form.confirmPassword}
                onChange={e => handleChange('confirmPassword', e.target.value)}
              />

              <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
                Referral Tag ID (optional)
              </FormLabel>
              <Input
                variant='auth' fontSize='sm' placeholder='Enter referral tag ID'
                mb='24px' size='lg' borderRadius='12px'
                value={form.share_code}
                onChange={e => handleChange('share_code', e.target.value)}
              />

              <Button
                fontSize='sm' bg='brand.500' color='white'
                fontWeight='600' w='100%' h='50px' mb='16px'
                borderRadius='12px'
                _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'md' }}
                transition='all 0.2s'
                onClick={handleNext}>
                Continue →
              </Button>
            </FormControl>
          )}

          {step === 2 && (
            <FormControl>
              <SimpleGrid columns={2} gap='16px' mb='16px'>
                <Box>
                  <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
                    Gender *
                  </FormLabel>
                  <Select
                    placeholder='Select gender'
                    size='lg' borderRadius='12px' fontSize='sm'
                    value={form.gender}
                    onChange={e => handleChange('gender', e.target.value)}>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                  </Select>
                </Box>
                <Box>
                  <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
                    Date of Birth *
                  </FormLabel>
                  <Input
                    type='date' size='lg' borderRadius='12px' fontSize='sm'
                    value={form.dob}
                    onChange={e => handleChange('dob', e.target.value)}
                  />
                </Box>
              </SimpleGrid>

              <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
                State *
              </FormLabel>
              <Input
                variant='auth' fontSize='sm' placeholder='Your state'
                mb='16px' size='lg' borderRadius='12px'
                value={form.state}
                onChange={e => handleChange('state', e.target.value)}
              />

              <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
                City
              </FormLabel>
              <Input
                variant='auth' fontSize='sm' placeholder='Your city'
                mb='16px' size='lg' borderRadius='12px'
                value={form.city}
                onChange={e => handleChange('city', e.target.value)}
              />

              <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
                Address
              </FormLabel>
              <Input
                variant='auth' fontSize='sm' placeholder='Your address'
                mb='24px' size='lg' borderRadius='12px'
                value={form.address}
                onChange={e => handleChange('address', e.target.value)}
              />

              <Flex gap='12px' mb='16px'>
                <Button
                  fontSize='sm' variant='outline' color='brand.500'
                  fontWeight='600' w='50%' h='50px'
                  borderRadius='12px'
                  onClick={() => setStep(1)}>
                  ← Back
                </Button>
                <Button
                  fontSize='sm' bg='brand.500' color='white'
                  fontWeight='600' w='50%' h='50px'
                  borderRadius='12px'
                  _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'md' }}
                  transition='all 0.2s'
                  isLoading={loading}
                  loadingText='Creating account...'
                  onClick={handleSubmit}>
                  Create Account
                </Button>
              </Flex>
            </FormControl>
          )}

          <Flex justifyContent='center' alignItems='center' mt='8px'>
            <Text color={textColorSecondary} fontWeight='400' fontSize='sm'>
              Already have an account?{' '}
              <NavLink to='/auth/sign-in'>
                <Text color={brandColor} as='span' ms='5px' fontWeight='600'>
                  Sign In
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignUp;