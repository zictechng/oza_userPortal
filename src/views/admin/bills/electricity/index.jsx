import React, { useState, useEffect } from 'react';
import {
  Box, Button, Flex, FormControl, FormLabel,
  Input, Text, useColorModeValue,
  SimpleGrid, Spinner, Select, Badge, Divider,
  useToast,
} from '@chakra-ui/react';
import { FiZap } from 'react-icons/fi';
import { MdCheckCircle, MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { BillsLayout, BillsSuccess } from 'components/bills/BillsLayout';
import { useBills } from 'hooks/useBills';
import { AuthAlert } from 'components/auth/AuthCard';
import { useFormValidation } from 'hooks/useFormValidation';

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

export default function BuyElectricity() {
  const navigate = useNavigate();
  const {
    fetchNetworks, verifyMeter, buyElectricity,
    networks, networksLoading, userBalance,
  } = useBills();
  const { error, setError, clearError } = useFormValidation();
  const toast = useToast();

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const quickBg = useColorModeValue('gray.50', 'navy.700');
  const successBg = useColorModeValue('green.50', 'navy.700');

  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [meterNo, setMeterNo] = useState('');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchNetworks('electricity');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerifyMeter = async () => {
    clearError();
    if (!selectedNetwork) 
      { setError('Please select a disco'); 
      toast({
          title: 'Failed',
          description: 'Please select a disco',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-right',
        });
      return; }
    if (!meterNo || meterNo.length < 6) { setError('Please enter a valid meter number'); 
      toast({
          title: 'Failed',
          description: 'Please enter a valid meter number',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-right',
        });
      return; }

    setVerifying(true);
    try {
      const res = await verifyMeter({
        service_id: selectedNetwork.service_id,
        meter_no: meterNo,
        disco: selectedNetwork.id,
      });

      if (res.msg === '200') {
        setCustomerName(res.customer_name || '');
        setVerified(true);
        clearError();
        toast({
          title: 'Meter Verified ✓',
          description: res.customer_name || 'Meter number verified successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'bottom-right',
        });
      } else {
        const msg = res.message || 'Could not verify meter. Please check and try again.';
        setError(msg);
        toast({
          title: 'Verification Failed',
          description: msg,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-right',
        });
      }
    } catch (e) {
      setError('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async () => {
    clearError();
    if (!verified) { setError('Please verify your meter number first'); return; }
    if (!amount || Number(amount) < 100) { setError('Minimum amount is ₦100'); return; }
    if (!phone || phone.length < 10) { setError('Please enter a valid phone number'); return; }
    if (Number(amount) > userBalance) { setError('Insufficient wallet balance'); return; }

    setLoading(true);
    try {
      const res = await buyElectricity({
        service_id: selectedNetwork.service_id,
        disco: selectedNetwork.id,
        disco_name: selectedNetwork.name,
        meter_no: meterNo,
        amount,
        phone_number: phone,
        customer_name: customerName,
      });

      if (res.msg === '200') {
        toast({
          title: 'Payment Successful! ✅',
          description: `Electricity token purchased for meter ${meterNo}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom-right',
        });
        setSuccess({
          items: [
            { label: 'Disco', value: selectedNetwork.name },
            { label: 'Meter No', value: meterNo },
            { label: 'Customer', value: customerName },
            { label: 'Amount', value: `₦${Number(amount).toLocaleString()}` },
            { label: 'Token', value: res.token || res.data?.token || '—' },
            { label: 'Reference', value: res.reference || '—' },
            { label: 'New Balance', value: `₦${Number(res.balance || 0).toLocaleString()}` },
          ]
        });
        } else {
        const msg = res.message || 'Transaction failed. Please try again.';
        setError(msg);
        toast({
          title: 'Transaction Failed',
          description: msg,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-right',
        });
      }
    } catch (e) {
      setError('Connection error. Please try again.');
      toast({
        title: 'Connection Error',
        description: 'Please check your connection and try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-right',
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <BillsLayout title='Electricity' icon={FiZap} iconBg='#FEF3C7' iconColor='#F59E0B'>
        <BillsSuccess title='Electricity Token Purchased!'
          items={success.items} onDone={() => navigate('/user')} />
      </BillsLayout>
    );
  }

  return (
    <BillsLayout title='Pay Electricity Bill'
      subtitle='Purchase electricity tokens for any disco'
      icon={FiZap} iconBg='#FEF3C7' iconColor='#F59E0B'>

      <AuthAlert message={error} onClose={clearError} />

      {/* Select Disco */}
      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
          Select Disco *
        </FormLabel>
        {networksLoading ? (
          <Flex justify='center' py='16px'><Spinner size='sm' color='brand.500' /></Flex>
        ) : (
          <SimpleGrid columns={2} gap='10px'>
            {networks.map(net => (
              <Button key={net.id} h='48px' borderRadius='12px'
                border='2px solid'
                borderColor={selectedNetwork?.id === net.id ? 'brand.500' : borderColor}
                bg={selectedNetwork?.id === net.id ? 'brand.500' : quickBg}
                color={selectedNetwork?.id === net.id ? 'white' : textColor}
                fontWeight='600' fontSize='xs'
                _hover={{ borderColor: 'brand.500' }}
                onClick={() => {
                  setSelectedNetwork(net);
                  setVerified(false);
                  setCustomerName('');
                  clearError();
                }}>
                {net.name}
              </Button>
            ))}
          </SimpleGrid>
        )}
      </FormControl>

      {/* Meter Number */}
      <FormControl mb='16px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
          Meter Number *
        </FormLabel>
        <Input
          placeholder='Enter meter number'
          size='lg' borderRadius='12px' fontSize='sm'
          value={meterNo}
          onChange={e => {
            setMeterNo(e.target.value);
            setVerified(false);
            setCustomerName('');
            clearError();
          }}
          _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' }}
        />
      </FormControl>

      {/* Verify Button or Verified Badge */}
      {!verified ? (
        <Button w='100%' h='48px' variant='outline'
          borderColor='brand.500' color='brand.500'
          borderRadius='12px' fontWeight='700' fontSize='sm' mb='20px'
          isLoading={verifying} loadingText='Verifying...'
          onClick={handleVerifyMeter}>
          Verify Meter Number
        </Button>
      ) : (
        <Flex align='center' gap='10px' bg={successBg}
          borderRadius='12px' px='16px' py='12px' mb='20px'
          border='1px solid' borderColor='green.200'>
          <MdCheckCircle color='#10B981' size={20} />
          <Box>
            <Text color='green.700' fontSize='sm' fontWeight='700'>
              ✓ Meter Verified
            </Text>
            <Text color='green.600' fontSize='xs'>{customerName}</Text>
          </Box>
          <Button size='xs' variant='ghost' color={subColor} ml='auto'
            onClick={() => { setVerified(false); setCustomerName(''); }}>
            Change
          </Button>
        </Flex>
      )}

      {/* Amount */}
      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
          Amount (₦) *
        </FormLabel>
        <Input placeholder='Enter amount' size='lg' borderRadius='12px'
          fontSize='sm' type='number' value={amount}
          onChange={e => { setAmount(e.target.value); clearError(); }}
          _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' }}
        />
        <SimpleGrid columns={3} gap='8px' mt='12px'>
          {QUICK_AMOUNTS.map(amt => (
            <Button key={amt} size='sm' borderRadius='10px' border='1px solid'
              borderColor={amount === String(amt) ? 'brand.500' : borderColor}
              bg={amount === String(amt) ? 'brand.500' : quickBg}
              color={amount === String(amt) ? 'white' : subColor}
              fontWeight='600' fontSize='xs'
              onClick={() => { setAmount(String(amt)); clearError(); }}>
              ₦{amt.toLocaleString()}
            </Button>
          ))}
        </SimpleGrid>
      </FormControl>

      {/* Phone Number */}
      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
          Phone Number *
        </FormLabel>
        <Input placeholder='08012345678' size='lg' borderRadius='12px'
          fontSize='sm' type='tel' value={phone}
          onChange={e => { setPhone(e.target.value); clearError(); }}
          _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' }}
        />
      </FormControl>

      {/* Balance */}
      <Flex justify='space-between' align='center'
        bg={quickBg} borderRadius='12px'
        px='16px' py='12px' mb='24px'>
        <Text color={subColor} fontSize='sm'>Wallet Balance</Text>
        <Text color={Number(amount) > userBalance ? 'red.500' : textColor}
          fontSize='sm' fontWeight='700'>
          ₦{Number(userBalance).toLocaleString()}
        </Text>
      </Flex>

      <Button w='100%' h='52px' bg='brand.500' color='white'
        borderRadius='12px' fontWeight='700' fontSize='sm'
        _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'lg' }}
        transition='all 0.2s'
        isLoading={loading} loadingText='Processing...'
        onClick={handleSubmit}>
        Pay Electricity Bill
      </Button>
    </BillsLayout>
  );
}