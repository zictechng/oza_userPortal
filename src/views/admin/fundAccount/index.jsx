import React, { useState } from 'react';
import {
  Box, Flex, Text, Icon, SimpleGrid,
  useColorModeValue, Divider, Button,
  Select, Input, InputGroup, InputLeftElement,
  Textarea, useToast, Spinner,
  FormControl, FormLabel,
  Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalCloseButton,
} from '@chakra-ui/react';
import { MdAdd, MdInfo, MdAccountBalance, MdAttachMoney } from 'react-icons/md';
import { PageLayout, PageCard } from 'layouts/PageLayout';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FundAccountForm from 'views/admin/fundAccount/FundAccountForm';
import client from 'components/client';



function UsdFundingForm() {
  const toast = useToast();
  const navigate = useNavigate();
  const { user, userToken } = useSelector(state => state.authUser);
  const userData = user?.userData;
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const infoBg = useColorModeValue('green.50', 'navy.700');

  const [serviceName, setServiceName] = useState('');
  const [amt, setAmt] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);

  const validateForm = () => {
    if (!serviceName) {
      toast({ title: 'Select a funding method', status: 'warning', duration: 3000, position: 'bottom-right' });
      return false;
    }
    if (!amt || Number(amt) <= 0) {
      toast({ title: 'Enter a valid amount', status: 'warning', duration: 3000, position: 'bottom-right' });
      return false;
    }
    return true;
  };

  const handleOpenModal = () => {
    if (validateForm()) setModalOpen(true);
  };

   // ✅ FIX ISSUE 1 & 2: PayPal — NO API call here at all.
  // Transaction record is created ONLY inside capturePaypalPayment (after PayPal confirms).
  const handlePaypalCheckout = () => {
    setModalOpen(false);
    navigate('/user/checkout-paypal', {
      state: {
        amount: amt,
        serviceName,
        serviceType: 'USD Funding',
        isUsdFunding: true,
        note,
      },
    });
  };

  // Manual transfer — this is the ONLY flow that pre-creates a pending record (correct)
  const handleManualTransfer = async () => {
    setManualLoading(true);
    try {
      const res = await client.post('/api/usd_account_funding', {
        userId: userData?._id,
        amt: Number(amt),
        serviceName,
        method: 'Manual',
        note,
      }, { headers: { Authorization: `Bearer ${userToken}` } });

      if (res.data.msg === '200') {
        setModalOpen(false);
        navigate('/user/manual-payment', {
          state: {
            payment: amt,
            track_id: res.data.tid,
            type: 'USD Funding',
            serviceCategory: serviceName,
            isUsdFunding: true,
          },
        });
      } else {
        toast({ title: res.data.message || 'Request failed', status: 'error', duration: 4000, position: 'bottom-right' });
      }
    } catch (e) {
      toast({ title: 'Connection error. Try again.', status: 'error', duration: 3000, position: 'bottom-right' });
    } finally {
      setManualLoading(false);
    }
  };


  return (
    <Box>
      <Text color={textColor} fontSize='md' fontWeight='800' mb='4px'>
        Fund USD Wallet
      </Text>
      <Text color={subColor} fontSize='base' mb='20px'>
        Send via PayPal, Payoneer or Bitcoin and submit proof of payment
      </Text>

      {/* Current USD Balance */}

      <FormControl mb='16px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor}>
          Funding Method *
        </FormLabel>
        <Select placeholder='Select method' size='lg' borderRadius='12px'
          value={serviceName} onChange={e => setServiceName(e.target.value)}
          _focus={{ borderColor: '#10B981', boxShadow: '0 0 0 1px #10B981' }}>
          <option value='PayPal'>PayPal</option>
          <option value='Payoneer'>Payoneer</option>
          <option value='Bitcoin'>Bitcoin</option>
        </Select>
      </FormControl>

            <FormControl mb='16px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor}>
          Amount (USD) *
        </FormLabel>
        <InputGroup size='lg'>
          <InputLeftElement
            children='$'
            fontSize='20px'
            color='gray.400'
            fontWeight='700'
          />
          <Input
            placeholder='Enter amount in USD'
            borderRadius='12px'
            type='number'
            value={amt}
            onChange={e => setAmt(e.target.value)}
            _focus={{ borderColor: '#10B981', boxShadow: '0 0 0 1px #10B981' }}
          />
        </InputGroup>
      </FormControl>

      <FormControl mb='24px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor}>
          Note (optional)
        </FormLabel>
        <Textarea placeholder='Additional notes...' borderRadius='12px'
          value={note} onChange={e => setNote(e.target.value)} rows={3}
          _focus={{ borderColor: '#10B981', boxShadow: '0 0 0 1px #10B981' }}
        />
      </FormControl>

      <Button w='100%' h='52px' bg='#10B981' color='white'
        borderRadius='12px' fontWeight='700' fontSize='sm'
        _hover={{ bg: '#059669', transform: 'translateY(-1px)', shadow: 'lg' }}
        transition='all 0.2s'
        onClick={handleOpenModal}>
        Fund USD Wallet
      </Button>

      {/* Modal — same pattern as Naira funding */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent borderRadius='16px'>
          <ModalHeader>Choose Funding Method</ModalHeader>
          <Text px={5} color='gray.500' fontSize='sm'>
            {serviceName === 'PayPal'
              ? 'Pay directly via PayPal checkout or transfer manually and upload proof.'
              : `Transfer via ${serviceName} manually and upload your proof of payment.`}
          </Text>
          <ModalCloseButton onClick={() => setModalOpen(false)} />
          <ModalBody pb={6} pt={4}>
            <Flex direction='column' gap='12px'>
              {/* PayPal Checkout — only shown for PayPal */}
               {serviceName === 'PayPal' && (
                <Button w='100%' h='48px' bg='#4C5FD5' color='white'
                  borderRadius='12px' fontWeight='700' fontSize='sm'
                  _hover={{ bg: '#3D4EAA' }}
                  isLoading={paypalLoading}
                  loadingText='Processing...'
                  onClick={handlePaypalCheckout}>
                  Pay with PayPal
                </Button>
              )}
              {/* Manual Transfer — always shown */}
              <Button w='100%' h='48px' bg='#10B981' color='white'
                borderRadius='12px' fontWeight='700' fontSize='sm'
                _hover={{ bg: '#059669' }}
                isLoading={manualLoading}
                loadingText='Processing...'
                onClick={handleManualTransfer}>
                Manual Transfer
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default function FundAccount() {
  const { user } = useSelector(state => state.authUser);
  const [activeTab, setActiveTab] = useState('naira');
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const infoBg = useColorModeValue('brand.50', 'navy.700');
  const activeBg = useColorModeValue('white', 'navy.800');
  const tabBg = useColorModeValue('gray.100', 'navy.700');
  const bannerGradNaira = useColorModeValue(
    'linear-gradient(135deg, #4C5FD5 0%, #3D4EAA 100%)',
    'linear-gradient(135deg, #1E2C5A 0%, #111c44 100%)'
  );
  const bannerGradUsd = useColorModeValue(
    'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    'linear-gradient(135deg, #022c22 0%, #064e3b 100%)'
  );
  const bannerGrad = activeTab === 'naira' ? bannerGradNaira : bannerGradUsd;

  return (
    <PageLayout>
      {/* Banner */}
      <Box bg={bannerGrad} borderRadius='20px' p='24px' mb='24px'
        position='relative' overflow='hidden'>
        <Box position='absolute' top='-30px' right='-30px'
          w='120px' h='120px' borderRadius='full' bg='whiteAlpha.100' />
        <Flex align='center' gap='12px'>
          <Box w='44px' h='44px' borderRadius='12px' bg='whiteAlpha.200'
            display='flex' alignItems='center' justifyContent='center'>
            <Icon as={activeTab === 'naira' ? MdAdd : MdAccountBalance}
              color='white' w='24px' h='24px' />
          </Box>
          <Box>
            <Text color='white' fontSize='lg' fontWeight='800'>
              {activeTab === 'naira' ? 'Fund Naira Wallet' : 'Fund USD Wallet'}
            </Text>
            <Text color='whiteAlpha.800' fontSize='sm'>
              {activeTab === 'naira'
                ? 'Add NGN via PayStack or manual bank transfer'
                : 'Fund your USD wallet via PayPal, Payoneer or Bitcoin'}
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Tab Selector */}
      <Box bg={tabBg} borderRadius='16px' p='6px' mb='24px'
        display='inline-flex' gap='4px'>
        <Box
          px='20px' py='10px' borderRadius='12px' cursor='pointer'
          bg={activeTab === 'naira' ? activeBg : 'transparent'}
          boxShadow={activeTab === 'naira' ? 'sm' : 'none'}
          transition='all 0.2s'
          onClick={() => setActiveTab('naira')}>
          <Text fontSize='base' fontWeight='700'
            color={activeTab === 'naira' ? '#4C5FD5' : subColor}>
            🇳🇬 Naira Funding
          </Text>
        </Box>
        <Box
          px='20px' py='10px' borderRadius='12px' cursor='pointer'
          bg={activeTab === 'usd' ? activeBg : 'transparent'}
          boxShadow={activeTab === 'usd' ? 'sm' : 'none'}
          transition='all 0.2s'
          onClick={() => setActiveTab('usd')}>
          <Text fontSize='base' fontWeight='700'
            color={activeTab === 'usd' ? '#10B981' : subColor}>
            💵 USD Funding
          </Text>
        </Box>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap='20px'>
        {/* Form */}
        <PageCard p='28px'>
          {activeTab === 'naira'
            ? <FundAccountForm />
            : <UsdFundingForm />}
        </PageCard>

        {/* Info */}
        <Flex direction='column' gap='16px'>
          <Box bg={activeTab === 'naira' ? infoBg : 'green.50'}
            borderRadius='16px' p='16px'
            border='1px solid'
            borderColor={activeTab === 'naira' ? 'brand.100' : 'green.200'}>
            <Flex align='center' gap='8px' mb='8px'>
              <Icon
                as={activeTab === 'naira' ? MdAccountBalance : MdAttachMoney}
                color={activeTab === 'naira' ? 'brand.500' : 'green.500'}
                w='18px' h='18px' />
              <Text color={textColor} fontSize='sm' fontWeight='700'>
                {activeTab === 'naira' ? 'Main Wallet Balance' : 'USD Wallet Balance'}
              </Text>
            </Flex>
            <Text
              color={activeTab === 'naira' ? 'brand.500' : 'green.500'}
              fontSize='xl' fontWeight='800'>
              {activeTab === 'naira'
                ? `₦${Number(user?.userData?.amount || 0).toLocaleString()}`
                : `$${Number(user?.userData?.usd_balance || 0).toLocaleString()}`}
            </Text>
            <Text color={subColor} fontSize='sm' mt='4px'>
              {activeTab === 'naira' ? 'NGN Main wallet' : 'USD spendable wallet'}
            </Text>
          </Box>

          <PageCard p='24px'>
            <Text color={textColor} fontSize='sm' fontWeight='700' mb='12px'>
              💡 Payment Methods
            </Text>
            {(activeTab === 'naira'
              ? [
                  { method: 'PayStack', desc: 'Instant funding via card or bank transfer' },
                  { method: 'Manual Transfer', desc: 'Transfer to our bank account and upload proof' },
                ]
              : [
                  { method: 'PayPal', desc: 'Pay via PayPal checkout — instant processing' },
                  { method: 'Payoneer / Bitcoin', desc: 'Transfer manually and upload proof of payment' },
                ]
            ).map((item, i) => (
              <Box key={i}>
                <Flex align='flex-start' gap='10px' py='12px'>
                  <Box w='8px' h='8px' borderRadius='full'
                    bg='brand.500' mt='6px' flexShrink='0' />
                  <Box>
                    <Text color={textColor} fontSize='sm' fontWeight='600'>{item.method}</Text>
                    <Text color={subColor} fontSize='sm'>{item.desc}</Text>
                  </Box>
                </Flex>
                {i === 0 && <Divider borderColor={borderColor} />}
              </Box>
            ))}
          </PageCard>

          <PageCard p='24px'>
            <Text color={textColor} fontSize='sm' fontWeight='700' mb='12px'>
              ⚠️ Important Notes
            </Text>
            {[
              'Minimum funding amount applies',
              'PayStack payments reflect instantly',
              'Manual transfers require admin approval',
              'Keep your payment receipt for reference',
            ].map((note, i) => (
              <Flex key={i} align='flex-start' gap='8px' mb='10px'>
                <Icon as={MdInfo} color='orange.400' w='16px' h='16px' mt='2px' flexShrink='0' />
                <Text color={subColor} fontSize='sm'>{note}</Text>
              </Flex>
            ))}
          </PageCard>
        </Flex>
      </SimpleGrid>
    </PageLayout>
  );
}