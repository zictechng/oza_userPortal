import React from 'react';
import {
  Box, Flex, Text, Icon, SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdArrowDownward, MdInfo, MdSecurity } from 'react-icons/md';
import { PageLayout, PageCard } from 'layouts/PageLayout';
import { useSelector } from 'react-redux';
import WithdrawForm from 'views/admin/fundWithdraw/WithdrawaFundForm';

export default function Withdraw() {
  const { user } = useSelector(state => state.authUser);
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const infoBg = useColorModeValue('red.50', 'navy.700');
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    'linear-gradient(135deg, #450A0A 0%, #2D0707 100%)'
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
            <Text color='white' fontSize='lg' fontWeight='800'>Withdraw Funds</Text>
            <Text color='whiteAlpha.800' fontSize='base'>
              Withdraw to your registered bank account
            </Text>
          </Box>
        </Flex>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap='20px'>
        {/* Form */}
        <PageCard p='28px'>
          <WithdrawForm />
        </PageCard>

        {/* Info */}
        <Flex direction='column' gap='16px'>
          <Box bg={infoBg} borderRadius='16px' p='16px'>
            <Flex align='center' gap='8px' mb='8px'>
              <Icon as={MdArrowDownward} color='red.500' w='18px' h='18px' />
              <Text color={textColor} fontSize='sm' fontWeight='700'>
                Available Balance
              </Text>
            </Flex>
            <Text color='red.500' fontSize='xl' fontWeight='800'>
              ₦{Number(user?.userData?.amount || 0).toLocaleString()}
            </Text>
            <Text color={subColor} fontSize='xs' mt='4px'>Main wallet balance</Text>
          </Box>

          <PageCard p='24px'>
            <Flex align='center' gap='8px' mb='12px'>
              <Icon as={MdSecurity} color='brand.500' w='18px' h='18px' />
              <Text color={textColor} fontSize='sm' fontWeight='700'>
                Security Notice
              </Text>
            </Flex>
            {[
              'Your account PIN is required to authorize withdrawals',
              'Withdrawals are processed to your registered bank account only',
              'Processing time: 1-24 business hours after approval',
              'Contact support if you have not added a bank account yet',
            ].map((note, i) => (
              <Flex key={i} align='flex-start' gap='8px' mb='10px'>
                <Icon as={MdInfo} color='orange.400' w='16px' h='16px' mt='2px' flexShrink='0' />
                <Text color={subColor} fontSize='sm'>{note}</Text>
              </Flex>
            ))}
          </PageCard>
        </Flex>
      </SimpleGrid>
    </PageLayout>
  );
}