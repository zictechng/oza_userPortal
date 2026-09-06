import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box, Button, Flex, FormControl, FormLabel,
  Heading, Input, InputGroup, InputRightElement,
  Text, useColorModeValue, HStack, PinInput, PinInputField,
} from '@chakra-ui/react';
import DefaultAuth from 'layouts/auth/Default';
import illustration from 'assets/img/auth/auth.png';
import client from 'components/client';
import { useAppContext } from 'contexts/AppContext';
import { AuthAlert, AuthSuccess } from 'components/auth/AuthCard';
import { useFormValidation } from 'hooks/useFormValidation';
import { usePasswordToggle } from 'hooks/usePasswordToggle';

// Step indicator
const StepDot = ({ active, done }) => (
  <Box
    w='8px' h='8px' borderRadius='full'
    bg={done ? 'green.500' : active ? 'brand.500' : 'gray.200'}
    transition='all 0.3s'
  />
);

function ForgotPassword() {
  const navigate = useNavigate();
  const { appName } = useAppContext();
  const { error, setError, clearError, validateEmail, validatePassword, validatePasswordMatch } = useFormValidation();
  const { show, ToggleIcon } = usePasswordToggle();
  const { show: showConfirm, ToggleIcon: ToggleConfirmIcon } = usePasswordToggle();

  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.500', 'gray.400');
  const inputBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const otpBg = useColorModeValue('gray.50', 'navy.800');

  const inputProps = {
    size: 'lg',
    fontSize: 'sm',
    borderRadius: '12px',
    bg: inputBg,
    borderColor,
    _hover: { borderColor: 'brand.500' },
    _focus: { borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' },
  };

 
// Step 1 — Verify user exists then send OTP
  const handleSendOtp = async () => {
    clearError();
    if (!validateEmail(email)) return;
    setLoading(true);
    try {
      // First verify user exists using existing endpoint
      const verifyRes = await client.post('/api/verify_reset_password', {
        forget_details: email,
      });
      if (verifyRes.data.status === 404) {
        setError('No account found with this email address.');
        setLoading(false);
        return;
      }
      if (verifyRes.data.status === 401) {
        setError('This account is not active. Please contact support.');
        setLoading(false);
        return;
      }
      if (verifyRes.data.msg !== '200') {
        setError(verifyRes.data.message || 'Email not found. Please check and try again.');
        setLoading(false);
        return;
      }

      // User exists — now send OTP
      const otpRes = await client.post('/api/forgot_password', { email });
      if (otpRes.data.msg === '201') {
        setSuccess('OTP sent! Check your email inbox.');
        setTimeout(() => { setSuccess(''); setStep(2); }, 1500);
      } else {
        setError(otpRes.data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (e) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — Verify OTP
  const handleVerifyOtp = () => {
    clearError();
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    setStep(3);
  };

  // Step 3 — Reset Password
  const handleResetPassword = async () => {
    clearError();
    if (!validatePassword(newPassword)) return;
    if (!validatePasswordMatch(newPassword, confirmPassword)) return;
    setLoading(true);
    try {
      const res = await client.post('/api/reset_password', {
        email,
        otp,
        new_password: newPassword,
      });
      if (res.data.msg === '201') {
        setSuccess('Password reset successfully! Redirecting to sign in...');
        setTimeout(() => navigate('/auth/sign-in'), 2000);
      } else {
        setError(res.data.message || 'Failed to reset password. Please try again.');
        if (res.data.message?.includes('OTP')) setStep(2);
      }
    } catch (e) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = {
    1: { title: 'Forgot password? 🔐', sub: `Enter your ${appName || ''} account email and we'll send you a reset OTP` },
    2: { title: 'Check your email 📬', sub: `We sent a 6-digit OTP to ${email}. Enter it below.` },
    3: { title: 'Set new password 🔑', sub: 'Choose a strong password for your account' },
  };

  return (
    <DefaultAuth illustrationBackground={illustration}>
      <Box maxW='400px' w='100%' mx='auto'>

        {/* Step indicators */}
        <Flex gap='6px' align='center' mb='24px'>
          {[1, 2, 3].map(s => (
            <StepDot key={s} active={step === s} done={step > s} />
          ))}
          <Text color={textColorSecondary} fontSize='xs' ml='8px'>
            Step {step} of 3
          </Text>
        </Flex>

        {/* Title */}
        <Box mb='28px'>
          <Heading
            color={textColor}
            fontSize={{ base: '24px', md: '28px' }}
            fontWeight='800' mb='8px' lineHeight='1.2'>
            {stepTitles[step].title}
          </Heading>
          <Text color={textColorSecondary} fontSize='sm' lineHeight='1.6'>
            {stepTitles[step].sub}
          </Text>
        </Box>

        {/* Alerts */}
        <AuthAlert message={error} onClose={clearError} />
        <AuthSuccess message={success} />

        {/* Step 1 — Email */}
        {step === 1 && (
          <FormControl>
            <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
              Email Address
            </FormLabel>
            <Input
              {...inputProps}
              type='email'
              placeholder='your@email.com'
              mb='24px'
              value={email}
              onChange={e => { setEmail(e.target.value); clearError(); }}
              onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
            />
            <Button
              bg='brand.500' color='white' fontWeight='700'
              w='100%' h='52px' borderRadius='12px' fontSize='sm' mb='16px'
              _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'lg' }}
              _active={{ bg: 'brand.700', transform: 'translateY(0)' }}
              transition='all 0.2s ease'
              isLoading={loading} loadingText='Sending OTP...'
              onClick={handleSendOtp}>
              Send OTP
            </Button>
          </FormControl>
        )}

        {/* Step 2 — OTP */}
        {step === 2 && (
          <FormControl>
            <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='16px'>
              Enter 6-digit OTP
            </FormLabel>
            <HStack justify='center' mb='8px'>
              <PinInput
                size='lg'
                value={otp}
                onChange={setOtp}
                otp>
                {[...Array(6)].map((_, i) => (
                  <PinInputField
                    key={i}
                    w='48px' h='56px'
                    fontSize='xl' fontWeight='700'
                    borderRadius='12px'
                    bg={otpBg}
                    borderColor={borderColor}
                    _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' }}
                  />
                ))}
              </PinInput>
            </HStack>
            <Text color={textColorSecondary} fontSize='xs' textAlign='center' mb='24px'>
              Didn't receive it?{' '}
              <Text
                as='span' color='brand.500' fontWeight='600'
                cursor='pointer'
                onClick={() => { setStep(1); setOtp(''); clearError(); }}>
                Resend OTP
              </Text>
            </Text>
            <Button
              bg='brand.500' color='white' fontWeight='700'
              w='100%' h='52px' borderRadius='12px' fontSize='sm' mb='16px'
              _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'lg' }}
              transition='all 0.2s ease'
              onClick={handleVerifyOtp}>
              Verify OTP →
            </Button>
          </FormControl>
        )}

        {/* Step 3 — New Password */}
        {step === 3 && (
          <FormControl>
            <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
              New Password
            </FormLabel>
            <InputGroup size='lg' mb='16px'>
              <Input
                {...inputProps}
                type={show ? 'text' : 'password'}
                placeholder='Min 8 characters'
                value={newPassword}
                onChange={e => { setNewPassword(e.target.value); clearError(); }}
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                {ToggleIcon}
              </InputRightElement>
            </InputGroup>

            <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
              Confirm New Password
            </FormLabel>
            <InputGroup size='lg' mb='24px'>
              <Input
                {...inputProps}
                type={showConfirm ? 'text' : 'password'}
                placeholder='Repeat new password'
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); clearError(); }}
                onKeyDown={e => e.key === 'Enter' && handleResetPassword()}
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                {ToggleConfirmIcon}
              </InputRightElement>
            </InputGroup>

            <Button
              bg='brand.500' color='white' fontWeight='700'
              w='100%' h='52px' borderRadius='12px' fontSize='sm' mb='16px'
              _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'lg' }}
              _active={{ bg: 'brand.700', transform: 'translateY(0)' }}
              transition='all 0.2s ease'
              isLoading={loading} loadingText='Resetting password...'
              onClick={handleResetPassword}>
              Reset Password
            </Button>
          </FormControl>
        )}

        {/* Back to sign in */}
        <Flex justify='center'>
          <NavLink to='/auth/sign-in'>
            <Text
              color='brand.500' fontSize='sm' fontWeight='600'
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