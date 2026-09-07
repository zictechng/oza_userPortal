import React, { useState, useEffect } from 'react';
import {
  Box, Flex, Text, Icon, Button, Badge,
  useColorModeValue, SimpleGrid, Avatar,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Input, Select, FormControl, FormLabel,
  Divider, Spinner,
} from '@chakra-ui/react';
import {
  MdPerson, MdEdit, MdVerified, MdStar,
  MdOutlineAccountBalanceWallet,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import client from 'components/client';
import { AuthAlert } from 'components/auth/AuthCard';
import { AuthSuccess } from 'components/auth/AuthCard';
import { useFormValidation } from 'hooks/useFormValidation';
import { updateUserDetails } from 'storeMtg/authSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const { user, userToken } = useSelector(state => state.authUser);
  const userData = user?.userData;
  const headers = { Authorization: `Bearer ${userToken}` };

  const { error, setError, clearError } = useFormValidation();
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const bg = useColorModeValue('gray.50', 'navy.900');
  const cardBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBg = useColorModeValue('white', 'navy.800');
  const headerBg = useColorModeValue(
    'linear-gradient(135deg, #4C5FD5 0%, #6C5CE7 100%)',
    'linear-gradient(135deg, #1E2C5A 0%, #2D3A6A 100%)'
  );

  const [form, setForm] = useState({
    display_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    gender: '',
  });

  useEffect(() => {
    if (userData) {
      setForm({
        display_name: userData.display_name || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        gender: userData.gender || '',
      });
    }
  }, [userData]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    clearError(); setSuccess('');
  };

  const handleSave = async () => {
    clearError(); setSuccess('');
    if (!form.display_name) { setError('Full name is required'); return; }
    if (!form.phone) { setError('Phone number is required'); return; }
    setSaving(true);
    try {
      const res = await client.post('/api/updateUser_profile', {
        ...form,
        user_id: userData?._id,
      }, { headers });
      if (res.data.msg === '201' || res.data.msg === '200') {
        setSuccess('Profile updated successfully');
        dispatch(updateUserDetails({ userData: { ...userData, ...form } }));
      } else {
        setError(res.data.message || 'Failed to update profile');
      }
    } catch (e) {
      setError('Connection error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputProps = {
    size: 'lg', fontSize: 'sm', borderRadius: '12px', bg: inputBg,
    borderColor: borderColor,
    _hover: { borderColor: 'brand.500' },
    _focus: { borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' },
  };

  const isVerified = userData?.acct_approved_status === 'Approved';
  const profileComplete = userData?.reg_stage4 === 'Yes';

  return (
    <Box
      pt={{ base: '100px', md: '80px' }}
      px={{ base: '16px', md: '24px' }}
      pb='40px'
      bg={bg}
      minH='100vh'>

      {/* Profile Header Banner */}
      <Box
        bg={headerBg}
        borderRadius='24px'
        p='32px'
        mb='24px'
        position='relative'
        overflow='hidden'>
        <Box position='absolute' top='-40px' right='-40px'
          w='160px' h='160px' borderRadius='full' bg='whiteAlpha.100' />

        <Flex align='center' gap='20px' position='relative' zIndex='1' flexWrap='wrap'>
          <Avatar
            name={userData?.display_name}
            src={userData?.profile_photo}
            size='xl'
            border='4px solid' borderColor='whiteAlpha.400'
          />
          <Box>
            <Flex align='center' gap='8px' mb='4px'>
              <Text color='white' fontSize='xl' fontWeight='800'>
                {userData?.display_name || '—'}
              </Text>
              {isVerified && (
                <Icon as={MdVerified} color='blue.300' w='20px' h='20px' />
              )}
            </Flex>
            <Text color='whiteAlpha.700' fontSize='sm' mb='8px'>
              {userData?.email}
            </Text>
            <Flex gap='8px' flexWrap='wrap'>
              <Badge colorScheme='whiteAlpha' variant='solid'
                borderRadius='full' px='10px' fontSize='xs'>
                Tag: {userData?.tag_id || '—'}
              </Badge>
              <Badge
                colorScheme={isVerified ? 'green' : 'orange'}
                variant='solid' borderRadius='full' px='10px' fontSize='xs'>
                {isVerified ? '✓ KYC Verified' : '⚠ Pending Verification'}
              </Badge>
              <Badge colorScheme='blue' variant='solid'
                borderRadius='full' px='10px' fontSize='xs'>
                {userData?.acct_type || 'User'}
              </Badge>
            </Flex>
          </Box>
        </Flex>
      </Box>

      {/* Stats Row */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap='16px' mb='24px'>
        {[
          { label: 'Main Wallet', value: `₦${Number(userData?.amount || 0).toLocaleString()}`, color: '#4C5FD5', bg: '#EEF2FF' },
          { label: 'Bonus Wallet', value: `₦${Number(userData?.all_bonus_acct || 0).toLocaleString()}`, color: '#10B981', bg: '#D1FAE5' },
          { label: 'Member Since', value: userData?.createdOn ? moment(userData.createdOn).format('MMM YYYY') : '—', color: '#F59E0B', bg: '#FEF3C7' },
          { label: 'Account Status', value: userData?.acct_status || '—', color: '#8B5CF6', bg: '#EDE9FE' },
        ].map((stat, i) => (
          <Box key={i} bg={cardBg} borderRadius='16px' p='16px'
            border='1px solid' borderColor={borderColor}>
            <Box w='32px' h='32px' borderRadius='8px' bg={stat.bg}
              display='flex' alignItems='center' justifyContent='center' mb='8px'>
              <Box w='12px' h='12px' borderRadius='full' bg={stat.color} />
            </Box>
            <Text color={subColor} fontSize='xs' fontWeight='600'
              textTransform='uppercase' letterSpacing='0.5px' mb='4px'>
              {stat.label}
            </Text>
            <Text color={textColor} fontSize='sm' fontWeight='700'>
              {stat.value}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* Tabs */}
      <Box bg={cardBg} borderRadius='20px'
        border='1px solid' borderColor={borderColor} overflow='hidden'>
        <Tabs colorScheme='brand'>
          <TabList px='20px' borderColor={borderColor}>
            <Tab fontSize='sm' fontWeight='600' py='16px'>Personal Info</Tab>
            <Tab fontSize='sm' fontWeight='600' py='16px'>Account Info</Tab>
          </TabList>

          <TabPanels>
            {/* Personal Info */}
            <TabPanel p='24px'>
              <AuthAlert message={error} onClose={clearError} />
              <AuthSuccess message={success} />

              <SimpleGrid columns={{ base: 1, md: 2 }} gap='16px' mb='16px'>
                <FormControl>
                  <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
                    Full Name *
                  </FormLabel>
                  <Input {...inputProps} value={form.display_name}
                    onChange={e => handleChange('display_name', e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
                    Phone Number *
                  </FormLabel>
                  <Input {...inputProps} value={form.phone}
                    onChange={e => handleChange('phone', e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
                    Gender
                  </FormLabel>
                  <Select {...inputProps} value={form.gender}
                    onChange={e => handleChange('gender', e.target.value)}>
                    <option value=''>Select gender</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
                    State
                  </FormLabel>
                  <Input {...inputProps} value={form.state}
                    onChange={e => handleChange('state', e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
                    City
                  </FormLabel>
                  <Input {...inputProps} value={form.city}
                    onChange={e => handleChange('city', e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
                    Address
                  </FormLabel>
                  <Input {...inputProps} value={form.address}
                    onChange={e => handleChange('address', e.target.value)} />
                </FormControl>
              </SimpleGrid>

              <Button
                bg='brand.500' color='white'
                borderRadius='12px' fontWeight='700'
                px='32px' h='48px'
                _hover={{ bg: 'brand.600', transform: 'translateY(-1px)' }}
                transition='all 0.2s'
                isLoading={saving}
                loadingText='Saving...'
                onClick={handleSave}>
                Save Changes
              </Button>
            </TabPanel>

            {/* Account Info */}
            <TabPanel p='24px'>
              {[
                { label: 'Email Address', value: userData?.email },
                { label: 'Tag ID', value: userData?.tag_id },
                { label: 'Account Type', value: userData?.acct_type },
                { label: 'Account Status', value: userData?.acct_status },
                { label: 'KYC Status', value: userData?.acct_approved_status },
                { label: 'Member Since', value: userData?.createdOn ? moment(userData.createdOn).format('DD MMMM YYYY') : '—' },
                { label: 'Date of Birth', value: userData?.dob || '—' },
                { label: 'Country', value: userData?.country || '—' },
              ].map((item, i) => (
                <Box key={i}>
                  <Flex justify='space-between' align='center' py='14px'>
                    <Text color={subColor} fontSize='sm'>{item.label}</Text>
                    <Text color={textColor} fontSize='sm' fontWeight='600'>
                      {item.value || '—'}
                    </Text>
                  </Flex>
                  <Divider borderColor={borderColor} />
                </Box>
              ))}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}