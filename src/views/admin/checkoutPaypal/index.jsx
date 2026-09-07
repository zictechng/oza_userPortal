import React, { useState } from 'react';
import {
  Box, Flex, Text, Icon, Button,
  useColorModeValue, Spinner, SimpleGrid,
} from '@chakra-ui/react';
import { MdPayment, MdLock, MdCheckCircle } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { capturePaypalPayment } from 'storeMtg/paypalCheckoutSlice';
import { useToast } from '@chakra-ui/react';
import { PageLayout, PageCard } from 'layouts/PageLayout';
import { PayPalButton } from 'react-paypal-button-v2';

export default function CheckoutPaypal() {
  const location = useLocation();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const PaypalDemoKey = process.env.REACT_APP_PAYPAL_DEMO_KEY;
  const dataInfo = location.state || {};
  const { paymentData = {} } = useSelector(state => state.paypalPayment);
  const { user } = useSelector(state => state.authUser);

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #003087 0%, #009cde 100%)',
    'linear-gradient(135deg, #001A4D 0%, #003D6B 100%)'
  );

  const handlePaymentSuccess = (details, data) => {
    setLoading(true);
    const captureData = {
      payerId: data.payerID,
      orderID: data.orderID,
      amount: paymentData.amount || details.purchase_units?.[0]?.amount?.value,
      serviceName: dataInfo.serviceName,
      serviceCategory: 'Exchange',
      sell_note: dataInfo.sell_note,
      method: dataInfo.method,
      myId: user?.userData?._id,
      total_money: dataInfo.total_money,
      serviceType: dataInfo.serviceType,
    };
    dispatch(capturePaypalPayment(captureData)).then(res => {
      setLoading(false);
      if (res.payload?.msg === '201') {
        setPaymentCompleted(true);
        toast({
          title: 'Payment Successful!',
          description: 'Your transaction has been processed.',
          status: 'success',
          duration: 5000,
          position: 'top',
        });
        setTimeout(() => navigate('/user/success'), 2000);
      } else {
        toast({
          title: 'Payment Failed',
          description: res.payload?.message || 'Please try again.',
          status: 'error',
          duration: 5000,
        });
      }
    });
  };

  const handlePaymentError = () => {
    toast({
      title: 'Payment Error',
      description: 'PayPal payment failed. Please try again.',
      status: 'error',
      duration: 5000,
    });
  };

  if (paymentCompleted) {
    return (
      <PageLayout>
        <Flex justify='center' align='center' minH='60vh'>
          <PageCard p='40px' maxW='440px' w='100%' textAlign='center'>
            <Box w='80px' h='80px' borderRadius='full' bg='green.50'
              display='flex' alignItems='center' justifyContent='center'
              mx='auto' mb='24px'>
              <Icon as={MdCheckCircle} color='green.500' w='48px' h='48px' />
            </Box>
            <Text color={textColor} fontSize='xl' fontWeight='800' mb='8px'>
              Payment Successful!
            </Text>
            <Text color={subColor} fontSize='sm' mb='24px'>
              Redirecting to success page...
            </Text>
            <Spinner color='brand.500' />
          </PageCard>
        </Flex>
      </PageLayout>
    );
  }

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
                  Complete PayPal Payment
                </Text>
                <Text color='whiteAlpha.700' fontSize='sm'>Secured by PayPal</Text>
              </Box>
            </Flex>
          </Box>

          <PageCard p='28px'>
            {/* Order Summary */}
            <Text color={textColor} fontWeight='700' fontSize='md' mb='16px'>
              Order Summary
            </Text>
            {[
              { label: 'Service', value: dataInfo.serviceName || '—' },
              { label: 'Amount', value: dataInfo.total_money ? `$${Number(dataInfo.total_money).toLocaleString()}` : '—' },
              { label: 'Method', value: 'PayPal' },
            ].map((item, i) => (
              <Flex key={i} justify='space-between' py='12px'
                borderBottom='1px solid' borderColor={borderColor}>
                <Text color={subColor} fontSize='sm'>{item.label}</Text>
                <Text color={textColor} fontSize='sm' fontWeight='600'>{item.value}</Text>
              </Flex>
            ))}

            <Flex justify='space-between' align='center' py='16px' mb='24px'>
              <Text color={textColor} fontSize='sm' fontWeight='700'>Total Amount</Text>
              <Text color='brand.500' fontSize='xl' fontWeight='800'>
                ${Number(dataInfo.total_money || 0).toLocaleString()}
              </Text>
            </Flex>

            {/* PayPal Button */}
            {loading ? (
              <Flex justify='center' py='20px'><Spinner color='brand.500' /></Flex>
            ) : PaypalDemoKey ? (
              <Box borderRadius='12px' overflow='hidden'>
                <PayPalButton
                  amount={dataInfo.total_money}
                  currency='USD'
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  options={{ clientId: PaypalDemoKey }}
                />
              </Box>
            ) : (
              <Box p='16px' bg='orange.50' borderRadius='12px' textAlign='center'>
                <Text color='orange.700' fontSize='sm'>
                  PayPal is not configured. Please use manual payment.
                </Text>
                <Button mt='12px' size='sm' colorScheme='orange'
                  onClick={() => navigate(-1)}>
                  Go Back
                </Button>
              </Box>
            )}

            {/* Security note */}
            <Flex align='center' justify='center' gap='8px' mt='16px'>
              <Icon as={MdLock} color={subColor} w='14px' h='14px' />
              <Text color={subColor} fontSize='xs'>
                Your payment is secured by PayPal
              </Text>
            </Flex>
          </PageCard>
        </Box>
      </Flex>
    </PageLayout>
  );
}