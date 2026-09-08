import React, { useState, useEffect } from 'react';
import {
  Box, Flex, Text, Button, Icon,
  useColorModeValue, Spinner,
  Alert, AlertIcon,
} from '@chakra-ui/react';
import { MdPayment, MdLock, MdInfo, MdAccountBalance } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PaystackButton } from 'react-paystack';
import { paystackFundData, resetPaystackState } from 'storeMtg/fundAccountPaysackSlice';
import { verifyPaystackPayment, resetVerifyState } from 'storeMtg/verifyPaystackSlice';
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
  const { data: gatewayData, dataLoading } = useSelector(
    state => state.paymentGatewayStatus || { data: {}, dataLoading: false }
  );
  const {
    reference, email, amount, note,
    actualPayment, serviceType, serviceCategory,
  } = location.state || {};

  const PaystackDemoKey = process.env.REACT_APP_PAYSTACK_DEMO_KEY;
  const [btnLoader, setBtnLoader] = useState(false);

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const infoBg = useColorModeValue('orange.50', 'navy.700');
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #4C5FD5 0%, #6C5CE7 100%)',
    'linear-gradient(135deg, #1E2C5A 0%, #2D3A6A 100%)'
  );

  // Check if PayStack is enabled by admin
  const paystackEnabled = gatewayData?.app_payStack_btn === true;

  useEffect(() => {
    dispatch(getPaymentGateStatus());
    return () => dispatch(resetPaymentGatewayState());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Amount — Paystack sends in kobo so amount is already multiplied by 100
  // Display amount = amount / 100
  const displayAmount = Number(amount || 0) / 100;

  // const handleSuccess = (res) => {
  //   setBtnLoader(true);
  //   if (serviceType === 'Buy') {
  //     const buyData = {
  //       buy_service: serviceCategory,
  //       buy_amount: actualPayment,
  //       buy_nairaTotal: displayAmount,
  //       user_id: user?.userData?._id,
  //       tag_id: user?.userData?.tag_id,
  //       paystack_reference: res.reference,
  //     };
  //     dispatch(buyFundData(buyData)).then(() => {
  //       dispatch(resetBuyState());
  //       navigate('/user/success', { state: { reference: res.reference } });
  //     });
  //   } else {
  //     const fundData = {
  //       amt: displayAmount,
  //       user_id: user?.userData?._id,
  //       paystack_reference: res.reference,
  //     };
  //     dispatch(paystackFundData(fundData)).then(() => {
  //       dispatch(resetPaystackState());
  //       navigate('/user/success', { state: { reference: res.reference } });
  //     });
  //   }
  // };

    const handleSuccess = (res) => {
    setBtnLoader(true);
      if (serviceType === 'Buy') {
      const buyData = {
        myId: user?.userData?._id,
        serviceName: serviceCategory,
        serviceCategory: 'Exchange',
        buy_amt: actualPayment,
        total_money: displayAmount,
        payId: res.reference,
        method: 'Paystack Checkout',
        serviceType: 'Buy',
        buy_note: note || '',
      };
      dispatch(buyFundData(buyData)).then(() => {
        dispatch(resetBuyState());
        navigate('/user/success', { state: { reference: res.reference, isBuy: true } });
      });
    } else {
      // Funding flow — verify with PayStack and credit instantly
      const fundData = {
        reference: res.reference,
        userId: user?.userData?._id,
        amt: displayAmount,
      };
      dispatch(verifyPaystackPayment(fundData)).then((result) => {
        dispatch(resetVerifyState());
        if (result.payload?.msg === '201') {
          toast({
            title: 'Payment Successful! 🎉',
            description: `Your wallet has been credited with ₦${displayAmount.toLocaleString()}`,
            status: 'success',
            duration: 6000,
            isClosable: true,
            position: 'top',
          });
          navigate('/user/success', { state: { reference: res.reference } });
        } else {
          toast({
            title: 'Payment issue',
            description: result.payload?.message || 'Contact support with your reference.',
            status: 'warning',
            duration: 8000,
            isClosable: true,
            position: 'top',
          });
        }
      });
    }
  };

  const handleClose = () => {
    toast({
      title: 'Payment cancelled',
      description: 'You closed the payment window.',
      status: 'warning', duration: 3000,
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
                <Text color='white' fontSize='lg' fontWeight='800'>
                  Complete Payment
                </Text>
                <Text color='whiteAlpha.700' fontSize='sm'>
                  Secured by PayStack
                </Text>
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
              { label: 'Payment Method', value: ' Card' },
              { label: 'Reference', value: reference || '—' },
            ].map((item, i) => (
              <Flex key={i} justify='space-between' py='12px'
                borderBottom='1px solid' borderColor={borderColor}>
                <Text color={subColor} fontSize='sm'>{item.label}</Text>
                <Text color={textColor} fontSize='sm' fontWeight='600'>
                  {item.value}
                </Text>
              </Flex>
            ))}

            {/* Total in Naira */}
            <Flex justify='space-between' align='center'
              py='16px' mb='24px'
              borderBottom='1px solid' borderColor={borderColor}>
              <Text color={textColor} fontSize='sm' fontWeight='700'>
                Total Amount (NGN)
              </Text>
              <Text color='brand.500' fontSize='xl' fontWeight='800'>
                ₦{displayAmount.toLocaleString()}
              </Text>
            </Flex>

            {/* PayStack status loading */}
            {dataLoading ? (
              <Flex justify='center' py='20px'>
                <Spinner color='brand.500' />
              </Flex>

            ) : paystackEnabled && PaystackDemoKey ? (
              /* PayStack enabled — show button */
                            <Box>
                <style>{`
                  .paystack-button {
                    width: 100%;
                    height: 40px;
                    background: linear-gradient(135deg, #4C5FD5 0%, #3D4EAA 100%);
                    color: white;
                    border-radius: 14px;
                    font-weight: 700;
                    font-size: 16px;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    letter-spacing: 0.3px;
                    box-shadow: 0 4px 15px rgba(76, 95, 213, 0.4);
                    transition: all 0.2s ease;
                  }
                  .paystack-button:hover {
                    background: linear-gradient(135deg, #3D4EAA 0%, #2D3A9A 100%);
                    box-shadow: 0 6px 20px rgba(76, 95, 213, 0.5);
                    transform: translateY(-1px);
                  }
                  .paystack-button:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 8px rgba(76, 95, 213, 0.4);
                  }
                  .paystack-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                  }
                `}</style>
                <PaystackButton
                  {...paystackConfig}
                  className='paystack-button'
                  text={btnLoader ? '⏳ Processing...' : '🔒  Pay  ₦' + displayAmount.toLocaleString() + '  Securely'}
                />
                <Flex align='center' justify='center' gap='8px' mt='16px' flexWrap='wrap'>
                  <Flex align='center' gap='4px'>
                    <Icon as={MdLock} color='green.500' w='14px' h='14px' />
                    <Text color={subColor} fontSize='xs'>SSL Secured</Text>
                  </Flex>
                  <Text color={subColor} fontSize='xs'>•</Text>
                  <Text color={subColor} fontSize='xs'>256-bit encryption</Text>
                  <Text color={subColor} fontSize='xs'>•</Text>
                  <Text color={subColor} fontSize='xs'>Powered by PayStack</Text>
                </Flex>
              </Box>

            ) : (
              /* PayStack disabled — show manual payment option */
              <Box>
                <Box bg={infoBg} borderRadius='16px' p='20px' mb='20px'
                  border='1px solid' borderColor='orange.200'>
                  <Flex align='flex-start' gap='12px'>
                    <Icon as={MdInfo} color='orange.500'
                      w='20px' h='20px' mt='2px' flexShrink='0' />
                    <Box>
                      <Text color='orange.700' fontSize='sm' fontWeight='700' mb='6px'>
                        PayStack payments unavailable
                      </Text>
                      <Text color='orange.600' fontSize='xs' lineHeight='1.6'>
                        Online card payments are temporarily disabled by admin.
                        You can complete your payment via manual bank transfer below.
                      </Text>
                    </Box>
                  </Flex>
                </Box>

                {/* What to do info */}
                <Box mb='20px'>
                  {[
                    'Transfer ₦' + displayAmount.toLocaleString() + ' to our bank account',
                    'Use your Tag ID as payment narration',
                    'Upload proof of payment after transfer',
                  ].map((step, i) => (
                    <Flex key={i} align='flex-start' gap='10px' mb='10px'>
                      <Box w='20px' h='20px' borderRadius='full'
                        bg='brand.500' display='flex' alignItems='center'
                        justifyContent='center' flexShrink='0'>
                        <Text color='white' fontSize='10px' fontWeight='800'>
                          {i + 1}
                        </Text>
                      </Box>
                      <Text color={subColor} fontSize='sm'>{step}</Text>
                    </Flex>
                  ))}
                </Box>

                <Button
                  w='100%' h='52px'
                  bg='brand.500' color='white'
                  borderRadius='12px' fontWeight='700'
                  leftIcon={<Icon as={MdAccountBalance} />}
                  _hover={{ bg: 'brand.600', transform: 'translateY(-1px)' }}
                  transition='all 0.2s'
                  onClick={() => navigate('/user/manual-payment', {
                    state: location.state
                  })}>
                  Pay via Manual Bank Transfer
                </Button>
              </Box>
            )}
          </PageCard>
        </Box>
      </Flex>
    </PageLayout>
  );
}