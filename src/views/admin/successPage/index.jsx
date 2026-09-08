import React from 'react';
import {
  Box, Flex, Text, Button, Icon,
  useColorModeValue, SimpleGrid,
} from '@chakra-ui/react';
import { MdCheckCircle, MdHome, MdHistory } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageLayout, PageCard } from 'layouts/PageLayout';

export default function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(state => state.authUser);
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const isPaystack = location.state?.reference !== undefined;

  return (
    <PageLayout>
      <Flex justify='center' align='center' minH='60vh'>
        <PageCard p='40px' maxW='480px' w='100%' textAlign='center'>
          {/* Success Icon */}
          <Box
            w='80px' h='80px' borderRadius='full'
            bg='green.50' display='flex'
            alignItems='center' justifyContent='center'
            mx='auto' mb='24px'>
            <Icon as={MdCheckCircle} color='green.500' w='48px' h='48px' />
          </Box>

          <Text color={textColor} fontSize='2xl' fontWeight='800' mb='8px'>
            Transaction Successful! 🎉
          </Text>
          <Text color={subColor} fontSize='sm' mb='32px' lineHeight='1.6'>
            {isPaystack
              ? 'Your payment was verified and your wallet has been credited instantly.'
              : 'Your transaction has been submitted. Our team will process it shortly.'}
          </Text>

          {/* Balance */}
            <Box
            bg={useColorModeValue('brand.50', 'navy.700')}
            borderRadius='16px' p='16px' mb='32px'>
            <Text color={subColor} fontSize='xs' mb='4px'>
              {isPaystack ? 'Updated Balance' : 'Current Balance'}
            </Text>
            <Text color='brand.500' fontSize='xl' fontWeight='800'>
              ₦{Number(user?.userData?.amount || 0).toLocaleString()}
            </Text>
            {location.state?.reference && (
              <Text color={subColor} fontSize='xs' mt='4px'>
                Ref: {location.state.reference}
              </Text>
            )}
          </Box>

          <SimpleGrid columns={2} gap='12px'>
            <Button
              variant='outline' borderColor='brand.500' color='brand.500'
              borderRadius='12px' h='48px' fontWeight='700'
              leftIcon={<Icon as={MdHistory} />}
              _hover={{ bg: 'brand.50' }}
              onClick={() => navigate('/user/history')}>
              View History
            </Button>
            <Button
              bg='brand.500' color='white'
              borderRadius='12px' h='48px' fontWeight='700'
              leftIcon={<Icon as={MdHome} />}
              _hover={{ bg: 'brand.600' }}
              onClick={() => navigate('/user')}>
              Dashboard
            </Button>
          </SimpleGrid>
        </PageCard>
      </Flex>
    </PageLayout>
  );
}