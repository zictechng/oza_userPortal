
import React, { useState, useEffect } from 'react';
import {
  Box, Button, Flex, FormControl, FormLabel,
  Input, Text, useColorModeValue,
  SimpleGrid, Spinner, Badge,
} from '@chakra-ui/react';
import { FiTv } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { BillsLayout, BillsSuccess } from 'components/bills/BillsLayout';
import { useBills } from 'hooks/useBills';
import { AuthAlert } from 'components/auth/AuthCard';
import { useFormValidation } from 'hooks/useFormValidation';

export default function BuyTv() {
  const navigate = useNavigate();
  const { fetchNetworks, verifyTv, buyTv, networks, networksLoading, userBalance } = useBills();
  const { error, setError, clearError } = useFormValidation();

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const quickBg = useColorModeValue('gray.50', 'navy.700');

  const [network, setNetwork] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [smartCard, setSmartCard] = useState('');
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchNetworks('tv_subscription');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async () => {
    clearError();
    if (!network) { setError('Please select a TV provider'); return; }
    if (!smartCard || smartCard.length < 5) { setError('Please enter a valid smart card number'); return; }
    setVerifying(true);
    try {
      const res = await verifyTv({
        smart_card_number: smartCard,
        service_id: selectedNetwork?.service_id,
      });
      if (res.msg === '200') {
        setCustomerName(res.data?.customer_name || '');
        setPlans(res.data?.plans || []);
        setVerified(true);
      } else {
        setError(res.message || 'Could not verify smart card. Please check and try again.');
      }
    } catch (e) {
      setError('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async () => {
    clearError();
    if (!verified) { setError('Please verify your smart card first'); return; }
    if (!selectedPlan) { setError('Please select a subscription plan'); return; }
    if (Number(selectedPlan.amount) > userBalance) { setError('Insufficient wallet balance'); return; }

    setLoading(true);
    try {
      const res = await buyTv({
        network,
        smart_card_number: smartCard,
        plan_id: selectedPlan.id || selectedPlan.plan_id,
        plan_name: selectedPlan.name || selectedPlan.plan_name,
        amount: selectedPlan.amount,
        customer_name: customerName,
      });
      if (res.msg === '200') {
        setSuccess({
          items: [
            { label: 'Provider', value: network.toUpperCase() },
            { label: 'Smart Card', value: smartCard },
            { label: 'Customer', value: customerName },
            { label: 'Plan', value: selectedPlan.name || selectedPlan.plan_name },
            { label: 'Amount', value: `₦${Number(selectedPlan.amount).toLocaleString()}` },
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
      <BillsLayout title='TV Subscription' icon={FiTv} iconBg='#D1FAE5' iconColor='#10B981'>
        <BillsSuccess title='TV Subscription Successful!' items={success.items} onDone={() => navigate('/user')} />
      </BillsLayout>
    );
  }

  return (
    <BillsLayout title='TV Subscription' subtitle='Renew your cable TV subscription instantly'
      icon={FiTv} iconBg='#D1FAE5' iconColor='#10B981'>

      <AuthAlert message={error} onClose={clearError} />

      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>Select Provider *</FormLabel>
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
                fontWeight='600' fontSize='sm'
                _hover={{ borderColor: 'brand.500' }}
                onClick={() => { setNetwork(net.id); setSelectedNetwork(net); setVerified(false); setCustomerName(''); setPlans([]); setSelectedPlan(null); clearError(); }}>
                {net.name}
              </Button>
            ))}
          </SimpleGrid>
        )}
      </FormControl>

      <FormControl mb='16px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>Smart Card Number *</FormLabel>
        <Input placeholder='Enter smart card number' size='lg' borderRadius='12px' fontSize='sm'
          value={smartCard}
          onChange={e => { setSmartCard(e.target.value); setVerified(false); clearError(); }} />
      </FormControl>

      {!verified ? (
        <Button w='100%' h='48px' variant='outline' borderColor='brand.500' color='brand.500'
          borderRadius='12px' fontWeight='700' fontSize='sm' mb='20px'
          isLoading={verifying} loadingText='Verifying...'
          onClick={handleVerify}>
          Verify Smart Card
        </Button>
      ) : (
        <>
          <Flex align='center' gap='10px' bg='green.50' borderRadius='12px'
            px='16px' py='12px' mb='20px' border='1px solid' borderColor='green.200'>
            <Badge colorScheme='green' borderRadius='full'>✓ Verified</Badge>
            <Text color='green.700' fontSize='sm' fontWeight='600'>{customerName}</Text>
          </Flex>

          {plans.length > 0 && (
            <FormControl mb='20px'>
              <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>Select Plan *</FormLabel>
              <Box maxH='200px' overflowY='auto'>
                {plans.map((plan, i) => (
                  <Flex key={i} justify='space-between' align='center'
                    p='12px' mb='8px' borderRadius='12px' border='2px solid'
                    borderColor={selectedPlan?.id === plan.id ? 'brand.500' : borderColor}
                    bg={selectedPlan?.id === plan.id ? 'brand.50' : quickBg}
                    cursor='pointer'
                    onClick={() => { setSelectedPlan(plan); clearError(); }}>
                    <Text color={textColor} fontSize='sm' fontWeight='600'>
                      {plan.name || plan.plan_name}
                    </Text>
                    <Text color='brand.500' fontSize='sm' fontWeight='700'>
                      ₦{Number(plan.amount || 0).toLocaleString()}
                    </Text>
                  </Flex>
                ))}
              </Box>
            </FormControl>
          )}
        </>
      )}

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
        Subscribe Now
      </Button>
    </BillsLayout>
  );
}