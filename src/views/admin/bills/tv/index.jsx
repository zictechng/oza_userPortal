import React, { useState, useEffect } from 'react';
import {
  Box, Button, Flex, FormControl, FormLabel,
  Input, Text, useColorModeValue,
  SimpleGrid, Spinner, Badge, Divider, useToast,
} from '@chakra-ui/react';
import { FiTv } from 'react-icons/fi';
import { MdCheckCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { BillsLayout, BillsSuccess } from 'components/bills/BillsLayout';
import { useBills } from 'hooks/useBills';
import { AuthAlert } from 'components/auth/AuthCard';
import { useFormValidation } from 'hooks/useFormValidation';

export default function BuyTv() {
  const navigate = useNavigate();
  const toast = useToast();
  const { fetchNetworks, verifyTv, buyTv, networks, networksLoading, userBalance } = useBills();
  const { error, setError, clearError } = useFormValidation();

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const quickBg = useColorModeValue('gray.50', 'navy.700');
  const successBg = useColorModeValue('green.50', 'navy.700');

  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [smartCard, setSmartCard] = useState('');
  const [phone, setPhone] = useState('');
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
    if (!selectedNetwork) { setError('Please select a TV provider'); 
      toast({
          title: 'Failed',
          description: 'Please select a TV provider',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-right',
        });
      return; }
    if (!smartCard || smartCard.length < 5) { setError('Please enter a valid smart card number'); 
      toast({
          title: 'Failed',
          description: 'Please enter a valid smart card number',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-right',
        });
      return; }

    setVerifying(true);
    try {
      const res = await verifyTv({
        smartcard_number: smartCard,
        service_id: selectedNetwork.service_id,
      });

      if (res.msg === '200') {
        setCustomerName(res.customer_name || '');
        setPlans(res.bouquets || []);
        setVerified(true);
        clearError();
        toast({
          title: 'Smart Card Verified ✓',
          description: res.customer_name || 'Smart card verified successfully',
          status: 'success', duration: 3000,
          isClosable: true, position: 'bottom-right',
        });
      } else {
        setError(res.message || 'Could not verify smart card. Please check and try again.');
        toast({
          title: 'Verification Failed',
          description: res.message || 'Please check your smart card number.',
          status: 'error', duration: 5000,
          isClosable: true, position: 'bottom-right',
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
    if (!verified) { setError('Please verify your smart card first'); return; }
    if (!selectedPlan) { setError('Please select a subscription plan'); return; }
    if (Number(selectedPlan.amount) > userBalance) { setError('Insufficient wallet balance'); return; }

    setLoading(true);
    try {
      const res = await buyTv({
        service_id: selectedNetwork.service_id,
        provider_name: selectedNetwork.name,
        smartcard_number: smartCard,
        phone: phone || '08000000000',
        plan_code: selectedPlan.code || selectedPlan.plan_code || selectedPlan.id,
        plan_name: selectedPlan.name || selectedPlan.bouquet_name,
        amount: selectedPlan.amount,
        customer_name: customerName,
      });

      if (res.msg === '200') {
        toast({
          title: 'Subscription Successful! ✅',
          description: `${selectedNetwork.name} subscription activated`,
          status: 'success', duration: 5000,
          isClosable: true, position: 'bottom-right',
        });
        setSuccess({
          items: [
            { label: 'Provider', value: selectedNetwork.name },
            { label: 'Smart Card', value: smartCard },
            { label: 'Customer', value: customerName },
            { label: 'Plan', value: selectedPlan.name || selectedPlan.bouquet_name },
            { label: 'Amount', value: `₦${Number(selectedPlan.amount).toLocaleString()}` },
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
          status: 'error', duration: 5000,
          isClosable: true, position: 'bottom-right',
        });
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
        <BillsSuccess title='TV Subscription Successful!'
          items={success.items} onDone={() => navigate('/user')} />
      </BillsLayout>
    );
  }

  return (
    <BillsLayout title='TV Subscription'
      subtitle='Renew your cable TV subscription instantly'
      icon={FiTv} iconBg='#D1FAE5' iconColor='#10B981'>

      <AuthAlert message={error} onClose={clearError} />

      {/* Select Provider */}
      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
          Select Provider *
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
                fontWeight='600' fontSize='sm'
                _hover={{ borderColor: 'brand.500' }}
                onClick={() => {
                  setSelectedNetwork(net);
                  setVerified(false);
                  setCustomerName('');
                  setPlans([]);
                  setSelectedPlan(null);
                  clearError();
                }}>
                {net.name}
              </Button>
            ))}
          </SimpleGrid>
        )}
      </FormControl>

      {/* Smart Card */}
      <FormControl mb='16px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
          Smart Card Number *
        </FormLabel>
        <Input placeholder='Enter smart card number'
          size='lg' borderRadius='12px' fontSize='sm'
          value={smartCard}
          onChange={e => {
            setSmartCard(e.target.value);
            setVerified(false);
            setCustomerName('');
            setPlans([]);
            setSelectedPlan(null);
            clearError();
          }}
          _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' }}
        />
      </FormControl>

      {/* Verify Button or Verified */}
      {!verified ? (
        <Button w='100%' h='48px' variant='outline'
          borderColor='brand.500' color='brand.500'
          borderRadius='12px' fontWeight='700' fontSize='sm' mb='20px'
          isLoading={verifying} loadingText='Verifying...'
          onClick={handleVerify}>
          Verify Smart Card
        </Button>
      ) : (
        <>
          <Flex align='center' gap='10px' bg={successBg}
            borderRadius='12px' px='16px' py='12px' mb='20px'
            border='1px solid' borderColor='green.200'>
            <MdCheckCircle color='#10B981' size={20} />
            <Box>
              <Text color='green.700' fontSize='sm' fontWeight='700'>
                ✓ Smart Card Verified
              </Text>
              <Text color='green.600' fontSize='xs'>{customerName}</Text>
            </Box>
            <Button size='xs' variant='ghost' color={subColor} ml='auto'
              onClick={() => { setVerified(false); setCustomerName(''); setPlans([]); setSelectedPlan(null); }}>
              Change
            </Button>
          </Flex>

          {/* Plans */}
          {plans.length > 0 && (
            <FormControl mb='20px'>
              <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
                Select Plan *
              </FormLabel>
              <Box maxH='240px' overflowY='auto'>
                {plans.map((plan, i) => (
                  <Box key={i}>
                    <Flex align='center' justify='space-between'
                      p='14px 12px' cursor='pointer' borderRadius='12px'
                      bg={selectedPlan?.code === plan.code ? 'brand.50' : 'transparent'}
                      border='2px solid'
                      borderColor={selectedPlan?.code === plan.code ? 'brand.500' : 'transparent'}
                      _hover={{ bg: quickBg }}
                      transition='all 0.15s'
                      onClick={() => { setSelectedPlan(plan); clearError(); }}>
                      <Text color={textColor} fontSize='sm' fontWeight='600'>
                        {plan.name || plan.bouquet_name}
                      </Text>
                      <Text color='brand.500' fontSize='sm' fontWeight='800'>
                        ₦{Number(plan.amount || 0).toLocaleString()}
                      </Text>
                    </Flex>
                    {i < plans.length - 1 && <Divider borderColor={borderColor} />}
                  </Box>
                ))}
              </Box>
            </FormControl>
          )}
        </>
      )}

      {/* Phone */}
      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
          Phone Number (optional)
        </FormLabel>
        <Input placeholder='08012345678' size='lg' borderRadius='12px'
          fontSize='sm' type='tel' value={phone}
          onChange={e => setPhone(e.target.value)}
          _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' }}
        />
      </FormControl>

      {/* Balance */}
      <Flex justify='space-between' align='center'
        bg={quickBg} borderRadius='12px'
        px='16px' py='12px' mb='24px'>
        <Text color={subColor} fontSize='sm'>Wallet Balance</Text>
        <Text color={selectedPlan && Number(selectedPlan.amount) > userBalance ? 'red.500' : textColor}
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
        Subscribe Now
      </Button>
    </BillsLayout>
  );
}