
import React, { useState, useEffect } from 'react';
import {
  Box, Button, Flex, FormControl, FormLabel,
  Input, Text, useColorModeValue,
  SimpleGrid, Spinner, Select,
} from '@chakra-ui/react';
import { FiWifi } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { BillsLayout, BillsSuccess } from 'components/bills/BillsLayout';
import { useBills } from 'hooks/useBills';
import { AuthAlert } from 'components/auth/AuthCard';
import { useFormValidation } from 'hooks/useFormValidation';

export default function BuyData() {
  const navigate = useNavigate();
  const { fetchNetworks, fetchDataPlans, buyData, networks, plans, networksLoading, plansLoading, userBalance } = useBills();
  const { error, setError, clearError } = useFormValidation();

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const quickBg = useColorModeValue('gray.50', 'navy.700');

  const [network, setNetwork] = useState('');
  const [networkName, setNetworkName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchNetworks('data');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNetworkSelect = async (net) => {
    setNetwork(net.id);
    setNetworkName(net.name);
    setSelectedPlan(null);
    clearError();
    await fetchDataPlans(net.service_id);
  };

  const handleSubmit = async () => {
    clearError();
    if (!network) { setError('Please select a network'); return; }
    if (!selectedPlan) { setError('Please select a data plan'); return; }
    if (!phone || phone.length < 10) { setError('Please enter a valid phone number'); return; }
    if (Number(selectedPlan.amount) > userBalance) { setError('Insufficient wallet balance'); return; }

    setLoading(true);
    try {
      const res = await buyData({
        network,
        network_name: networkName,
        phone,
        plan_id: selectedPlan.id || selectedPlan.plan_id,
        plan_name: selectedPlan.name || selectedPlan.plan_name,
        amount: selectedPlan.amount,
      });
      if (res.msg === '200') {
        setSuccess({
          items: [
            { label: 'Network', value: networkName },
            { label: 'Plan', value: selectedPlan.name || selectedPlan.plan_name },
            { label: 'Phone', value: phone },
            { label: 'Amount', value: `₦${Number(selectedPlan.amount).toLocaleString()}` },
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
      <BillsLayout title='Buy Data' icon={FiWifi} iconBg='#DBEAFE' iconColor='#3B82F6'>
        <BillsSuccess title='Data Purchase Successful!' items={success.items} onDone={() => navigate('/user')} />
      </BillsLayout>
    );
  }

  return (
    <BillsLayout title='Buy Mobile Data' subtitle='Purchase data bundles for any Nigerian network'
      icon={FiWifi} iconBg='#DBEAFE' iconColor='#3B82F6'>

      <AuthAlert message={error} onClose={clearError} />

      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>Select Network *</FormLabel>
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
                onClick={() => handleNetworkSelect(net)}>
                {net.name}
              </Button>
            ))}
          </SimpleGrid>
        )}
      </FormControl>

      {network && (
        <FormControl mb='20px'>
          <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>Select Plan *</FormLabel>
          {plansLoading ? (
            <Flex justify='center' py='16px'><Spinner size='sm' color='brand.500' /></Flex>
          ) : (
            <Box maxH='200px' overflowY='auto'>
              {plans.map((plan, i) => (
                <Flex key={i}
                  justify='space-between' align='center'
                  p='12px' mb='8px' borderRadius='12px'
                  border='2px solid'
                  borderColor={selectedPlan?.id === plan.id ? 'brand.500' : borderColor}
                  bg={selectedPlan?.id === plan.id ? 'brand.50' : quickBg}
                  cursor='pointer'
                  onClick={() => { setSelectedPlan(plan); clearError(); }}>
                  <Box>
                    <Text color={textColor} fontSize='sm' fontWeight='600'>
                      {plan.name || plan.plan_name}
                    </Text>
                    <Text color={subColor} fontSize='xs'>
                      {plan.validity || plan.duration || ''}
                    </Text>
                  </Box>
                  <Text color='brand.500' fontSize='sm' fontWeight='700'>
                    ₦{Number(plan.amount || plan.price || 0).toLocaleString()}
                  </Text>
                </Flex>
              ))}
            </Box>
          )}
        </FormControl>
      )}

      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>Phone Number *</FormLabel>
        <Input placeholder='08012345678' size='lg' borderRadius='12px' fontSize='sm'
          type='tel' value={phone}
          onChange={e => { setPhone(e.target.value); clearError(); }} />
      </FormControl>

      <Flex justify='space-between' align='center' bg={quickBg}
        borderRadius='12px' px='16px' py='12px' mb='24px'>
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
        Buy Data Bundle
      </Button>
    </BillsLayout>
  );
}