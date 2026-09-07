import React from 'react';
import {
  Box, Flex, Text, Icon, SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdArrowUpward, MdInfo } from 'react-icons/md';
import { PageLayout, PageCard } from 'layouts/PageLayout';
import { useSelector } from 'react-redux';
import SaleForm from 'views/admin/sell/SalesForm';

export default function Sales() {
  const { user } = useSelector(state => state.authUser);
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const infoBg = useColorModeValue('blue.50', 'navy.700');
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    'linear-gradient(135deg, #3D2A00 0%, #2D1E00 100%)'
  );

  return (
    <PageLayout>
      {/* Banner */}
      <Box
        bg={bannerGrad}
        borderRadius='20px'
        p='24px'
        mb='24px'
        position='relative'
        overflow='hidden'>
        <Box position='absolute' top='-30px' right='-30px'
          w='120px' h='120px' borderRadius='full' bg='whiteAlpha.100' />
        <Flex align='center' gap='12px'>
          <Box w='44px' h='44px' borderRadius='12px'
            bg='whiteAlpha.200'
            display='flex' alignItems='center' justifyContent='center'>
            <Icon as={MdArrowUpward} color='white' w='24px' h='24px' />
          </Box>
          <Box>
            <Text color='white' fontSize='lg' fontWeight='800'>Sell Virtual Funds</Text>
            <Text color='whiteAlpha.800' fontSize='base'>
              Sell PayPal, Payoneer or Bitcoin at competitive rates
            </Text>
          </Box>
        </Flex>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap='20px'>
        {/* Form */}
        <PageCard p='28px'>
          <SaleForm />
        </PageCard>

        {/* Info */}
        <Flex direction='column' gap='16px'>
          <PageCard p='24px'>
            <Text color={textColor} fontSize='sm' fontWeight='700' mb='12px'>
              💡 How it works
            </Text>
            {[
              'Select your service type (PayPal, Payoneer, Bitcoin)',
              'Enter the amount you want to sell',
              'We calculate the Naira equivalent at current rate',
              'Submit and upload payment proof',
              'Admin approves and credits your wallet',
            ].map((step, i) => (
              <Flex key={i} align='flex-start' gap='10px' mb='12px'>
                <Box w='22px' h='22px' borderRadius='full'
                  bg='brand.500' display='flex' alignItems='center'
                  justifyContent='center' flexShrink='0'>
                  <Text color='white' fontSize='10px' fontWeight='800'>{i + 1}</Text>
                </Box>
                <Text color={subColor} fontSize='sm'>{step}</Text>
              </Flex>
            ))}
          </PageCard>

          <Box bg={infoBg} borderRadius='16px' p='16px'>
            <Flex align='center' gap='8px' mb='8px'>
              <Icon as={MdInfo} color='blue.500' w='18px' h='18px' />
              <Text color={textColor} fontSize='sm' fontWeight='700'>
                Current Balance
              </Text>
            </Flex>
            <Text color='brand.500' fontSize='xl' fontWeight='800'>
              ₦{Number(user?.userData?.amount || 0).toLocaleString()}
            </Text>
            <Text color={subColor} fontSize='sm' mt='4px'>
              Main wallet balance
            </Text>
          </Box>
        </Flex>
      </SimpleGrid>
    </PageLayout>
  );
}