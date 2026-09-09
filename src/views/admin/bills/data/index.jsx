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

// Network brand colors
const NETWORK_COLORS = {
  mtn: { bg: '#FCD34D', color: '#92400E', label: 'MTN' },
  airtel: { bg: '#FEE2E2', color: '#991B1B', label: 'Airtel' },
  glo: { bg: '#D1FAE5', color: '#065F46', label: 'Glo' },
  '9mobile': { bg: '#DBEAFE', color: '#1E40AF', label: '9mobile' },
};

const getNetworkBrand = (name) => {
  const n = name?.toLowerCase() || '';
  if (n.includes('mtn')) return NETWORK_COLORS.mtn;
  if (n.includes('airtel')) return NETWORK_COLORS.airtel;
  if (n.includes('glo')) return NETWORK_COLORS.glo;
  if (n.includes('9mobile') || n.includes('etisalat')) return NETWORK_COLORS['9mobile'];
  return { bg: '#EEF2FF', color: '#4C5FD5', label: name };
};

// Step indicator
const StepBar = ({ step, total, labels }) => {
  const stepColor = '#4C5FD5';
  const subColor = useColorModeValue('gray.400', 'gray.500');
  return (
    <Flex align='center' justify='center' mb='28px'>
      {labels.map((label, i) => (
        <React.Fragment key={i}>
          <Flex direction='column' align='center' gap='4px'>
            <Box w='28px' h='28px' borderRadius='full'
              bg={step > i ? stepColor : step === i ? stepColor : 'gray.200'}
              display='flex' alignItems='center' justifyContent='center'
              transition='all 0.3s'>
              {step > i ? (
                <MdCheckCircle color='white' size={18} />
              ) : (
                <Text fontSize='18px' fontWeight='800'
                  color={step >= i ? 'white' : 'gray.400'}>
                  {i + 1}
                </Text>
              )}
            </Box>
            <Text fontSize='12px' fontWeight='600' textAlign='center'
              color={step >= i ? stepColor : subColor} maxW='48px' noOfLines={1}>
              {label}
            </Text>
          </Flex>
          {i < labels.length - 1 && (
            <Box flex='1' h='2px' mx='4px' mt='-12px' transition='all 0.3s'
              bg={step > i ? stepColor : 'gray.200'} />
          )}
        </React.Fragment>
      ))}
    </Flex>
  );
};

export default function BuyData() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fetchNetworks, networks, networksLoading, userBalance } = useBills();
  const { user, userToken } = useSelector(state => state.authUser);
  const { error, setError, clearError } = useFormValidation();

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const selectBg = useColorModeValue('gray.50', 'navy.700');
  const cardBg = useColorModeValue('white', 'navy.800');

  // Steps: 0=network, 1=type, 2=plan, 3=phone+buy
  const [step, setStep] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState(null); // e.g. 'MTN'
  const [networkTypes, setNetworkTypes] = useState([]); // e.g. SME, DG, CG
  const [selectedNetwork, setSelectedNetwork] = useState(null); // full network obj
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

  // Group networks by brand (MTN, Airtel, Glo, 9mobile)
  const networkBrands = React.useMemo(() => {
    const brands = {};
    networks.forEach(net => {
      const brand = net.name?.split(' ')[0] || net.name;
      if (!brands[brand]) brands[brand] = [];
      brands[brand].push(net);
    });
    return brands;
  }, [networks]);

  // Step 0 → Select brand (MTN, Airtel etc)
  const handleBrandSelect = (brand, types) => {
    setSelectedBrand(brand);
    setNetworkTypes(types);
    setSelectedNetwork(null);
    setPlans([]);
    setSelectedPlan(null);
    clearError();
    setStep(1);
  };

  // Step 1 → Select data type (SME, DG etc) → fetch plans
  const handleTypeSelect = async (net) => {
    if (!net.service_id) {
      setError(`Service not configured for ${net.name}.`);
      return;
    }
    setSelectedNetwork(net);
    setSelectedPlan(null);
    setPlans([]);
    setPlansLoading(true);
    setStep(2);
    clearError();
    try {
      const res = await client.get(
        `/api/bills/plans/data/${net.service_id}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (res.data.msg === '200') {
        const rawPlans = res.data.plans || [];
        const normalized = rawPlans.map(p => ({
          ...p,
          name: p.name || p.data_plan || p.plan_name || p.description || '',
          amount: Number(p.amount || p.price || p.plan_price || p.cost || 0),
          plan_code: p.plan_code || p.code || p.id || p.plan_id || '',
          validity: p.validity || p.duration || p.period || '',
          service_id: net.service_id,
        }));
        if (normalized.length === 0) {
          setError(`No plans available for ${net.name}.`);
          setStep(1);
        } else {
          setPlans(normalized);
        }
      } else {
        setError(res.data.message || 'Could not load plans.');
        setStep(1);
      }
    } catch (e) {
      setError(`Failed to load plans. Please try again.`);
      setStep(1);
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
      const response = await client.post('/api/bills/buy_data', {
        userId: user?.userData?._id,
        tag_id: user?.userData?.tag_id,
        network: selectedNetwork.id,
        network_name: selectedNetwork.name,
        phone,
        service_id: selectedPlan.service_id,
        plan_code: selectedPlan.plan_code,
        plan_name: selectedPlan.name,
        amount: Number(selectedPlan.amount),
      }, { headers: { Authorization: `Bearer ${userToken}` } });

      const res = response.data;

      if (res.msg === '200') {
        if (res.balance !== undefined) {
          dispatch(updateUserDetails({
            userData: { ...user?.userData, amount: res.balance }
          }));
        }
        setSuccess({
          items: [
            { label: 'Network', value: selectedNetwork.name },
            { label: 'Plan', value: selectedPlan.name },
            { label: 'Phone', value: phone },
            { label: 'Amount', value: `₦${Number(selectedPlan.amount).toLocaleString()}` },
            { label: 'Reference', value: res.reference || '—' },
            { label: 'New Balance', value: `₦${Number(res.balance || 0).toLocaleString()}` },
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
        <BillsSuccess title='Data Purchase Successful!'
          items={success.items} onDone={() => navigate('/user')} />
      </BillsLayout>
    );
  }

  return (
    <BillsLayout title='Buy Mobile Data'
      subtitle='Purchase data bundles for any Nigerian network'
      icon={FiWifi} iconBg='#DBEAFE' iconColor='#3B82F6'>

      <AuthAlert message={error} onClose={clearError} />

      <StepBar step={step} total={4}
        labels={['Network', 'Type', 'Plan', 'Buy']} />

      {/* ── STEP 0 — Select Network Brand */}
      {step === 0 && (
        <Box>
          <Text color={textColor} fontSize='sm' fontWeight='700' mb='4px'>
            Select Network
          </Text>
          <Text color={subColor} fontSize='sm' mb='16px'>
            Choose your mobile network provider
          </Text>
          {networksLoading ? (
            <Flex justify='center' py='32px'><Spinner color='brand.500' /></Flex>
          ) : (
            <SimpleGrid columns={2} gap='12px'>
              {Object.entries(networkBrands).map(([brand, types]) => {
                const style = getNetworkBrand(brand);
                return (
                  <Button key={brand} h='80px'
                    borderRadius='16px' border='2px solid'
                    borderColor={borderColor}
                    bg={style.bg}
                    color={style.color}
                    fontWeight='800' fontSize='md'
                    flexDirection='column' gap='4px'
                    _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                    transition='all 0.2s'
                    onClick={() => handleBrandSelect(brand, types)}>
                    <Text fontSize='lg' fontWeight='800'>{brand}</Text>
                    <Text fontSize='10px' fontWeight='500' opacity={0.7}>
                      {types.length} plan type{types.length > 1 ? 's' : ''}
                    </Text>
                  </Button>
                );
              })}
            </SimpleGrid>
          )}
        </Box>
      )}

      {/* ── STEP 1 — Select Data Type */}
      {step === 1 && (
        <Box>
          <Flex align='center' gap='8px' mb='16px'>
            <Button size='ms' variant='ghost' color={subColor}
              leftIcon={<MdArrowBack />}
              onClick={() => { setStep(0); setSelectedBrand(null); }}>
              Back
            </Button>
            <Badge colorScheme='brand' borderRadius='full' px='10px'>
              {selectedBrand}
            </Badge>
          </Flex>
          <Text color={textColor} fontSize='sm' fontWeight='700' mb='4px'>
            Select Data Type
          </Text>
          <Text color={subColor} fontSize='sm' mb='16px'>
            Choose the type of data bundle you want
          </Text>
          <SimpleGrid columns={2} gap='12px'>
            {networkTypes.map(net => {
              // Extract type label e.g. "MTN (SME)" → "SME"
              const typeLabel = net.name?.match(/\(([^)]+)\)/)?.[1] || net.name;
              const descriptions = {
                'SME': 'Affordable bundles',
                'DG': 'Direct gifting',
                'CG': 'Corporate gifting',
                'AWOOF': 'Special promo',
                'GIFTING': 'Gift to others',
                'BROADBAND': 'High speed',
                'DATA_SHARE': 'Share data',
              };
              return (
                <Button key={net.id} h='72px'
                  borderRadius='16px' border='2px solid'
                  borderColor={borderColor}
                  bg={selectBg} color={textColor}
                  flexDirection='column' gap='2px'
                  fontWeight='700' fontSize='sm'
                  _hover={{ borderColor: 'brand.500', bg: 'brand.50', transform: 'translateY(-2px)' }}
                  transition='all 0.2s'
                  onClick={() => handleTypeSelect(net)}>
                  <Text fontWeight='800'>{typeLabel}</Text>
                  <Text fontSize='10px' color={subColor} fontWeight='500'>
                    {descriptions[typeLabel] || 'Data bundle'}
                  </Text>
                </Button>
              );
            })}
          </SimpleGrid>
        </Box>
      )}

      {/* ── STEP 2 — Select Plan*/}
      {step === 2 && (
        <Box>
          <Flex align='center' gap='8px' mb='16px'>
            <Button size='sm' variant='ghost' color={subColor}
              leftIcon={<MdArrowBack />}
              onClick={() => { setStep(1); setSelectedNetwork(null); }}>
              Back
            </Button>
            <Flex gap='6px' ml='auto'>
              <Badge colorScheme='brand' borderRadius='full' px='8px'>
                {selectedBrand}
              </Badge>
              <Badge colorScheme='purple' borderRadius='full' px='8px'>
                {selectedNetwork?.name?.match(/\(([^)]+)\)/)?.[1] || ''}
              </Badge>
            </Flex>
          </Flex>
          <Text color={textColor} fontSize='sm' fontWeight='700' mb='4px'>
            Select Data Plan
          </Text>
          <Text color={subColor} fontSize='sm' mb='16px'>
            Tap a plan to continue
          </Text>

          {plansLoading ? (
            <Flex justify='center' align='center' direction='column' py='40px' gap='12px'>
              <Spinner color='brand.500' size='lg' />
              <Text color={subColor} fontSize='sm'>Loading plans...</Text>
            </Flex>
          ) : plans.length === 0 ? (
            <Flex direction='column' align='center' py='32px' color={subColor}>
              <Text fontSize='sm'>No plans available</Text>
              <Button mt='12px' size='sm' variant='outline'
                onClick={() => setStep(1)}>Go Back</Button>
            </Flex>
          ) : (
            <Box maxH='360px' overflowY='auto'>
              {plans.map((plan, i) => (
                <Box key={i}>
                  <Flex align='center' justify='space-between'
                    p='14px 12px' cursor='pointer' borderRadius='12px'
                    _hover={{ bg: selectBg }}
                    transition='all 0.15s'
                    onClick={() => handlePlanSelect(plan)}>
                    <Box flex='1'>
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {plan.name}
                      </Text>
                      {plan.validity && (
                        <Text color={subColor} fontSize='xs' mt='2px'>
                          {plan.validity}
                        </Text>
                      )}
                    </Box>
                    <Flex align='center' gap='10px'>
                      <Text color='brand.500' fontSize='sm' fontWeight='800'>
                        ₦{Number(plan.amount).toLocaleString()}
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

      {/* ── STEP 3 — Phone + Buy*/}
      {step === 3 && (
        <Box>
          <Flex align='center' gap='8px' mb='16px'>
            <Button size='sm' variant='ghost' color={subColor}
              leftIcon={<MdArrowBack />}
              onClick={() => { setStep(2); setSelectedPlan(null); }}>
              Back
            </Button>
            <Flex gap='6px' ml='auto'>
              <Badge colorScheme='brand' borderRadius='full' px='8px'>
                {selectedBrand}
              </Badge>
            </Flex>
          </Flex>

          {/* Selected plan summary */}
          <Box bg={selectBg} borderRadius='16px' p='16px' mb='20px'
            border='2px solid' borderColor='brand.500'>
            <Text color={subColor} fontSize='xs' fontWeight='600'
              textTransform='uppercase' letterSpacing='0.5px' mb='8px'>
              Selected Plan
            </Text>
            <Flex justify='space-between' align='center'>
              <Box>
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                  {selectedPlan?.name}
                </Text>
                <Text color={subColor} fontSize='xs'>
                  {selectedPlan?.validity}
                </Text>
              </Box>
              <Text color='brand.500' fontSize='xl' fontWeight='800'>
                ₦{Number(selectedPlan?.amount || 0).toLocaleString()}
              </Text>
            </Flex>
          </Box>

          <FormControl mb='20px'>
            <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
              Phone Number *
            </FormLabel>
            <Input placeholder='08012345678' size='lg'
              borderRadius='12px' fontSize='sm' type='tel'
              value={phone}
              onChange={e => { setPhone(e.target.value); clearError(); }}
              _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' }}
            />
          </FormControl>

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

          <Button w='100%' h='52px' bg='brand.500' color='white'
            borderRadius='12px' fontWeight='700' fontSize='sm'
            _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'lg' }}
            transition='all 0.2s'
            isLoading={loading} loadingText='Processing...'
            onClick={handleSubmit}>
            Buy {selectedPlan?.name} — ₦{Number(selectedPlan?.amount || 0).toLocaleString()}
          </Button>
        </Box>
      )}
    </BillsLayout>
  );
}