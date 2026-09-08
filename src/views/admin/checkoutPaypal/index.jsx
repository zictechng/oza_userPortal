import React, { useState } from 'react';
import {
  Box, Flex, Text, Icon, Button,
  useColorModeValue, Spinner,
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
  const { user } = useSelector(state => state.authUser);

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #003087 0%, #009cde 100%)',
    'linear-gradient(135deg, #001A4D 0%, #003D6B 100%)'
  );
  const bannerBg = useColorModeValue('#003087', '#001A4D');

  // State from sell form navigation
  const {
    amount,       // dollar amount user entered e.g. 25
    total_money,  // naira equivalent e.g. 31250
    serviceName,
    serviceCategory,
    sell_note,
    method,
    serviceType,
  } = location.state || {};

  // ── ORIGINAL WORKING FUNCTIONS — NOT CHANGED ──────────

  const handlePaymentSuccess = (details, data) => {
    setLoading(true);
    const captureData = {
      payerId: data.payerID,
      orderID: data.orderID,
      amount: amount,
      serviceName: serviceName,
      serviceCategory: serviceCategory || 'Exchange',
      sell_note: sell_note,
      method: method,
      myId: user?.userData?._id,
      total_money: total_money,
      serviceType: serviceType,
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

  // ── SUCCESS STATE ─────────────────────────────────────

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

  // ── MAIN UI ───────────────────────────────────────────

  return (
    <PageLayout>
      <Flex justify='center'>
        <Box maxW='480px' w='100%'>
          {/* Banner */}
          <Box
            bg={bannerBg}
            bgGradient={bannerGrad}
            borderRadius='20px' p='24px' mb='24px'
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
                <Text color='whiteAlpha.700' fontSize='sm'>
                  Secured by PayPal
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
              { label: 'Service', value: serviceName || serviceType || '—' },
              { label: 'You Send (USD)', value: `$${Number(amount || 0).toLocaleString()}` },
              { label: 'You Receive (NGN)', value: `₦${Number(total_money || 0).toLocaleString()}` },
              { label: 'Method', value: 'PayPal' },
            ].map((item, i) => (
              <Flex key={i} justify='space-between' py='12px'
                borderBottom='1px solid' borderColor={borderColor}>
                <Text color={subColor} fontSize='sm'>{item.label}</Text>
                <Text color={textColor} fontSize='sm' fontWeight='600'>
                  {item.value}
                </Text>
              </Flex>
            ))}

            {/* PayPal amount to charge */}
            <Flex justify='space-between' align='center' py='16px' mb='24px'>
              <Text color={textColor} fontSize='sm' fontWeight='700'>
                Amount to Pay (USD)
              </Text>
              <Text color='brand.500' fontSize='xl' fontWeight='800'>
                ${Number(amount || 0).toLocaleString()}
              </Text>
            </Flex>

            {/* PayPal Button */}
            {loading ? (
              <Flex justify='center' py='20px'>
                <Spinner color='brand.500' />
              </Flex>
            ) : PaypalDemoKey ? (
              <Box>
                <style>{`
                  .paypal-button-container {
                    border-radius: 12px;
                    overflow: hidden;
                  }
                `}</style>
                <Box className='paypal-button-container'>
                  <PayPalButton
                    amount={amount}
                    currency='USD'
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    options={{ clientId: PaypalDemoKey }}
                  />
                </Box>
              </Box>
            ) : (
              <Box p='16px' bg='orange.50' borderRadius='12px' textAlign='center'>
                <Text color='orange.700' fontSize='sm' fontWeight='600' mb='8px'>
                  PayPal is not configured
                </Text>
                <Text color='orange.600' fontSize='sm' mb='12px'>
                  Please use manual payment instead
                </Text>
                <Button size='sm' colorScheme='orange'
                  onClick={() => navigate(-1)}>
                  Go Back
                </Button>
              </Box>
            )}

            {/* Security badges */}
            <Flex align='center' justify='center' gap='8px' mt='16px' flexWrap='wrap'>
              <Flex align='center' gap='4px'>
                <Icon as={MdLock} color='green.500' w='14px' h='14px' />
                <Text color={subColor} fontSize='xs'>SSL Secured</Text>
              </Flex>
              <Text color={subColor} fontSize='xs'>•</Text>
              <Text color={subColor} fontSize='xs'>256-bit encryption</Text>
              <Text color={subColor} fontSize='xs'>•</Text>
              <Text color={subColor} fontSize='xs'>Powered by PayPal</Text>
            </Flex>
          </PageCard>
        </Box>
      </Flex>
    </PageLayout>
  );
}