import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Flex, Text, Button, Icon, SimpleGrid,
  useColorModeValue, Divider, useClipboard,
  Badge, Spinner, CircularProgress, CircularProgressLabel,
} from '@chakra-ui/react';
import { MdContentCopy, MdCheck, MdAccountBalance, MdInfo, MdWarning } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanyBankInfo } from 'storeMtg/getCompanyBankInfoSlice';
import { getExchangeRate } from 'storeMtg/exchangeRateSlice';
import { PageLayout, PageCard } from 'layouts/PageLayout';

const COUNTDOWN_MINUTES = 30;

// Card for PayPal, Payoneer, Bitcoin accounts
const PaymentAccountCard = ({ title, value, icon, textColor, subColor, borderColor }) => {
  const { onCopy, hasCopied } = useClipboard(value || '');
  if (!value) return null;
  return (
    <Box border='1px solid' borderColor={borderColor}
      borderRadius='16px' p='20px' mb='16px'>
      <Flex justify='space-between' align='center' mb='12px'>
        <Flex align='center' gap='8px'>
          <Text fontSize='20px'>{icon}</Text>
          <Text color={textColor} fontSize='sm' fontWeight='700'>{title}</Text>
        </Flex>
        <Badge colorScheme='green' borderRadius='full' fontSize='10px'>Active</Badge>
      </Flex>
      <Divider borderColor={borderColor} mb='12px' />
      <Flex justify='space-between' align='center' py='6px'>
        <Text color={subColor} fontSize='sm'>Account / Address</Text>
        <Flex align='center' gap='8px'>
          <Text color={textColor} fontSize='sm' fontWeight='700'
            maxW='200px' noOfLines={1}>
            {value}
          </Text>
          <Button size='sm' variant='ghost' color='brand.500'
            onClick={onCopy}
            leftIcon={<Icon as={hasCopied ? MdCheck : MdContentCopy} />}>
            {hasCopied ? 'Copied' : 'Copy'}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

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
        <Text color={subColor} fontSize='sm'>Account Name</Text>
        <Text color={textColor} fontSize='sm' fontWeight='600'>{acctName}</Text>
      </Flex>
      <Flex justify='space-between' align='center' py='6px'>
        <Text color={subColor} fontSize='sm'>Account Number</Text>
        <Flex align='center' gap='8px'>
          <Text color={textColor} fontSize='sm' fontWeight='800' letterSpacing='1px'>
            {acctNumber}
          </Text>
          <Button size='sm' variant='ghost' color='brand.500'
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
  const { data: bankInfo, cLoading: dLoading } = useSelector(state => state.companyBankInfo);
  const { data: currentRate } = useSelector(state => state.exchangeRate);
  const { user } = useSelector(state => state.authUser);

  const companyBank = bankInfo?.bankData;

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const infoBg = useColorModeValue('orange.50', 'navy.700');
  const timerBg = useColorModeValue('red.50', 'navy.700');
  const timerTrackColor = useColorModeValue('gray.100', 'navy.700');
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #4C5FD5 0%, #3D4EAA 100%)',
    'linear-gradient(135deg, #1E2C5A 0%, #111c44 100%)'
  );

  

  // Read state from navigation
    const {
    payment: amount,
    track_id: reference,
    type: serviceType,
    serviceCategory,
  } = location.state || {};

  const hasTransactionInfo = Boolean(amount);

  // Sales = user sends $ to company, Funding = user sends ₦ to company
    // Sales/Buy = user sends $ to company, Funding = user sends ₦ to company
  const isSales = serviceType === 'Sales';
  const isBuy = serviceType === 'Buy';
  const isDollarTransaction = isSales || isBuy;
  const currencySymbol = isDollarTransaction ? '$' : '₦';
  const amountLabel = isDollarTransaction ? 'Amount (USD)' : 'Amount to Transfer';
  const nairaEquivalent = isDollarTransaction && currentRate?.paypal_buying
    ? Number(amount) * Number(currentRate.paypal_buying)
    : null;

  // Countdown timer — 30 minutes
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_MINUTES * 60);
  const [timerExpired, setTimerExpired] = useState(false);


  // Timer color — declared after state so timerExpired is accessible
  const timerColor = timerExpired
    ? 'red.500'
    : timeLeft < 120
    ? 'red.400'
    : timeLeft < 300
    ? 'orange.400'
    : 'green.400';

  useEffect(() => {
    if (!hasTransactionInfo) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasTransactionInfo]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerPercent = (timeLeft / (COUNTDOWN_MINUTES * 60)) * 100;

  const nairaAmount = Number(amount || 0);
  // const dollarEquivalent = currentRate?.paypal_buying && nairaAmount > 0
  //   ? (nairaAmount / Number(currentRate.paypal_buying)).toFixed(2)
  //   : 0;

  useEffect(() => {
    dispatch(getCompanyBankInfo());
    dispatch(getExchangeRate());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap='20px' alignItems='start'>
        {/* Bank Details */}
        <PageCard p='24px'>
          <Text color={textColor} fontWeight='700' fontSize='md' mb='4px'>
            Our Bank Accounts
          </Text>
          <Text color={subColor} fontSize='sm' mb='20px'>
            Transfer to any of the accounts below and upload your proof of payment
          </Text>

          {dLoading ? (
            <Flex justify='center' py='24px'><Spinner color='brand.500' /></Flex>
          ) : isSales ? (
            // SELL — show company PayPal/Payoneer/Bitcoin account
            <>
              {serviceCategory?.toLowerCase().includes('paypal') && companyBank?.company_paypal_address && (
                <PaymentAccountCard
                  title='Company PayPal Account'
                  value={companyBank.company_paypal_address}
                  icon='💳'
                  textColor={textColor} subColor={subColor} borderColor={borderColor}
                />
              )}
              {serviceCategory?.toLowerCase().includes('payoneer') && companyBank?.company_payoneer_address && (
                <PaymentAccountCard
                  title='Company Payoneer Account'
                  value={companyBank.company_payoneer_address}
                  icon='💰'
                  textColor={textColor} subColor={subColor} borderColor={borderColor}
                />
              )}
              {serviceCategory?.toLowerCase().includes('bitcoin') && companyBank?.company_btc_address && (
                <PaymentAccountCard
                  title='Company Bitcoin Wallet'
                  value={companyBank.company_btc_address}
                  icon='₿'
                  textColor={textColor} subColor={subColor} borderColor={borderColor}
                />
              )}
              {/* Fallback if no match */}
              {!companyBank?.company_paypal_address &&
               !companyBank?.company_payoneer_address &&
               !companyBank?.company_btc_address && (
                <Box p='16px' bg='orange.50' borderRadius='12px'
                  border='1px solid' borderColor='orange.200'>
                  <Text color='orange.700' fontSize='sm' fontWeight='600'>
                    Payment details not configured yet
                  </Text>
                  <Text color='orange.600' fontSize='xs' mt='4px'>
                    Please contact support for payment account details.
                  </Text>
                </Box>
              )}
            </>
          ) : (
            // FUNDING/BUY — show bank accounts
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
              {companyBank?.company_momoAccount && (
                <Box border='1px solid' borderColor={borderColor}
                  borderRadius='16px' p='20px' mb='16px'>
                  <Flex justify='space-between' align='center' mb='12px'>
                    <Text color={textColor} fontSize='sm' fontWeight='700'>
                      Mobile Money (MoMo)
                    </Text>
                    <Badge colorScheme='green' borderRadius='full' fontSize='10px'>Active</Badge>
                  </Flex>
                  <Divider borderColor={borderColor} mb='12px' />
                  <Flex justify='space-between' align='center' py='6px'>
                    <Text color={subColor} fontSize='xs'>MoMo Number</Text>
                    <Flex align='center' gap='8px'>
                      <Text color={textColor} fontSize='sm' fontWeight='800' letterSpacing='1px'>
                        {companyBank?.company_momoAccount}
                      </Text>
                      <Button size='xs' variant='ghost' color='brand.500'
                        onClick={() => navigator.clipboard.writeText(companyBank?.company_momoAccount)}>
                        Copy
                      </Button>
                    </Flex>
                  </Flex>
                </Box>
              )}
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

        {/* Right Panel */}
        <Flex direction='column' gap='16px'>

          {/* Countdown Timer */}
          {hasTransactionInfo && (
            <PageCard p='24px' border='2px solid'
              borderColor={timerExpired ? 'red.400' : timeLeft < 300 ? 'orange.400' : borderColor}>
              <Flex align='center' gap='16px'>
                <CircularProgress
                  value={timerPercent}
                  color={timerColor}
                  trackColor={timerTrackColor}
                  size='100px'
                  thickness='10px'>
                  <CircularProgressLabel>
                    <Text fontSize='sm' fontWeight='800' color={textColor}>
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </Text>
                    <Text fontSize='8px' color={subColor}>min:sec</Text>
                  </CircularProgressLabel>
                </CircularProgress>
                <Box>
                  {timerExpired ? (
                    <>
                      <Text color='red.500' fontSize='sm' fontWeight='800'>
                        ⚠️ Payment Time Expired!
                      </Text>
                      <Text color={subColor} fontSize='xs' mt='4px'>
                        Please start a new transaction or contact support.
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        Time Remaining
                      </Text>
                      <Text color={subColor} fontSize='sm' mt='4px'>
                        Complete your transfer within this time to avoid cancellation.
                      </Text>
                      {timeLeft < 300 && (
                        <Badge colorScheme='orange' borderRadius='full' mt='4px' fontSize='10px'>
                          Hurry! Less than 5 minutes left
                        </Badge>
                      )}
                    </>
                  )}
                </Box>
              </Flex>
            </PageCard>
          )}

          {/* Transaction Summary */}
          {hasTransactionInfo ? (
            <PageCard p='24px'>
              <Text color={textColor} fontWeight='700' fontSize='sm' mb='16px'>
                Transaction Summary
              </Text>
              {[
                { label: 'Type', value: serviceType || 'Account Funding' },
                { label: 'Service', value: serviceCategory || 'Manual Transfer' },
                { label: amountLabel, value: `${currencySymbol}${Number(amount || 0).toLocaleString()}`, highlight: true },
                ...(isDollarTransaction && nairaEquivalent ? [{ label: 'NGN Equivalent', value: `₦${nairaEquivalent.toLocaleString()}` }] : []),
                { label: 'Reference', value: reference || '—' },
              ].map((item, i, arr) => (
                <Flex key={i} justify='space-between' py='12px'
                  borderBottom={i < arr.length - 1 ? '1px solid' : 'none'}
                  borderColor={borderColor}>
                  <Text color={subColor} fontSize='sm'>{item.label}</Text>
                  <Text
                    color={item.highlight ? 'brand.500' : textColor}
                    fontSize={item.highlight ? 'md' : 'sm'}
                    fontWeight={item.highlight ? '800' : '600'}>
                    {item.value}
                  </Text>
                </Flex>
              ))}
            </PageCard>
          ) : (
            <PageCard p='20px'>
              <Flex align='center' gap='8px'>
                <Icon as={MdInfo} color='blue.400' w='18px' h='18px' />
                <Text color={subColor} fontSize='sm'>
                  Transaction details will appear here when you arrive from a payment flow.
                </Text>
              </Flex>
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
                          {(isSales ? [
              `Send $${Number(amount || 0).toLocaleString()} to our ${serviceCategory} account`,
              'Use your Tag ID as payment narration/note',
              'Take a screenshot of your transfer receipt',
              'Click "I Have Made Payment" to upload proof',
              'Admin will verify and credit your NGN wallet within 1-24 hours',
            ] : isBuy ? [
              `Transfer ₦${nairaEquivalent ? nairaEquivalent.toLocaleString() : '—'} to any account on the left`,
              'Use your Tag ID as payment narration',
              'Take a screenshot of your transfer receipt',
              'Click "I Have Made Payment" to upload proof',
              'Admin will verify and deliver your funds within 1-24 hours',
            ] : [
              'Transfer exact amount to any account on the left',
              'Use your Tag ID as payment narration',
              'Take a screenshot of your transfer receipt',
              'Click "I Have Made Payment" to upload proof',
              'Admin will verify and process within 1-24 hours',
            ]).map((step, i) => (
              <Flex key={i} align='flex-start' gap='10px' mb='10px'>
                <Box w='20px' h='20px' borderRadius='full'
                  bg='brand.500' display='flex' alignItems='center'
                  justifyContent='center' flexShrink='0'>
                  <Text color='white' fontSize='13px' fontWeight='800'>{i + 1}</Text>
                </Box>
                <Text color={subColor} fontSize='sm'>{step}</Text>
              </Flex>
            ))}
          </PageCard>

          {/* Tag ID reminder */}
          <Box bg={infoBg} borderRadius='16px' p='16px'>
            <Text color={textColor} fontSize='sm' fontWeight='700' mb='4px'>
              Your Tag ID (Use as payment narration)
            </Text>
            <Text color='brand.500' fontSize='xl' fontWeight='800' letterSpacing='2px'>
              {user?.userData?.tag_id || '—'}
            </Text>
            {isDollarTransaction && (
              <Text color={subColor} fontSize='xs' mt='8px'>
                {isSales
                  ? `Send $${Number(amount || 0).toLocaleString()} to our ${serviceCategory} account and use your Tag ID as narration`
                  : `Fund your order of $${Number(amount || 0).toLocaleString()} via manual transfer`}
              </Text>
            )}
          </Box>
        </Flex>
      </SimpleGrid>
    </PageLayout>
  );
}