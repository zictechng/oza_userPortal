import React from 'react';
import {
  Box, Flex, Text, Icon, SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdSend, MdInfo, MdWarning } from 'react-icons/md';
import { PageLayout, PageCard } from 'layouts/PageLayout';
import { useSelector } from 'react-redux';
import SendFundForm from 'views/admin/sendFund/SendFundForm';

export default function SendFund() {
  const { user } = useSelector(state => state.authUser);
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const infoBg = useColorModeValue('purple.50', 'navy.700');
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    'linear-gradient(135deg, #2E1065 0%, #1E0A4A 100%)'
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
            <Icon as={MdSend} color='white' w='24px' h='24px' />
          </Box>
          <Box>
            <Text color='white' fontSize='lg' fontWeight='800'>Send Funds</Text>
            <Text color='whiteAlpha.800' fontSize='sm'>
              Transfer funds to another user by Tag ID
            </Text>
          </Box>
        </Flex>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap='20px'>
        {/* Form */}
        <PageCard p='28px'>
          <SendFundForm />
        </PageCard>

        {/* Info */}
        <Flex direction='column' gap='16px'>
          <Box bg={infoBg} borderRadius='16px' p='16px'>
            <Flex align='center' gap='8px' mb='8px'>
              <Icon as={MdSend} color='purple.500' w='18px' h='18px' />
              <Text color={textColor} fontSize='sm' fontWeight='700'>
                Available Balance
              </Text>
            </Flex>
            <Text color='purple.500' fontSize='xl' fontWeight='800'>
              ₦{Number(user?.userData?.amount || 0).toLocaleString()}
            </Text>
            <Text color={subColor} fontSize='sm' mt='4px'>Available to send</Text>
          </Box>

          <PageCard p='24px'>
            <Text color={textColor} fontSize='sm' fontWeight='700' mb='12px'>
              💡 How to send funds
            </Text>
            {[
              'Enter the recipient\'s 7-digit Tag ID',
              'We verify the recipient account',
              'Select the wallet type to send from',
              'Enter amount and confirm transfer',
              'Funds are transferred instantly',
            ].map((step, i) => (
              <Flex key={i} align='flex-start' gap='10px' mb='12px'>
                <Box w='22px' h='22px' borderRadius='full'
                  bg='purple.500' display='flex' alignItems='center'
                  justifyContent='center' flexShrink='0'>
                  <Text color='white' fontSize='10px' fontWeight='800'>{i + 1}</Text>
                </Box>
                <Text color={subColor} fontSize='sm'>{step}</Text>
              </Flex>
            ))}
          </PageCard>

          <PageCard p='24px'>
            <Flex align='center' gap='8px' mb='12px'>
              <Icon as={MdWarning} color='orange.400' w='18px' h='18px' />
              <Text color={textColor} fontSize='sm' fontWeight='700'>Warning</Text>
            </Flex>
            <Text color={subColor} fontSize='sm'>
              Transfers are instant and cannot be reversed.
              Always verify the recipient Tag ID before confirming.
            </Text>
          </PageCard>
        </Flex>
      </SimpleGrid>
    </PageLayout>
  );
}