import React, { useState, useEffect } from 'react';
import {
  Box, Flex, Text, Button, Icon, Switch,
  useColorModeValue, FormControl, FormLabel,
  Input, InputGroup, InputRightElement,
  SimpleGrid, Divider, Badge, useToast
} from '@chakra-ui/react';
import {
  MdLock, MdNotifications, MdSecurity,
  MdVisibility, MdVisibilityOff, MdCheckCircle, MdWarning,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { postSetting } from 'storeMtg/emailSettingSlice';
import { post2FAMode } from 'storeMtg/f2ASettingSlice';
import { postInAppNotification } from 'storeMtg/inAppSettingSlice';
import { passwordUpdateData } from 'storeMtg/passwordUpdateSlice';
import { updateUserDetails, authUserLogout } from 'storeMtg/authSlice';
import { PageLayout, PageCard, PageSection } from 'layouts/PageLayout';
import { AuthAlert, AuthSuccess } from 'components/auth/AuthCard';
import { useFormValidation } from 'hooks/useFormValidation';
import { useNavigate } from 'react-router-dom';
import { deactivateAccountData, resetDeactivateState } from 'storeMtg/deactivateAccountSlice';


const ToggleRow = ({ label, subtitle, checked, onChange, loading }) => {
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');

  return (
    <Flex
      justify='space-between' align='center'
      py='16px' borderBottom='1px solid' borderColor={borderColor}>
      <Box>
        <Text color={textColor} fontSize='sm' fontWeight='600'>{label}</Text>
        {subtitle && (
          <Text color={subColor} fontSize='xs' mt='2px'>{subtitle}</Text>
        )}
      </Box>
      <Switch
        colorScheme='brand'
        isChecked={checked}
        onChange={onChange}
        isDisabled={loading}
        size='md'
      />
    </Flex>
  );
};

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, userToken } = useSelector(state => state.authUser);
  const userData = user?.userData;
  const [showDangerConfirm, setShowDangerConfirm] = useState(false);
  const [dangerInput, setDangerInput] = useState('');
  const [deactivating, setDeactivating] = useState(false);

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputBg = useColorModeValue('white', 'navy.800');
  const iconBg = useColorModeValue('brand.50', 'navy.700');

  const twoFaBg = useColorModeValue('green.50', 'navy.700');
  const dangerBg = useColorModeValue('red.50', 'red.900');
  const dangerBorderColor = useColorModeValue('red.200', 'red.700');

  const { error, setError, clearError } = useFormValidation();
  const [success, setSuccess] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  // Notification toggles
  const [emailNotif, setEmailNotif] = useState(false);
  const [inAppNotif, setInAppNotif] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [toggling, setToggling] = useState('');

  // Password change
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setEmailNotif(userData.receive_email_notification || false);
      setInAppNotif(userData.receive_app_message || false);
      setTwoFA(userData.two_fa_enable || false);
    }
  }, [userData]);

  const handleEmailToggle = async (val) => {
    setToggling('email'); setEmailNotif(val);
    const res = await dispatch(postSetting({ emailEnable: val, user_token: userToken }));
    if (res.payload?.msg === '201') dispatch(updateUserDetails(res.payload));
    setToggling('');
  };

  const handleInAppToggle = async (val) => {
    setToggling('inapp'); setInAppNotif(val);
    const res = await dispatch(postInAppNotification({ inAppEnable: val, user_token: userToken }));
    if (res.payload?.msg === '201') dispatch(updateUserDetails(res.payload));
    setToggling('');
  };

  const handle2FAToggle = async (val) => {
    setToggling('2fa'); setTwoFA(val);
    const res = await dispatch(post2FAMode({ f2AmodeEnable: val, user_token: userToken }));
    if (res.payload?.msg === '201') dispatch(updateUserDetails(res.payload));
    setToggling('');
  };

    const handleDeactivateAccount = async () => {
    if (dangerInput !== 'DELETE') {
      return;
    }
    setDeactivating(true);
    try {
      const res = await dispatch(deactivateAccountData({}));
      if (res.payload?.msg === '201' || res.payload?.status === 201) {
        // Log out immediately
        dispatch(authUserLogout(userData?._id));
        navigate('/auth/sign-in');
      } else {
        toast({
          title: 'Failed to deactivate',
          description: res.payload?.message || 'Please contact support.',
          status: 'error',
          duration: 5000,
          position: 'top',
        });
      }
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setDeactivating(false);
      setShowDangerConfirm(false);
    }
  };

  
  const handlePasswordChange = async () => {
    setPwError(''); setPwSuccess('');
    if (!currentPw) { setPwError('Current password is required'); return; }
    if (!newPw || newPw.length < 8) { setPwError('New password must be at least 8 characters'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return; }
    setPwLoading(true);
    try {
      const res = await dispatch(passwordUpdateData({
        current_password: currentPw,
        new_password: newPw,
        user_token: userToken,
      }));
      if (res.payload?.msg === '201' || res.payload?.status === 201) {
        setPwSuccess('Password updated successfully');
        setCurrentPw(''); setNewPw(''); setConfirmPw('');
      } else {
        setPwError(res.payload?.message || 'Failed to update password');
      }
    } catch (e) {
      setPwError('Connection error. Please try again.');
    } finally {
      setPwLoading(false);
    }
  };

  const inputProps = {
    size: 'lg', fontSize: 'sm', borderRadius: '12px',
    bg: inputBg, borderColor,
    _hover: { borderColor: 'brand.500' },
    _focus: { borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' },
  };

  return (
    <PageLayout>
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap='20px' alignItems='start'>

        {/* Notifications Card */}
        <PageCard p='24px'>
          <Flex align='center' gap='12px' mb='20px'>
            <Box w='44px' h='44px' borderRadius='12px'
              bg={iconBg} display='flex' alignItems='center' justifyContent='center'>
              <Icon as={MdNotifications} color='brand.500' w='22px' h='22px' />
            </Box>
            <Box>
              <Text color={textColor} fontSize='md' fontWeight='700'>Notifications</Text>
              <Text color={subColor} fontSize='xs'>Manage your notification preferences</Text>
            </Box>
          </Flex>

          <ToggleRow
            label='Email Notifications'
            subtitle='Receive transaction alerts via email'
            checked={emailNotif}
            onChange={e => handleEmailToggle(e.target.checked)}
            loading={toggling === 'email'}
          />
          <ToggleRow
            label='In-App Notifications'
            subtitle='Receive alerts inside the app'
            checked={inAppNotif}
            onChange={e => handleInAppToggle(e.target.checked)}
            loading={toggling === 'inapp'}
          />
        </PageCard>

        {/* Security Card */}
        <PageCard p='24px'>
          <Flex align='center' gap='12px' mb='20px'>
            <Box w='44px' h='44px' borderRadius='12px'
              bg={useColorModeValue('green.50', 'green.900')}
              display='flex' alignItems='center' justifyContent='center'>
              <Icon as={MdSecurity} color='green.500' w='22px' h='22px' />
            </Box>
            <Box>
              <Text color={textColor} fontSize='md' fontWeight='700'>Security</Text>
              <Text color={subColor} fontSize='xs'>Protect your account</Text>
            </Box>
          </Flex>

          <ToggleRow
            label='Two-Factor Authentication'
            subtitle='Add extra security to your account'
            checked={twoFA}
            onChange={e => handle2FAToggle(e.target.checked)}
            loading={toggling === '2fa'}
          />

          <Flex align='center' gap='8px' mt='16px'
            bg={useColorModeValue('green.50', 'navy.700')}
            borderRadius='12px' p='12px'>
            <Icon as={MdCheckCircle} color='green.400' w='16px' h='16px' />
            <Text color={subColor} fontSize='xs'>
              {twoFA ? '2FA is active — your account is protected' : 'Enable 2FA for extra security'}
            </Text>
          </Flex>
        </PageCard>

        {/* Change Password Card */}
        <PageCard p='24px'>
          <Flex align='center' gap='12px' mb='20px'>
            <Box w='44px' h='44px' borderRadius='12px'
              bg={useColorModeValue('purple.50', 'purple.900')}
              display='flex' alignItems='center' justifyContent='center'>
              <Icon as={MdLock} color='purple.500' w='22px' h='22px' />
            </Box>
            <Box>
              <Text color={textColor} fontSize='md' fontWeight='700'>Change Password</Text>
              <Text color={subColor} fontSize='xs'>Update your account password</Text>
            </Box>
          </Flex>

          {pwError && (
            <AuthAlert message={pwError} onClose={() => setPwError('')} />
          )}
          {pwSuccess && (
            <AuthSuccess message={pwSuccess} />
          )}

          <FormControl mb='14px'>
            <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
              Current Password
            </FormLabel>
            <InputGroup size='lg'>
              <Input
                {...inputProps}
                type={showCurrent ? 'text' : 'password'}
                placeholder='Enter current password'
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  as={showCurrent ? MdVisibilityOff : MdVisibility}
                  color={subColor} cursor='pointer' w='20px' h='20px'
                  onClick={() => setShowCurrent(!showCurrent)}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl mb='14px'>
            <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
              New Password
            </FormLabel>
            <InputGroup size='lg'>
              <Input
                {...inputProps}
                type={showNew ? 'text' : 'password'}
                placeholder='Min 8 characters'
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  as={showNew ? MdVisibilityOff : MdVisibility}
                  color={subColor} cursor='pointer' w='20px' h='20px'
                  onClick={() => setShowNew(!showNew)}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl mb='24px'>
            <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
              Confirm New Password
            </FormLabel>
            <Input
              {...inputProps}
              type='password'
              placeholder='Repeat new password'
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePasswordChange()}
            />
          </FormControl>

          <Button
            w='100%' h='50px'
            bg='brand.500' color='white'
            borderRadius='12px' fontWeight='700' fontSize='sm'
            _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'lg' }}
            transition='all 0.2s'
            isLoading={pwLoading}
            loadingText='Updating...'
            onClick={handlePasswordChange}>
            Update Password
          </Button>
        </PageCard>

        {/* Account Info Card */}
       <PageCard p='24px' border='1px solid' borderColor={dangerBorderColor}
          bg={dangerBg}>
          <Flex align='center' gap='12px' mb='16px'>
            <Box w='44px' h='44px' borderRadius='12px'
              bg='red.100' display='flex' alignItems='center' justifyContent='center'>
              <Icon as={MdWarning} color='red.500' w='24px' h='24px' />
            </Box>
            <Box>
              <Text color='red.600' fontSize='md' fontWeight='800'>
                Danger Zone
              </Text>
              <Text color='red.400' fontSize='sm'>
                Irreversible actions — proceed with caution
              </Text>
            </Box>
          </Flex>

          <Box bg='white' borderRadius='12px' p='16px' mb='16px'
            border='1px solid' borderColor={dangerBorderColor}>
            <Text color={textColor} fontSize='sm' fontWeight='700' mb='6px'>
              Deactivate Account
            </Text>
            <Text color={subColor} fontSize='base' mb='12px' lineHeight='1.6'>
              Deactivating your account will immediately suspend access to all services.
              Your funds will remain safe. Contact support to claim any unpaid and funds in your account.
              <Text as='span' color='red.500' fontWeight='700'> This action cannot be undone.</Text>
            </Text>

            {!showDangerConfirm ? (
              <Button
                size='sm' colorScheme='red' variant='outline'
                borderRadius='10px' fontWeight='700'
                onClick={() => setShowDangerConfirm(true)}>
                Deactivate My Account
              </Button>
            ) : (
              <Box>
                <Text color={textColor} fontSize='sm' fontWeight='600' mb='8px'>
                  Type <Text as='span' color='red.500' fontFamily='monospace'>DELETE</Text> to confirm:
                </Text>
                <Input
                  size='sm' borderRadius='10px' mb='12px'
                  placeholder='Type DELETE to confirm'
                  value={dangerInput}
                  onChange={e => setDangerInput(e.target.value)}
                  borderColor={dangerInput === 'DELETE' ? 'red.500' : borderColor}
                  _focus={{ borderColor: 'red.500', boxShadow: '0 0 0 1px #E53E3E' }}
                />
                <Flex gap='8px'>
                  <Button size='sm' variant='outline' borderRadius='10px'
                    onClick={() => { setShowDangerConfirm(false); setDangerInput(''); }}>
                    Cancel
                  </Button>
                  <Button
                    size='sm' colorScheme='red' borderRadius='10px' fontWeight='700'
                    isDisabled={dangerInput !== 'DELETE'}
                    isLoading={deactivating}
                    loadingText='Deactivating...'
                    onClick={handleDeactivateAccount}>
                    Yes, Deactivate Account
                  </Button>
                </Flex>
              </Box>
            )}
          </Box>
        </PageCard>

      </SimpleGrid>
    </PageLayout>
  );
}