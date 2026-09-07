import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Flex, Text, Button, Icon,
  useColorModeValue, Spinner, SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { MdPayment, MdCheckCircle, MdLock } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PaystackButton } from 'react-paystack';
import { paystackFundData, resetPaystackState } from 'storeMtg/fundAccountPaysackSlice';
import { getPaymentGateStatus, resetPaymentGatewayState } from 'storeMtg/checkPaymentGatewayStatusSlice';
import { buyFundData, resetBuyState } from 'storeMtg/fundBuySlice';
import { useToast } from '@chakra-ui/react';
import { PageLayout, PageCard } from 'layouts/PageLayout';

export default function CheckoutPaystack() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector(state => state.authUser);

  const {
    reference, email, amount, note,
    actualPayment, serviceType, serviceCategory,
  } = location.state || {};

  const PaystackDemoKey = process.env.REACT_APP_PAYSTACK_DEMO_KEY;
  const paystackButtonRef = useRef(null);
  const [btnLoader, setBtnLoader] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [isPaymentTriggered, setIsPaymentTriggered] = useState(false);

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const successBg = useColorModeValue('green.50', 'navy.700');
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #4C5FD5 0%, #6C5CE7 100%)',
    'linear-gradient(135deg, #1E2C5A 0%, #2D3A6A 100%)'
  );

  useEffect(() => {
    dispatch(getPaymentGateStatus());
    return () => dispatch(resetPaymentGatewayState());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSuccess = (res) => {
    setBtnLoader(true);
    if (serviceType === 'Buy') {
      const buyData = {
        buy_service: serviceCategory,
        buy_amount: actualPayment,
        buy_nairaTotal: amount / 100,
        user_id: user?.userData?._id,
        tag_id: user?.userData?.tag_id,
        paystack_reference: res.reference,
      };
      dispatch(buyFundData(buyData)).then(result => {
        dispatch(resetBuyState());
        navigate('/user/success', { state: { reference: res.reference } });
      });
    } else {
      const fundData = {
        amt: amount / 100,
        user_id: user?.userData?._id,
        paystack_reference: res.reference,
      };
      dispatch(paystackFundData(fundData)).then(result => {
        dispatch(resetPaystackState());
        navigate('/user/success', { state: { reference: res.reference } });
      });
    }
  };

  const handleClose = () => {
    toast({
      title: 'Payment cancelled',
      description: 'You closed the payment window.',
      status: 'warning',
      duration: 3000,
    });
  };

  const paystackConfig = {
    email: email || user?.userData?.email || '',
    amount: Number(amount) || 0,
    publicKey: PaystackDemoKey || '',
    reference: reference || '',
    onSuccess: handleSuccess,
    onClose: handleClose,
  };

  return (
    <PageLayout>
      <Flex justify='center'>
        <Box maxW='480px' w='100%'>
          {/* Banner */}
          <Box bg={bannerGrad} borderRadius='20px' p='24px' mb='24px'
            position='relative' overflow='hidden'>
            <Box position='absolute' top='-30px' right='-30px'
              w='100px' h='100px' borderRadius='full' bg='whiteAlpha.100' />
            <Flex align='center' gap='12px' position='relative' zIndex='1'>
              <Box w='44px' h='44px' borderRadius='12px' bg='whiteAlpha.200'
                display='flex' alignItems='center' justifyContent='center'>
                <Icon as={MdPayment} color='white' w='22px' h='22px' />
              </Box>
              <Box>
                <Text color='white' fontSize='lg' fontWeight='800'>Complete Payment</Text>
                <Text color='whiteAlpha.700' fontSize='sm'>Secured by PayStack</Text>
              </Box>
            </Flex>
          </Box>

          <PageCard p='28px'>
            {/* Order Summary */}
            <Text color={textColor} fontWeight='700' fontSize='md' mb='16px'>
              Order Summary
            </Text>
            {[
              { label: 'Service', value: serviceCategory || serviceType || '—' },
              { label: 'Amount', value: actualPayment ? `$${Number(actualPayment).toLocaleString()}` : '—' },
              { label: 'Reference', value: reference || '—' },
            ].map((item, i) => (
              <Flex key={i} justify='space-between' py='12px'
                borderBottom='1px solid' borderColor={borderColor}>
                <Text color={subColor} fontSize='sm'>{item.label}</Text>
                <Text color={textColor} fontSize='sm' fontWeight='600'>{item.value}</Text>
              </Flex>
            ))}

            {/* Total */}
            <Flex justify='space-between' align='center' py='16px' mb='24px'>
              <Text color={textColor} fontSize='sm' fontWeight='700'>Total (NGN)</Text>
              <Text color='brand.500' fontSize='xl' fontWeight='800'>
                ₦{Number((amount || 0) / 100).toLocaleString()}
              </Text>
            </Flex>

            {/* PayStack Button */}
            {pageLoader ? (
              <Flex justify='center' py='20px'><Spinner color='brand.500' /></Flex>
            ) : (
              <Box>
                <PaystackButton
                  {...paystackConfig}
                  className='paystack-button'
                  style={{
                    width: '100%',
                    height: '52px',
                    backgroundColor: '#4C5FD5',
                    color: 'white',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  text={btnLoader ? 'Processing...' : '🔒 Pay Now with PayStack'}
                />
              </Box>
            )}

            {/* Security note */}
            <Flex align='center' justify='center' gap='8px' mt='16px'>
              <Icon as={MdLock} color={subColor} w='14px' h='14px' />
              <Text color={subColor} fontSize='xs'>
                Your payment is secured and encrypted by PayStack
              </Text>
            </Flex>
          </PageCard>
        </Box>
      </Flex>
    </PageLayout>
  );
}