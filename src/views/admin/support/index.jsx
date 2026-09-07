import React, { useState } from 'react';
import {
  Box, Flex, Text, Button, Icon,
  useColorModeValue, FormControl, FormLabel,
  Input, Textarea, Select, SimpleGrid,
  Badge, Divider, Spinner,
} from '@chakra-ui/react';
import {
  MdHelpOutline, MdSend, MdCheckCircle,
  MdHistory, MdAdd,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { postSupport } from 'storeMtg/supportSlice';
import { PageLayout, PageCard, PageSection } from 'layouts/PageLayout';
import { AuthAlert, AuthSuccess } from 'components/auth/AuthCard';
import { useFormValidation } from 'hooks/useFormValidation';

const CATEGORIES = [
  'Account Issue',
  'Transaction Problem',
  'Bills Payment',
  'Withdrawal Issue',
  'KYC Verification',
  'Bonus & Rewards',
  'Other',
];

export default function Support() {
  const dispatch = useDispatch();
  const { user, userToken } = useSelector(state => state.authUser);
  const userData = user?.userData;
  const { error, setError, clearError } = useFormValidation();

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputBg = useColorModeValue('white', 'navy.800');
  const iconBg = useColorModeValue('brand.50', 'navy.700');
  const tabActiveBg = useColorModeValue('brand.500', 'brand.500');
  const tabInactiveBg = useColorModeValue('white', 'navy.800');
  const tabHoverBg = useColorModeValue('gray.50', 'navy.700');

  const [tab, setTab] = useState('new'); // 'new' or 'history'
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  

  const inputProps = {
    size: 'lg', fontSize: 'sm', borderRadius: '12px',
    bg: inputBg, borderColor,
    _hover: { borderColor: 'brand.500' },
    _focus: { borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' },
  };

  const handleSubmit = async () => {
    clearError(); setSuccess('');
    if (!category) { setError('Please select a category'); return; }
    if (!subject.trim()) { setError('Subject is required'); return; }
    if (!message.trim() || message.length < 20) {
      setError('Please describe your issue (at least 20 characters)');
      return;
    }

    setLoading(true);
    try {
      const postData = {
        ticket_message: `[${category}] ${subject}\n\n${message}`,
        ticket_type: subject,
        createdBy: userData?._id,
      };
      const res = await dispatch(postSupport(postData));
      if (res.payload?.msg === '200' || res.payload?.msg === '201') {
        setSuccess('Ticket submitted successfully! Our team will respond within 24 hours.');
        setSubject(''); setCategory(''); setMessage('');
      } else {
        setError(res.payload?.message || 'Failed to submit ticket. Please try again.');
      }
    } catch (e) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      {/* Tab Toggle */}
      <Flex gap='8px' mb='24px'>
        {['new', 'history'].map(t => (
          <Button
            key={t}
            size='sm'
            borderRadius='12px'
            fontWeight='600'
            fontSize='sm'
            px='20px'
            bg={tab === t ? tabActiveBg : tabInactiveBg}
            color={tab === t ? 'white' : subColor}
            boxShadow={tab === t ? 'none' : '0 1px 4px rgba(0,0,0,0.08)'}
            border='1px solid'
            borderColor={tab === t ? 'brand.500' : borderColor}
            _hover={{ bg: tab === t ? 'brand.600' : tabHoverBg }}
            leftIcon={<Icon as={tab === 'new' && t === 'new' ? MdAdd : MdHistory} />}
            onClick={() => setTab(t)}>
            {t === 'new' ? 'New Ticket' : 'My Tickets'}
          </Button>
        ))}
      </Flex>

      {tab === 'new' ? (
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap='20px'>
          {/* Left — Form */}
          <PageCard p='28px'>
            <PageSection title='Submit a Support Ticket' subtitle='We typically respond within 24 hours' />

            <AuthAlert message={error} onClose={clearError} />
            <AuthSuccess message={success} />

            <FormControl mb='16px'>
              <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
                Category *
              </FormLabel>
              <Select {...inputProps} placeholder='Select category'
                value={category} onChange={e => { setCategory(e.target.value); clearError(); }}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl mb='16px'>
              <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
                Subject *
              </FormLabel>
              <Input {...inputProps} placeholder='Brief description of your issue'
                value={subject} onChange={e => { setSubject(e.target.value); clearError(); }} />
            </FormControl>

            <FormControl mb='24px'>
              <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
                Message *
              </FormLabel>
              <Textarea
                placeholder='Please describe your issue in detail...'
                rows={6} fontSize='sm' borderRadius='12px'
                bg={inputBg} borderColor={borderColor}
                _hover={{ borderColor: 'brand.500' }}
                _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' }}
                value={message}
                onChange={e => { setMessage(e.target.value); clearError(); }}
              />
              <Text color={subColor} fontSize='xs' mt='4px'>
                {message.length} characters {message.length < 20 ? `(${20 - message.length} more needed)` : ''}
              </Text>
            </FormControl>

            <Button
              w='100%' h='52px'
              bg='brand.500' color='white'
              borderRadius='12px' fontWeight='700' fontSize='sm'
              leftIcon={<Icon as={MdSend} />}
              _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'lg' }}
              transition='all 0.2s'
              isLoading={loading}
              loadingText='Submitting...'
              onClick={handleSubmit}>
              Submit Ticket
            </Button>
          </PageCard>

          {/* Right — Info */}
          <Flex direction='column' gap='16px'>
            {/* Account Info Card */}
            <PageCard p='24px'>
              <Flex align='center' gap='12px' mb='16px'>
                <Box w='44px' h='44px' borderRadius='12px'
                  bg={iconBg} display='flex' alignItems='center' justifyContent='center'>
                  <Icon as={MdHelpOutline} color='brand.500' w='22px' h='22px' />
                </Box>
                <Box>
                  <Text color={textColor} fontSize='sm' fontWeight='700'>Your Account</Text>
                  <Text color={subColor} fontSize='xs'>{userData?.email}</Text>
                </Box>
              </Flex>
              <Divider borderColor={borderColor} mb='16px' />
              {[
                { label: 'Name', value: userData?.display_name },
                { label: 'Tag ID', value: userData?.tag_id },
                { label: 'Account Status', value: userData?.acct_status },
              ].map((item, i) => (
                <Flex key={i} justify='space-between' py='8px'
                  borderBottom='1px solid' borderColor={borderColor}>
                  <Text color={subColor} fontSize='sm'>{item.label}</Text>
                  <Text color={textColor} fontSize='sm' fontWeight='600'>{item.value || '—'}</Text>
                </Flex>
              ))}
            </PageCard>

            {/* Tips Card */}
            <PageCard p='24px'>
              <Text color={textColor} fontSize='sm' fontWeight='700' mb='12px'>
                💡 Before submitting
              </Text>
              {[
              'Include your Transaction ID for payment issues',
              'Provide as much detail as possible',
              'Check your notifications for updates',
              'Response time: within 24 business hours',
              ].map((tip, i) => (
                <Flex key={i} align='flex-start' gap='8px' mb='10px'>
                  <Icon as={MdCheckCircle} color='green.400' w='16px' h='16px' mt='2px' flexShrink='0' />
                  <Text color={subColor} fontSize='sm'>{tip}</Text>
                </Flex>
              ))}
            </PageCard>
          </Flex>
        </SimpleGrid>
      ) : (
        <PageCard p='0' overflow='hidden'>
          <Box px='20px' py='16px' borderBottom='1px solid' borderColor={borderColor}>
            <Text color={textColor} fontSize='sm' fontWeight='700'>
              My Support Tickets
            </Text>
            <Text color={subColor} fontSize='xs'>
              View and track your submitted tickets
            </Text>
          </Box>
          <Flex direction='column' align='center' py='48px' color={subColor}>
            <Icon as={MdHistory} w='48px' h='48px' mb='12px' opacity={0.4} />
            <Text fontSize='sm' fontWeight='500'>No tickets yet</Text>
            <Text fontSize='xs' mt='4px'>Your submitted tickets will appear here</Text>
            <Button mt='16px' size='sm' colorScheme='brand' borderRadius='10px'
              onClick={() => setTab('new')}>
              Submit First Ticket
            </Button>
          </Flex>
        </PageCard>
      )}
    </PageLayout>
  );
}