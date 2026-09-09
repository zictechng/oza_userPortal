import React, { useState, useEffect } from 'react';
import {
  Box, Button, Flex, FormControl, FormLabel,
  Input, Text, useColorModeValue,
  SimpleGrid, Spinner, Badge, Divider,
} from '@chakra-ui/react';
import { FiWifi } from 'react-icons/fi';
import { MdArrowBack, MdCheckCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { BillsLayout, BillsSuccess } from 'components/bills/BillsLayout';
import { useBills } from 'hooks/useBills';
import { AuthAlert } from 'components/auth/AuthCard';
import { useFormValidation } from 'hooks/useFormValidation';
import client from 'components/client';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserDetails } from 'storeMtg/authSlice';

// Step indicator component
const StepDot = ({ step, currentStep, label, color }) => (
  <Flex direction='column' align='center' gap='4px'>
    <Box
      w='28px' h='28px' borderRadius='full'
      bg={currentStep >= step ? color : 'gray.200'}
      display='flex' alignItems='center' justifyContent='center'
      transition='all 0.3s'>
      {currentStep > step ? (
        <MdCheckCircle color='white' size={20} />
      ) : (
        <Text fontSize='12px' fontWeight='800'
          color={currentStep >= step ? 'white' : 'gray.400'}>
          {step}
        </Text>
      )}
    </Box>
    <Text fontSize='12px' fontWeight='600'
      color={currentStep >= step ? color : 'gray.400'}
      textAlign='center' maxW='50px' noOfLines={1}>
      {label}
    </Text>
  </Flex>
);

export default function BuyData() {
  const navigate = useNavigate();
  const { fetchNetworks, networks, networksLoading, userBalance } = useBills();
  const dispatch = useDispatch();
  const { user, userToken } = useSelector(state => state.authUser);
  const { error, setError, clearError } = useFormValidation();

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const cardBg = useColorModeValue('white', 'navy.800');
  const selectBg = useColorModeValue('gray.50', 'navy.700');
  const activeBg = 'brand.500';
  const stepColor = '#4C5FD5';

  // Step management
  const [step, setStep] = useState(1); // 1=network, 2=plan, 3=phone+buy

  // Selections
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchNetworks('data');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Step 1 → Select network → fetch plans
  const handleNetworkSelect = async (net) => {
    setSelectedNetwork(net);
    setSelectedPlan(null);
    setPlans([]);
    setPlansLoading(true);
    clearError();
    try {
      const res = await client.get(
        `/api/bills/plans/data/${net.service_id}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
        if (res.data.msg === '200') {
        // Normalize plan fields from any provider
        const rawPlans = res.data.plans || [];
        console.log('Raw plan sample:', rawPlans[0]); // Debug — remove after fix
        const normalized = rawPlans.map(p => ({
          ...p,
          name: p.name || p.data_plan || p.plan_name || p.description || p.plan,
          amount: p.amount || p.price || p.plan_price || p.cost || 0,
          plan_code: p.plan_code || p.code || p.id || p.plan_id,
          validity: p.validity || p.duration || p.period || p.expiry || '',
          service_id: p.service_id || selectedNetwork.service_id,
        }));
        setPlans(normalized);
        setStep(2);
      } else {
        setError(res.data.message || 'Could not load plans. Try again.');
      }
    } catch (e) {
      setError('Connection error. Please try again.');
    } finally {
      setPlansLoading(false);
    }
  };

  // Step 2 → Select plan
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setStep(3);
    clearError();
  };

  // Step 3 → Buy
  const handleSubmit = async () => {
    clearError();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    if (Number(selectedPlan.amount) > userBalance) {
      setError('Insufficient wallet balance');
      return;
    }

    setLoading(true);
    try {
      const res = await client.post('/api/bills/buy_data', {
        userId: user?.userData?._id,
        tag_id: user?.userData?.tag_id,
        network: selectedNetwork.id,
        network_name: selectedNetwork.name,
        phone,
        service_id: selectedPlan.service_id || selectedNetwork.service_id,
        plan_code: selectedPlan.plan_code || selectedPlan.code || selectedPlan.id,
        plan_name: selectedPlan.name || selectedPlan.plan_name,
        amount: Number(selectedPlan.amount),
      }, { headers: { Authorization: `Bearer ${userToken}` } });

      if (res.data.msg === '200') {
                // Update balance in Redux
        if (res.balance !== undefined) {
          dispatch(updateUserDetails({
            userData: { ...user?.userData, amount: res.balance }
          }));
        }
        setSuccess({
          items: [
            { label: 'Network', value: selectedNetwork.name },
            { label: 'Plan', value: selectedPlan.name || selectedPlan.plan_name },
            { label: 'Phone', value: phone },
            { label: 'Amount', value: `₦${Number(selectedPlan.amount).toLocaleString()}` },
            { label: 'Reference', value: res.reference || '—' },
            { label: 'New Balance', value: `₦${Number(res.balance || 0).toLocaleString()}` },
          ]
        });
      } else {
        setError(res.data.message || 'Transaction failed. Please try again.');
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
        <BillsSuccess
          title='Data Purchase Successful!'
          items={success.items}
          onDone={() => navigate('/user')}
        />
      </BillsLayout>
    );
  }

  return (
    <BillsLayout
      title='Buy Mobile Data'
      subtitle='Purchase data bundles for any Nigerian network'
      icon={FiWifi}
      iconBg='#DBEAFE'
      iconColor='#3B82F6'>

      <AuthAlert message={error} onClose={clearError} />

      {/* Step Indicator */}
      <Flex align='center' justify='center' gap='0' mb='28px'>
        <StepDot step={1} currentStep={step} label='Network' color={stepColor} />
        <Box flex='1' h='2px' bg={step > 1 ? stepColor : 'gray.200'} mx='4px' mt='-12px' transition='all 0.3s' />
        <StepDot step={2} currentStep={step} label='Plan' color={stepColor} />
        <Box flex='1' h='2px' bg={step > 2 ? stepColor : 'gray.200'} mx='4px' mt='-12px' transition='all 0.3s' />
        <StepDot step={3} currentStep={step} label='Buy' color={stepColor} />
      </Flex>

      {/* ── STEP 1 — Select Network*/}
      {step === 1 && (
        <Box>
          <Text color={textColor} fontSize='sm' fontWeight='700' mb='4px'>
            Select Network
          </Text>
          <Text color={subColor} fontSize='sm' mb='16px'>
            Choose the network you want to buy data for
          </Text>
          {networksLoading ? (
            <Flex justify='center' py='32px'><Spinner color='brand.500' /></Flex>
          ) : (
            <SimpleGrid columns={2} gap='12px'>
              {networks.map(net => (
                <Button
                  key={net.id}
                  h='64px'
                  borderRadius='16px'
                  border='2px solid'
                  borderColor={borderColor}
                  bg={selectBg}
                  color={textColor}
                  fontWeight='700'
                  fontSize='sm'
                  _hover={{ borderColor: 'brand.500', bg: 'brand.50', transform: 'translateY(-2px)' }}
                  transition='all 0.2s'
                  onClick={() => handleNetworkSelect(net)}>
                  {net.name}
                </Button>
              ))}
            </SimpleGrid>
          )}
        </Box>
      )}

      {/* ── STEP 2 — Select Plan*/}
      {step === 2 && (
        <Box>
          <Flex align='center' gap='8px' mb='16px'>
            <Button size='1X2l' variant='ghost' color={subColor}
              leftIcon={<MdArrowBack />}
              onClick={() => { setStep(1); setSelectedNetwork(null); }}>
              Back
            </Button>
            <Box flex='1' />
            <Badge colorScheme='brand' borderRadius='full' px='10px'>
              {selectedNetwork?.name}
            </Badge>
          </Flex>

          <Text color={textColor} fontSize='sm' fontWeight='700' mb='4px'>
            Select Data Plan
          </Text>
          <Text color={subColor} fontSize='sm' mb='16px'>
            Tap a plan to continue
          </Text>

          {plansLoading ? (
            <Flex justify='center' py='32px'><Spinner color='brand.500' /></Flex>
          ) : plans.length === 0 ? (
            <Flex direction='column' align='center' py='32px' color={subColor}>
              <Text fontSize='sm'>No plans available</Text>
              <Button mt='12px' size='sm' variant='outline'
                onClick={() => setStep(1)}>
                Go Back
              </Button>
            </Flex>
          ) : (
            <Box maxH='380px' overflowY='auto'
              css={{ '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { background: '#4C5FD5', borderRadius: '4px' } }}>
              {plans.map((plan, i) => (
                <Box key={i}>
                  <Flex
                    align='center' justify='space-between'
                    p='14px 12px'
                    cursor='pointer'
                    borderRadius='12px'
                    _hover={{ bg: selectBg }}
                    transition='all 0.15s'
                    onClick={() => handlePlanSelect(plan)}>
                    <Box flex='1'>
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {plan.name || plan.plan_name || plan.description}
                      </Text>
                      <Text color={subColor} fontSize='xs' mt='2px'>
                        {plan.validity || plan.duration || plan.period || ''}
                      </Text>
                    </Box>
                    <Flex align='center' gap='10px'>
                      <Text color='brand.500' fontSize='sm' fontWeight='800'>
                        ₦{Number(plan.amount || plan.price || 0).toLocaleString()}
                      </Text>
                      <Box w='8px' h='8px' borderRadius='full' bg='brand.500' />
                    </Flex>
                  </Flex>
                  {i < plans.length - 1 && <Divider borderColor={borderColor} />}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* ── STEP 3 — Phone + Buy ───────────────────── */}
      {step === 3 && (
        <Box>
          <Flex align='center' gap='8px' mb='16px'>
            <Button size='xs' variant='ghost' color={subColor}
              leftIcon={<MdArrowBack />}
              onClick={() => { setStep(2); setSelectedPlan(null); }}>
              Back
            </Button>
            <Box flex='1' />
            <Flex gap='6px'>
              <Badge colorScheme='brand' borderRadius='full' px='10px'>
                {selectedNetwork?.name}
              </Badge>
            </Flex>
          </Flex>

          {/* Selected plan summary */}
          <Box bg={selectBg} borderRadius='16px' p='16px' mb='20px'
            border='2px solid' borderColor='brand.500'>
            <Text color={subColor} fontSize='xs' fontWeight='600'
              textTransform='uppercase' letterSpacing='0.5px' mb='6px'>
              Selected Plan
            </Text>
            <Flex justify='space-between' align='center'>
              <Box>
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                  {selectedPlan?.name || selectedPlan?.plan_name}
                </Text>
                <Text color={subColor} fontSize='xs'>
                  {selectedPlan?.validity || selectedPlan?.duration || ''}
                </Text>
              </Box>
              <Text color='brand.500' fontSize='lg' fontWeight='800'>
                ₦{Number(selectedPlan?.amount || 0).toLocaleString()}
              </Text>
            </Flex>
          </Box>

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
              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' }}
            />
          </FormControl>

          {/* Wallet balance */}
          <Flex justify='space-between' align='center'
            bg={selectBg} borderRadius='12px'
            px='16px' py='12px' mb='24px'>
            <Text color={subColor} fontSize='sm'>Wallet Balance</Text>
            <Text
              color={Number(selectedPlan?.amount) > userBalance ? 'red.500' : textColor}
              fontSize='sm' fontWeight='700'>
              ₦{Number(userBalance).toLocaleString()}
            </Text>
          </Flex>

          <Button
            w='100%' h='52px'
            bg='brand.500' color='white'
            borderRadius='12px' fontWeight='700' fontSize='sm'
            _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'lg' }}
            transition='all 0.2s'
            isLoading={loading}
            loadingText='Processing...'
            onClick={handleSubmit}>
            Buy Data — ₦{Number(selectedPlan?.amount || 0).toLocaleString()}
          </Button>
        </Box>
      )}
    </BillsLayout>
  );
}