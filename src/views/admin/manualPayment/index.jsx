import React, { useState, useEffect } from 'react';
import {
  Box, Flex, Text, Button, Icon, SimpleGrid,
  useColorModeValue, Divider, useClipboard,
  Badge, Spinner,
} from '@chakra-ui/react';
import { MdContentCopy, MdCheck, MdAccountBalance, MdInfo } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanyBankInfo } from 'storeMtg/getCompanyBankInfoSlice';
import { getExchangeRate } from 'storeMtg/exchangeRateSlice';
import { PageLayout, PageCard } from 'layouts/PageLayout';

const BankCard = ({ bank, acctName, acctNumber, textColor, subColor, borderColor }) => {
  const { onCopy, hasCopied } = useClipboard(acctNumber || '');
  if (!bank) return null;
  return (
    <Box border='1px solid' borderColor={borderColor}
      borderRadius='16px' p='20px' mb='16px'>
      <Flex justify='space-between' align='center' mb='12px'>
        <Text color={textColor} fontSize='sm' fontWeight='700'>{bank}</Text>
        <Badge colorScheme='green' borderRadius='full' fontSize='10px'>Active</Badge>
      </Flex>
      <Divider borderColor={borderColor} mb='12px' />
      <Flex justify='space-between' py='6px'>
        <Text color={subColor} fontSize='xs'>Account Name</Text>
        <Text color={textColor} fontSize='xs' fontWeight='600'>{acctName}</Text>
      </Flex>
      <Flex justify='space-between' align='center' py='6px'>
        <Text color={subColor} fontSize='xs'>Account Number</Text>
        <Flex align='center' gap='8px'>
          <Text color={textColor} fontSize='sm' fontWeight='800' letterSpacing='1px'>
            {acctNumber}
          </Text>
          <Button size='xs' variant='ghost' color='brand.500'
            onClick={onCopy} leftIcon={<Icon as={hasCopied ? MdCheck : MdContentCopy} />}>
            {hasCopied ? 'Copied' : 'Copy'}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default function ManualPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { companyBank, dLoading } = useSelector(state => state.companyBankInfo);
  const { currentRate } = useSelector(state => state.exchangeRate);
  const { user } = useSelector(state => state.authUser);

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const infoBg = useColorModeValue('orange.50', 'navy.700');
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #4C5FD5 0%, #3D4EAA 100%)',
    'linear-gradient(135deg, #1E2C5A 0%, #111c44 100%)'
  );

  // Get amount from navigation state
  const amount = location.state?.amount || '';
  const serviceType = location.state?.serviceCategory || '';

  useEffect(() => {
    dispatch(getCompanyBankInfo());
    dispatch(getExchangeRate());
  }, [dispatch]);

  const nairaAmount = amount && currentRate?.paypal_buying
    ? Number(amount) * Number(currentRate.paypal_buying)
    : 0;

  return (
    <PageLayout>
      {/* Banner */}
      <Box bg={bannerGrad} borderRadius='20px' p='24px' mb='24px'
        position='relative' overflow='hidden'>
        <Box position='absolute' top='-30px' right='-30px'
          w='120px' h='120px' borderRadius='full' bg='whiteAlpha.100' />
        <Flex align='center' gap='12px' position='relative' zIndex='1'>
          <Box w='44px' h='44px' borderRadius='12px' bg='whiteAlpha.200'
            display='flex' alignItems='center' justifyContent='center'>
            <Icon as={MdAccountBalance} color='white' w='22px' h='22px' />
          </Box>
          <Box>
            <Text color='white' fontSize='lg' fontWeight='800'>Manual Bank Transfer</Text>
            <Text color='whiteAlpha.700' fontSize='sm'>
              Transfer to any of our accounts below
            </Text>
          </Box>
        </Flex>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap='20px'>
        {/* Bank Details */}
        <PageCard p='24px'>
          <Text color={textColor} fontWeight='700' fontSize='md' mb='4px'>
            Our Bank Accounts
          </Text>
          <Text color={subColor} fontSize='xs' mb='20px'>
            Transfer to any of the accounts below and upload your proof of payment
          </Text>

          {dLoading ? (
            <Flex justify='center' py='24px'><Spinner color='brand.500' /></Flex>
          ) : (
            <>
              <BankCard
                bank={companyBank?.company_bank1}
                acctName={companyBank?.company_acct_name1}
                acctNumber={companyBank?.company_acct_number1}
                textColor={textColor} subColor={subColor} borderColor={borderColor}
              />
              <BankCard
                bank={companyBank?.company_bank2}
                acctName={companyBank?.company_acct_name2}
                acctNumber={companyBank?.company_acct_number2}
                textColor={textColor} subColor={subColor} borderColor={borderColor}
              />
              <BankCard
                bank={companyBank?.company_bank3}
                acctName={companyBank?.company_acct_name3}
                acctNumber={companyBank?.company_acct_number3}
                textColor={textColor} subColor={subColor} borderColor={borderColor}
              />
            </>
          )}

          <Button
            w='100%' h='50px' mt='8px'
            bg='brand.500' color='white'
            borderRadius='12px' fontWeight='700'
            _hover={{ bg: 'brand.600' }}
            onClick={() => navigate('/user/payment-proof', { state: location.state })}>
            I Have Made Payment →
          </Button>
        </PageCard>

        {/* Info */}
        <Flex direction='column' gap='16px'>
          {/* Transaction Summary */}
          {amount && (
            <PageCard p='24px'>
              <Text color={textColor} fontWeight='700' fontSize='sm' mb='16px'>
                Transaction Summary
              </Text>
              {[
                { label: 'Service', value: serviceType || '—' },
                { label: 'Amount (USD)', value: `$${Number(amount).toLocaleString()}` },
                { label: 'Exchange Rate', value: `₦${Number(currentRate?.paypal_buying || 0).toLocaleString()}/$` },
                { label: 'You Pay (NGN)', value: `₦${nairaAmount.toLocaleString()}` },
              ].map((item, i) => (
                <Flex key={i} justify='space-between' py='10px'
                  borderBottom={i < 3 ? '1px solid' : 'none'} borderColor={borderColor}>
                  <Text color={subColor} fontSize='sm'>{item.label}</Text>
                  <Text color={i === 3 ? 'brand.500' : textColor}
                    fontSize='sm' fontWeight={i === 3 ? '800' : '600'}>
                    {item.value}
                  </Text>
                </Flex>
              ))}
            </PageCard>
          )}

          {/* Instructions */}
          <PageCard p='24px'>
            <Flex align='center' gap='8px' mb='12px'>
              <Icon as={MdInfo} color='orange.400' w='18px' h='18px' />
              <Text color={textColor} fontWeight='700' fontSize='sm'>
                Payment Instructions
              </Text>
            </Flex>
            {[
              'Transfer exact amount to any account above',
              'Use your Tag ID as payment narration',
              'Take a screenshot of your transfer receipt',
              'Click "I Have Made Payment" to upload proof',
              'Admin will verify and process within 1-24 hours',
            ].map((step, i) => (
              <Flex key={i} align='flex-start' gap='10px' mb='10px'>
                <Box w='20px' h='20px' borderRadius='full'
                  bg='brand.500' display='flex' alignItems='center'
                  justifyContent='center' flexShrink='0'>
                  <Text color='white' fontSize='10px' fontWeight='800'>{i + 1}</Text>
                </Box>
                <Text color={subColor} fontSize='sm'>{step}</Text>
              </Flex>
            ))}
          </PageCard>

          {/* Tag ID reminder */}
          <Box bg={infoBg} borderRadius='16px' p='16px'>
            <Text color={textColor} fontSize='xs' fontWeight='700' mb='4px'>
              Your Tag ID (Use as narration)
            </Text>
            <Text color='brand.500' fontSize='xl' fontWeight='800' letterSpacing='2px'>
              {user?.userData?.tag_id || '—'}
            </Text>
          </Box>
        </Flex>
      </SimpleGrid>
    </PageLayout>
  );
}