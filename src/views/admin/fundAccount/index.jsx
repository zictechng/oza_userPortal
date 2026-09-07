import React from 'react';
import {
  Box, Flex, Text, Icon, SimpleGrid,
  useColorModeValue, Divider,
} from '@chakra-ui/react';
import { MdAdd, MdInfo, MdAccountBalance } from 'react-icons/md';
import { PageLayout, PageCard } from 'layouts/PageLayout';
import { useSelector } from 'react-redux';
import FundAccountForm from 'views/admin/fundAccount/FundAccountForm';

export default function FundAccount() {
  const { user } = useSelector(state => state.authUser);
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const infoBg = useColorModeValue('brand.50', 'navy.700');
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #4C5FD5 0%, #3D4EAA 100%)',
    'linear-gradient(135deg, #1E2C5A 0%, #111c44 100%)'
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
            <Icon as={MdAdd} color='white' w='24px' h='24px' />
          </Box>
          <Box>
            <Text color='white' fontSize='lg' fontWeight='800'>Fund Your Account</Text>
            <Text color='whiteAlpha.800' fontSize='base'>
              Add money to your wallet via PayStack or manual transfer
            </Text>
          </Box>
        </Flex>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap='20px'>
        {/* Form */}
        <PageCard p='28px'>
          <FundAccountForm />
        </PageCard>

        {/* Info */}
        <Flex direction='column' gap='16px'>
          <Box bg={infoBg} borderRadius='16px' p='16px'>
            <Flex align='center' gap='8px' mb='8px'>
              <Icon as={MdAccountBalance} color='brand.500' w='18px' h='18px' />
              <Text color={textColor} fontSize='sm' fontWeight='700'>
                Current Balance
              </Text>
            </Flex>
            <Text color='brand.500' fontSize='xl' fontWeight='800'>
              ₦{Number(user?.userData?.amount || 0).toLocaleString()}
            </Text>
            <Text color={subColor} fontSize='xs' mt='4px'>Main wallet</Text>
          </Box>

          <PageCard p='24px'>
            <Text color={textColor} fontSize='sm' fontWeight='700' mb='12px'>
              💡 Payment Methods
            </Text>
            {[
              { method: 'PayStack', desc: 'Instant funding via card or bank transfer' },
              { method: 'Manual Transfer', desc: 'Transfer to our bank account and upload proof' },
            ].map((item, i) => (
              <Box key={i}>
                <Flex align='flex-start' gap='10px' py='12px'>
                  <Box w='8px' h='8px' borderRadius='full'
                    bg='brand.500' mt='6px' flexShrink='0' />
                  <Box>
                    <Text color={textColor} fontSize='sm' fontWeight='600'>{item.method}</Text>
                    <Text color={subColor} fontSize='sm'>{item.desc}</Text>
                  </Box>
                </Flex>
                {i === 0 && <Divider borderColor={borderColor} />}
              </Box>
            ))}
          </PageCard>

          <PageCard p='24px'>
            <Text color={textColor} fontSize='sm' fontWeight='700' mb='12px'>
              ⚠️ Important Notes
            </Text>
            {[
              'Minimum funding amount applies',
              'PayStack payments reflect instantly',
              'Manual transfers require admin approval',
              'Keep your payment receipt for reference',
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