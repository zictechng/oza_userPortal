import React from 'react';
import {
  Box, Flex, Text, Icon, SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdArrowDownward, MdInfo } from 'react-icons/md';
import { PageLayout, PageCard } from 'layouts/PageLayout';
import { useSelector } from 'react-redux';
import BuyForm from 'views/admin/buy/BuyForm';

export default function Buy() {
  const { user } = useSelector(state => state.authUser);
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const infoBg = useColorModeValue('green.50', 'navy.700');
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    'linear-gradient(135deg, #064E3B 0%, #022C22 100%)'
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
            <Icon as={MdArrowDownward} color='white' w='24px' h='24px' />
          </Box>
          <Box>
            <Text color='white' fontSize='lg' fontWeight='800'>Buy Virtual Funds</Text>
            <Text color='whiteAlpha.800' fontSize='base'>
              Buy PayPal, Payoneer or Bitcoin at great rates
            </Text>
          </Box>
        </Flex>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap='20px'>
        {/* Form */}
        <PageCard p='28px'>
          <BuyForm />
        </PageCard>

        {/* Info */}
        <Flex direction='column' gap='16px'>
          <PageCard p='24px'>
            <Text color={textColor} fontSize='sm' fontWeight='700' mb='12px'>
              💡 How it works
            </Text>
            {[
              'Select the service you want to buy',
              'Enter the dollar amount you need',
              'We show the Naira cost at current rates',
              'Fund your wallet and place the order',
              'Admin processes and delivers your funds',
            ].map((step, i) => (
              <Flex key={i} align='flex-start' gap='10px' mb='12px'>
                <Box w='22px' h='22px' borderRadius='full'
                  bg='green.500' display='flex' alignItems='center'
                  justifyContent='center' flexShrink='0'>
                  <Text color='white' fontSize='10px' fontWeight='800'>{i + 1}</Text>
                </Box>
                <Text color={subColor} fontSize='sm'>{step}</Text>
              </Flex>
            ))}
          </PageCard>

          <Box bg={infoBg} borderRadius='16px' p='16px'>
            <Flex align='center' gap='8px' mb='8px'>
              <Icon as={MdInfo} color='green.500' w='18px' h='18px' />
              <Text color={textColor} fontSize='sm' fontWeight='700'>
                Current Balance
              </Text>
            </Flex>
            <Text color='green.500' fontSize='xl' fontWeight='800'>
              ₦{Number(user?.userData?.amount || 0).toLocaleString()}
            </Text>
            <Text color={subColor} fontSize='sm' mt='4px'>
              Available to spend
            </Text>
          </Box>
        </Flex>
      </SimpleGrid>
    </PageLayout>
  );
}