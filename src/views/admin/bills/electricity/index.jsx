
import React, { useState, useEffect } from 'react';
import {
  Box, Button, Flex, FormControl, FormLabel,
  Input, Text, useColorModeValue,
  SimpleGrid, Spinner, Select, Badge,
} from '@chakra-ui/react';
import { FiZap } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { BillsLayout, BillsSuccess } from 'components/bills/BillsLayout';
import { useBills } from 'hooks/useBills';
import { AuthAlert } from 'components/auth/AuthCard';
import { useFormValidation } from 'hooks/useFormValidation';

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

export default function BuyElectricity() {
  const navigate = useNavigate();
  const { fetchNetworks, verifyMeter, buyElectricity, networks, networksLoading, userBalance } = useBills();
  const { error, setError, clearError } = useFormValidation();

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const quickBg = useColorModeValue('gray.50', 'navy.700');

  const [network, setNetwork] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [meterNumber, setMeterNumber] = useState('');
  const [meterType, setMeterType] = useState('prepaid');
  const [amount, setAmount] = useState('');
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
    if (!network) { setError('Please select a disco'); return; }
    if (!meterNumber || meterNumber.length < 6) { setError('Please enter a valid meter number'); return; }
    setVerifying(true);
    try {
      const res = await verifyMeter({
        meter_number: meterNumber,
        service_id: selectedNetwork?.service_id,
        meter_type: meterType,
      });
      if (res.msg === '200') {
        setCustomerName(res.data?.customer_name || res.customer_name || '');
        setVerified(true);
      } else {
        setError(res.message || 'Could not verify meter. Please check and try again.');
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
    if (Number(amount) > userBalance) { setError('Insufficient wallet balance'); return; }

    setLoading(true);
    try {
      const res = await buyElectricity({
        network,
        meter_number: meterNumber,
        meter_type: meterType,
        amount,
        customer_name: customerName,
        service_id: selectedNetwork?.service_id,
      });
      if (res.msg === '200') {
        setSuccess({
          items: [
            { label: 'Disco', value: network.toUpperCase() },
            { label: 'Meter', value: meterNumber },
            { label: 'Customer', value: customerName },
            { label: 'Amount', value: `₦${Number(amount).toLocaleString()}` },
            { label: 'Token', value: res.data?.token || res.token || '—' },
            { label: 'Reference', value: res.data?.reference || '—' },
          ]
        });
      } else {
        setError(res.message || 'Transaction failed. Please try again.');
      }
    } catch (e) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <BillsLayout title='Electricity' icon={FiZap} iconBg='#FEF3C7' iconColor='#F59E0B'>
        <BillsSuccess title='Electricity Token Purchased!' items={success.items} onDone={() => navigate('/user')} />
      </BillsLayout>
    );
  }

  return (
    <BillsLayout title='Pay Electricity Bill' subtitle='Purchase electricity tokens for any disco'
      icon={FiZap} iconBg='#FEF3C7' iconColor='#F59E0B'>

      <AuthAlert message={error} onClose={clearError} />

      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>Select Disco *</FormLabel>
        {networksLoading ? (
          <Flex justify='center' py='16px'><Spinner size='sm' color='brand.500' /></Flex>
        ) : (
          <SimpleGrid columns={2} gap='10px'>
            {networks.map(net => (
              <Button key={net.id} h='48px' borderRadius='12px'
                border='2px solid'
                borderColor={network === net.id ? 'brand.500' : borderColor}
                bg={network === net.id ? 'brand.500' : quickBg}
                color={network === net.id ? 'white' : textColor}
                fontWeight='600' fontSize='xs'
                _hover={{ borderColor: 'brand.500' }}
                onClick={() => { setNetwork(net.id); setSelectedNetwork(net); setVerified(false); setCustomerName(''); clearError(); }}>
                {net.name}
              </Button>
            ))}
          </SimpleGrid>
        )}
      </FormControl>

      <SimpleGrid columns={2} gap='16px' mb='20px'>
        <FormControl>
          <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>Meter Type *</FormLabel>
          <Select size='lg' borderRadius='12px' fontSize='sm'
            value={meterType}
            onChange={e => { setMeterType(e.target.value); setVerified(false); }}>
            <option value='prepaid'>Prepaid</option>
            <option value='postpaid'>Postpaid</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>Meter Number *</FormLabel>
          <Input placeholder='Enter meter number' size='lg' borderRadius='12px' fontSize='sm'
            value={meterNumber}
            onChange={e => { setMeterNumber(e.target.value); setVerified(false); clearError(); }} />
        </FormControl>
      </SimpleGrid>

      {!verified ? (
        <Button w='100%' h='48px' variant='outline' borderColor='brand.500' color='brand.500'
          borderRadius='12px' fontWeight='700' fontSize='sm' mb='20px'
          isLoading={verifying} loadingText='Verifying...'
          onClick={handleVerifyMeter}>
          Verify Meter Number
        </Button>
      ) : (
        <Flex align='center' gap='10px' bg='green.50' borderRadius='12px'
          px='16px' py='12px' mb='20px' border='1px solid' borderColor='green.200'>
          <Badge colorScheme='green' borderRadius='full'>✓ Verified</Badge>
          <Text color='green.700' fontSize='sm' fontWeight='600'>{customerName}</Text>
        </Flex>
      )}

      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>Amount (₦) *</FormLabel>
        <Input placeholder='Enter amount' size='lg' borderRadius='12px' fontSize='sm'
          type='number' value={amount}
          onChange={e => { setAmount(e.target.value); clearError(); }} />
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

      <Flex justify='space-between' bg={quickBg} borderRadius='12px'
        px='16px' py='12px' mb='24px'>
        <Text color={subColor} fontSize='sm'>Wallet Balance</Text>
        <Text color={textColor} fontSize='sm' fontWeight='700'>
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