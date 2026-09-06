import React from 'react';
import {
  Box, Flex, Text, Button, Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  MdArrowDownward, MdCurrencyExchange, MdAdd,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppContext } from 'contexts/AppContext';

export default function Banner() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.authUser);
  const { appName } = useAppContext();
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #4C5FD5 0%, #6C5CE7 100%)',
    'linear-gradient(135deg, #1E2C5A 0%, #2D3A6A 100%)'
  );

  return (
    <Flex
      direction='column'
      bg={bannerGrad}
      py={{ base: '28px', md: '48px' }}
      px={{ base: '24px', md: '48px' }}
      borderRadius='24px'
      position='relative'
      overflow='hidden'>
      <Box position='absolute' top='-30px' right='-30px'
        w='120px' h='120px' borderRadius='full' bg='whiteAlpha.100' />
      <Box position='absolute' bottom='-20px' right='80px'
        w='80px' h='80px' borderRadius='full' bg='whiteAlpha.100' />
      <Text fontSize={{ base: '22px', md: '28px' }} color='white'
        mb='8px' fontWeight='800' lineHeight='1.2' position='relative' zIndex='1'>
        {user?.appData?.app_launch_title || `Welcome to ${appName || ''}`}
      </Text>
      <Text fontSize='sm' color='whiteAlpha.800' mb='24px'
        maxW='480px' lineHeight='1.6' position='relative' zIndex='1'>
        The secure and profitable way to sell, buy and manage your virtual funds at attractive rates.
      </Text>
      <Flex gap='12px' flexWrap='wrap' position='relative' zIndex='1'>
        <Button
          bg='white' color='brand.500' fontWeight='700' fontSize='sm'
          borderRadius='12px' px='24px' h='44px'
          _hover={{ bg: 'whiteAlpha.900', transform: 'translateY(-1px)' }}
          transition='all 0.2s'
          onClick={() => navigate('/user/sales')}>
          Sell Funds
        </Button>
        <Button
          bg='whiteAlpha.200' color='white' fontWeight='700' fontSize='sm'
          borderRadius='12px' px='24px' h='44px'
          _hover={{ bg: 'whiteAlpha.300', transform: 'translateY(-1px)' }}
          transition='all 0.2s'
          onClick={() => navigate('/user/buy')}>
          Buy Funds
        </Button>
        <Button
          variant='outline' borderColor='whiteAlpha.500'
          color='white' fontWeight='700' fontSize='sm'
          borderRadius='12px' px='24px' h='44px'
          _hover={{ bg: 'whiteAlpha.200', transform: 'translateY(-1px)' }}
          transition='all 0.2s'
          onClick={() => navigate('/user/exchange-rate')}>
          Exchange Rates
        </Button>
      </Flex>
    </Flex>
  );
}