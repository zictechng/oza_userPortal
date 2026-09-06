
import React, { useState, useEffect } from 'react';
import {
  Box, Button, Flex, FormControl, FormLabel,
  Input, Select, Text, useColorModeValue,
  SimpleGrid, Spinner, Alert, AlertIcon, AlertDescription,
} from '@chakra-ui/react';
import { FiPhone } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { BillsLayout, BillsSuccess } from 'components/bills/BillsLayout';
import { useBills } from 'hooks/useBills';
import { AuthAlert } from 'components/auth/AuthCard';
import { useFormValidation } from 'hooks/useFormValidation';

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export default function BuyAirtime() {
  const navigate = useNavigate();
  const { fetchNetworks, buyAirtime, networks, networksLoading, userBalance } = useBills();
  const { error, setError, clearError } = useFormValidation();

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const quickBg = useColorModeValue('gray.50', 'navy.700');
  const quickActiveBg = useColorModeValue('brand.500', 'brand.500');

  const [network, setNetwork] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchNetworks('airtime');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    clearError();
    if (!network) { setError('Please select a network'); return; }
    if (!phone || phone.length < 10) { setError('Please enter a valid phone number'); return; }
    if (!amount || Number(amount) < 50) { setError('Minimum airtime amount is ₦50'); return; }
    if (Number(amount) > userBalance) { setError('Insufficient wallet balance'); return; }

    setLoading(true);
    try {
      const res = await buyAirtime({ network, phone, amount });
      if (res.msg === '200') {
        setSuccess({
          items: [
            { label: 'Network', value: network.toUpperCase() },
            { label: 'Phone', value: phone },
            { label: 'Amount', value: `₦${Number(amount).toLocaleString()}` },
            { label: 'Reference', value: res.data?.reference || '—' },
            { label: 'New Balance', value: `₦${Number(res.data?.balance || 0).toLocaleString()}` },
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
      <BillsLayout title='Buy Airtime' icon={FiPhone} iconBg='#FEE2E2' iconColor='#EF4444'>
        <BillsSuccess
          title='Airtime Purchased!'
          items={success.items}
          onDone={() => navigate('/user')}
        />
      </BillsLayout>
    );
  }

  return (
    <BillsLayout
      title='Buy Airtime'
      subtitle='Top up any Nigerian mobile number instantly'
      icon={FiPhone}
      iconBg='#FEE2E2'
      iconColor='#EF4444'>

      <AuthAlert message={error} onClose={clearError} />

      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
          Select Network *
        </FormLabel>
        {networksLoading ? (
          <Flex justify='center' py='16px'><Spinner size='sm' color='brand.500' /></Flex>
        ) : (
          <SimpleGrid columns={2} gap='10px'>
            {networks.map(net => (
              <Button
                key={net.id}
                h='48px'
                borderRadius='12px'
                border='2px solid'
                borderColor={network === net.id ? 'brand.500' : borderColor}
                bg={network === net.id ? 'brand.500' : quickBg}
                color={network === net.id ? 'white' : textColor}
                fontWeight='600'
                fontSize='sm'
                _hover={{ borderColor: 'brand.500' }}
                onClick={() => { setNetwork(net.id); clearError(); }}>
                {net.name}
              </Button>
            ))}
          </SimpleGrid>
        )}
      </FormControl>

      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
          Phone Number *
        </FormLabel>
        <Input
          placeholder='08012345678'
          size='lg' borderRadius='12px' fontSize='sm'
          type='tel'
          value={phone}
          onChange={e => { setPhone(e.target.value); clearError(); }}
        />
      </FormControl>

      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
          Amount (₦) *
        </FormLabel>
        <Input
          placeholder='Enter amount'
          size='lg' borderRadius='12px' fontSize='sm'
          type='number'
          value={amount}
          onChange={e => { setAmount(e.target.value); clearError(); }}
        />
        <SimpleGrid columns={3} gap='8px' mt='12px'>
          {QUICK_AMOUNTS.map(amt => (
            <Button
              key={amt}
              size='sm'
              borderRadius='10px'
              border='1px solid'
              borderColor={amount === String(amt) ? 'brand.500' : borderColor}
              bg={amount === String(amt) ? 'brand.500' : quickBg}
              color={amount === String(amt) ? 'white' : subColor}
              fontWeight='600'
              fontSize='xs'
              onClick={() => { setAmount(String(amt)); clearError(); }}>
              ₦{amt.toLocaleString()}
            </Button>
          ))}
        </SimpleGrid>
      </FormControl>

      <Flex
        justify='space-between' align='center'
        bg={quickBg} borderRadius='12px'
        px='16px' py='12px' mb='24px'>
        <Text color={subColor} fontSize='sm'>Wallet Balance</Text>
        <Text color={textColor} fontSize='sm' fontWeight='700'>
          ₦{Number(userBalance).toLocaleString()}
        </Text>
      </Flex>

      <Button
        w='100%' h='52px'
        bg='brand.500' color='white'
        borderRadius='12px' fontWeight='700' fontSize='sm'
        _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'lg' }}
        _active={{ bg: 'brand.700', transform: 'translateY(0)' }}
        transition='all 0.2s'
        isLoading={loading}
        loadingText='Processing...'
        onClick={handleSubmit}>
        Buy Airtime
      </Button>
    </BillsLayout>
  );
}