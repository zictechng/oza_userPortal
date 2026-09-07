import React, { useEffect } from 'react';
import {
  Box, Flex, Text, Icon, SimpleGrid,
  useColorModeValue, Divider, Spinner,
} from '@chakra-ui/react';
import { MdCurrencyExchange, MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { getExchangeRate } from 'storeMtg/exchangeRateSlice';
import { PageLayout, PageCard } from 'layouts/PageLayout';

const RateRow = ({ label, buyRate, sellRate, icon, color, borderColor, textColor, subColor }) => (
  <Box>
    <Flex align='center' justify='space-between' py='16px'>
      <Flex align='center' gap='12px'>
        <Box w='40px' h='40px' borderRadius='12px'
          bg={`${color}15`}
          display='flex' alignItems='center' justifyContent='center'>
          <Icon as={icon} color={color} w='20px' h='20px' />
        </Box>
        <Text color={textColor} fontSize='sm' fontWeight='700'>{label}</Text>
      </Flex>
      <Flex gap='32px'>
        <Box textAlign='right'>
          <Text color={subColor} fontSize='xs' mb='2px'>We Buy</Text>
          <Text color='green.500' fontSize='sm' fontWeight='700'>
            ₦{Number(buyRate || 0).toLocaleString()}/$
          </Text>
        </Box>
        <Box textAlign='right'>
          <Text color={subColor} fontSize='xs' mb='2px'>We Sell</Text>
          <Text color='red.500' fontSize='sm' fontWeight='700'>
            ₦{Number(sellRate || 0).toLocaleString()}/$
          </Text>
        </Box>
      </Flex>
    </Flex>
    <Divider borderColor={borderColor} />
  </Box>
);

export default function ExchangeRate() {
  const dispatch = useDispatch();
  const { data: currentRate, dataLoading } = useSelector(state => state.exchangeRate);

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #4C5FD5 0%, #6C5CE7 100%)',
    'linear-gradient(135deg, #1E2C5A 0%, #2D3A6A 100%)'
  );

  useEffect(() => {
    dispatch(getExchangeRate());
  }, [dispatch]);

  const services = [
    { label: 'PayPal', buy: currentRate?.paypal_buying, sell: currentRate?.paypal_selling, icon: MdCurrencyExchange, color: '#4C5FD5' },
    { label: 'Payoneer', buy: currentRate?.payoneer_buying, sell: currentRate?.payoneer_selling, icon: MdCurrencyExchange, color: '#10B981' },
    { label: 'Bitcoin', buy: currentRate?.btc_buying, sell: currentRate?.btc_selling, icon: MdCurrencyExchange, color: '#F59E0B' },
  ];

  return (
    <PageLayout>
      {/* Banner */}
      <Box bg={bannerGrad} borderRadius='20px' p='28px' mb='24px'
        position='relative' overflow='hidden'>
        <Box position='absolute' top='-40px' right='-40px'
          w='150px' h='150px' borderRadius='full' bg='whiteAlpha.100' />
        <Flex align='center' gap='12px' position='relative' zIndex='1'>
          <Box w='48px' h='48px' borderRadius='14px' bg='whiteAlpha.200'
            display='flex' alignItems='center' justifyContent='center'>
            <Icon as={MdCurrencyExchange} color='white' w='24px' h='24px' />
          </Box>
          <Box>
            <Text color='white' fontSize='xl' fontWeight='800'>Exchange Rates</Text>
            <Text color='whiteAlpha.700' fontSize='sm'>
              Live rates for PayPal, Payoneer and Bitcoin
            </Text>
          </Box>
        </Flex>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap='20px'>
        {/* Rates Card */}
        <PageCard p='24px'>
          <Text color={textColor} fontWeight='700' fontSize='md' mb='4px'>
            Current Exchange Rates
          </Text>
          <Text color={subColor} fontSize='xs' mb='20px'>
            Rates are updated regularly. Contact support for bulk rates.
          </Text>

          {dataLoading ? (
            <Flex justify='center' py='32px'><Spinner color='brand.500' /></Flex>
          ) : (
            services.map((s, i) => (
              <RateRow key={i} label={s.label}
                buyRate={s.buy} sellRate={s.sell}
                icon={s.icon} color={s.color}
                borderColor={borderColor}
                textColor={textColor} subColor={subColor}
              />
            ))
          )}
        </PageCard>

        {/* Info Card */}
        <Flex direction='column' gap='16px'>
          <PageCard p='24px'>
            <Text color={textColor} fontWeight='700' fontSize='md' mb='16px'>
              Rate Guide
            </Text>
            {[
              { icon: MdArrowDownward, color: 'green.500', bg: 'green.50', label: 'We Buy', desc: 'Rate we pay when you sell to us' },
              { icon: MdArrowUpward, color: 'red.500', bg: 'red.50', label: 'We Sell', desc: 'Rate you pay when buying from us' },
            ].map((item, i) => (
              <Flex key={i} align='center' gap='12px' mb='16px'>
                <Box w='40px' h='40px' borderRadius='12px'
                  bg={item.bg}
                  display='flex' alignItems='center' justifyContent='center'>
                  <Icon as={item.icon} color={item.color} w='20px' h='20px' />
                </Box>
                <Box>
                  <Text color={textColor} fontSize='sm' fontWeight='700'>{item.label}</Text>
                  <Text color={subColor} fontSize='xs'>{item.desc}</Text>
                </Box>
              </Flex>
            ))}
          </PageCard>

          <PageCard p='24px'>
            <Text color={textColor} fontWeight='700' fontSize='sm' mb='12px'>
              💡 Important Notes
            </Text>
            {[
              'Rates change regularly based on market conditions',
              'Final rate is confirmed at time of transaction',
              'Contact support for large volume trades',
              'All transactions are processed same business day',
            ].map((note, i) => (
              <Flex key={i} align='flex-start' gap='8px' mb='10px'>
                <Box w='6px' h='6px' borderRadius='full'
                  bg='brand.500' mt='6px' flexShrink='0' />
                <Text color={subColor} fontSize='sm'>{note}</Text>
              </Flex>
            ))}
          </PageCard>
        </Flex>
      </SimpleGrid>
    </PageLayout>
  );
}