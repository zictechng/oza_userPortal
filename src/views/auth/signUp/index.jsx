import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box, Button, Flex, FormControl, FormLabel,
  Heading, Input, InputGroup, InputRightElement,
  Text, useColorModeValue, SimpleGrid, Select,
  Progress, Stepper, Step, StepIndicator,
  StepStatus, StepIcon, StepNumber, StepTitle,
  StepSeparator, useSteps,
} from '@chakra-ui/react';
import DefaultAuth from 'layouts/auth/Default';
import illustration from 'assets/img/auth/auth.png';
import client from 'components/client';
import { useAppContext } from 'contexts/AppContext';
import { AuthAlert, AuthSuccess } from 'components/auth/AuthCard';
import { usePasswordToggle } from 'hooks/usePasswordToggle';
import { useFormValidation } from 'hooks/useFormValidation';

const STEPS = [
  { title: 'Account' },
  { title: 'Personal' },
];

function SignUp() {
  const navigate = useNavigate();
  const { appName } = useAppContext();
  const { show, ToggleIcon } = usePasswordToggle();
  const { show: showConfirm, ToggleIcon: ToggleConfirmIcon } = usePasswordToggle();
  const {
    error, setError, clearError,
    validateEmail, validatePassword,
    validatePasswordMatch, validateRequired,
  } = useFormValidation();

  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { activeStep, setActiveStep } = useSteps({ index: 0, count: STEPS.length });

  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.500', 'gray.400');
  const brandColor = 'brand.500';
  const inputBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const stepBg = useColorModeValue('gray.50', 'navy.800');

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
    share_code: '',
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    clearError();
  };

  const inputProps = {
    size: 'lg',
    fontSize: 'sm',
    borderRadius: '12px',
    bg: inputBg,
    borderColor: borderColor,
    _hover: { borderColor: 'brand.500' },
    _focus: { borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' },
  };

  const validateStep1 = () => {
    clearError();
    if (!validateRequired(form.display_name, 'Full name')) return false;
    if (!validateEmail(form.email)) return false;
    if (!validateRequired(form.phone, 'Phone number')) return false;
    if (!validatePassword(form.password)) return false;
    if (!validatePasswordMatch(form.password, form.confirmPassword)) return false;
    return true;
  };

  const validateStep2 = () => {
    clearError();
    if (!validateRequired(form.gender, 'Gender')) return false;
    if (!validateRequired(form.dob, 'Date of birth')) return false;
    if (!validateRequired(form.state, 'State')) return false;
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setActiveStep(1);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const res = await client.post('/api/register', {
        ...form,
        username: form.email,
      });
      if (res.data.msg === '200' || res.data.status === 200) {
        setSuccess('Account created successfully! Please sign in.');
        setTimeout(() => navigate('/auth/sign-in'), 2000);
      } else if (res.data.status === 409) {
        setError('This email is already registered. Please sign in.');
        setActiveStep(0);
      } else if (res.data.status === 403) {
        setError('This phone number is already registered.');
        setActiveStep(0);
      } else {
        setError(res.data.message || 'Registration failed. Please try again.');
      }
    } catch (e) {
      setError('Connection error. Please check your internet and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultAuth illustrationBackground={illustration}>
      <Box maxW='440px' w='100%' mx='auto'>
        {/* Heading */}
        <Box mb='28px'>
          <Heading
            color={textColor}
            fontSize={{ base: '26px', md: '30px' }}
            fontWeight='800'
            mb='8px'
            lineHeight='1.2'>
            Create your account 🚀
          </Heading>
          <Text color={textColorSecondary} fontSize='sm' lineHeight='1.6'>
            Join {appName || 'us'} today and start earning rewards
          </Text>
        </Box>

        {/* Stepper */}
        <Box
          bg={stepBg}
          borderRadius='12px'
          p='16px'
          mb='24px'>
          <Stepper index={activeStep} colorScheme='brand' size='sm'>
            {STEPS.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>
                <Box flexShrink='0'>
                  <StepTitle fontSize='xs' fontWeight='600'>
                    {step.title}
                  </StepTitle>
                </Box>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
          <Progress
            value={activeStep === 0 ? 50 : 100}
            size='xs'
            colorScheme='brand'
            borderRadius='full'
            mt='12px'
            bg={useColorModeValue('gray.200', 'navy.700')}
          />
        </Box>

        {/* Alerts */}
        <AuthAlert message={error} onClose={clearError} />
        <AuthSuccess message={success} />

        {/* Step 1 — Account Info */}
        {activeStep === 0 && (
          <FormControl>
            <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
              Full Name *
            </FormLabel>
            <Input
              {...inputProps}
              placeholder='John Doe'
              mb='16px'
              value={form.display_name}
              onChange={e => handleChange('display_name', e.target.value)}
            />

            <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
              Email Address *
            </FormLabel>
            <Input
              {...inputProps}
              type='email'
              placeholder='your@email.com'
              mb='16px'
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
            />

            <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
              Phone Number *
            </FormLabel>
            <Input
              {...inputProps}
              placeholder='+2348012345678'
              mb='16px'
              value={form.phone}
              onChange={e => handleChange('phone', e.target.value)}
            />

            <SimpleGrid columns={2} gap='16px' mb='16px'>
              <Box>
                <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
                  Password *
                </FormLabel>
                <InputGroup size='lg'>
                  <Input
                    {...inputProps}
                    type={show ? 'text' : 'password'}
                    placeholder='Min 8 chars'
                    value={form.password}
                    onChange={e => handleChange('password', e.target.value)}
                  />
                  <InputRightElement display='flex' alignItems='center' mt='4px'>
                    {ToggleIcon}
                  </InputRightElement>
                </InputGroup>
              </Box>
              <Box>
                <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
                  Confirm *
                </FormLabel>
                <InputGroup size='lg'>
                  <Input
                    {...inputProps}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder='Repeat password'
                    value={form.confirmPassword}
                    onChange={e => handleChange('confirmPassword', e.target.value)}
                  />
                  <InputRightElement display='flex' alignItems='center' mt='4px'>
                    {ToggleConfirmIcon}
                  </InputRightElement>
                </InputGroup>
              </Box>
            </SimpleGrid>

            <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
              Referral Tag ID
              <Text as='span' color='gray.400' fontWeight='400' ms='4px'>(optional)</Text>
            </FormLabel>
            <Input
              {...inputProps}
              placeholder='Enter referral tag ID if any'
              mb='28px'
              value={form.share_code}
              onChange={e => handleChange('share_code', e.target.value)}
            />

            <Button
              bg='brand.500' color='white'
              fontWeight='700' w='100%' h='52px'
              borderRadius='12px' fontSize='sm'
              _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'lg' }}
              _active={{ bg: 'brand.700', transform: 'translateY(0)' }}
              transition='all 0.2s ease'
              onClick={handleNext}>
              Continue →
            </Button>
          </FormControl>
        )}

        {/* Step 2 — Personal Info */}
        {activeStep === 1 && (
          <FormControl>
            <SimpleGrid columns={2} gap='16px' mb='16px'>
              <Box>
                <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
                  Gender *
                </FormLabel>
                <Select
                  {...inputProps}
                  placeholder='Select'
                  value={form.gender}
                  onChange={e => handleChange('gender', e.target.value)}>
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                </Select>
              </Box>
              <Box>
                <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
                  Date of Birth *
                </FormLabel>
                <Input
                  {...inputProps}
                  type='date'
                  value={form.dob}
                  onChange={e => handleChange('dob', e.target.value)}
                />
              </Box>
            </SimpleGrid>

            <SimpleGrid columns={2} gap='16px' mb='16px'>
              <Box>
                <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
                  State *
                </FormLabel>
                <Input
                  {...inputProps}
                  placeholder='Your state'
                  value={form.state}
                  onChange={e => handleChange('state', e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
                  City
                </FormLabel>
                <Input
                  {...inputProps}
                  placeholder='Your city'
                  value={form.city}
                  onChange={e => handleChange('city', e.target.value)}
                />
              </Box>
            </SimpleGrid>

            <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
              Address
            </FormLabel>
            <Input
              {...inputProps}
              placeholder='Your full address'
              mb='28px'
              value={form.address}
              onChange={e => handleChange('address', e.target.value)}
            />

            <Flex gap='12px'>
              <Button
                variant='outline'
                borderColor='brand.500'
                color='brand.500'
                fontWeight='700'
                w='50%' h='52px'
                borderRadius='12px'
                fontSize='sm'
                _hover={{ bg: 'brand.50' }}
                onClick={() => { setActiveStep(0); clearError(); }}>
                ← Back
              </Button>
              <Button
                bg='brand.500' color='white'
                fontWeight='700' w='50%' h='52px'
                borderRadius='12px' fontSize='sm'
                _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'lg' }}
                _active={{ bg: 'brand.700', transform: 'translateY(0)' }}
                transition='all 0.2s ease'
                isLoading={loading}
                loadingText='Creating account...'
                onClick={handleSubmit}>
                Create Account
              </Button>
            </Flex>
          </FormControl>
        )}

        {/* Sign in link */}
        <Flex justify='center' align='center' mt='24px'>
          <Text color={textColorSecondary} fontSize='sm'>
            Already have an account?{' '}
            <NavLink to='/auth/sign-in'>
              <Text
                as='span' color={brandColor}
                fontWeight='700'
                _hover={{ textDecoration: 'underline' }}>
                Sign In
              </Text>
            </NavLink>
          </Text>
        </Flex>
      </Box>
    </DefaultAuth>
  );
}

export default SignUp;