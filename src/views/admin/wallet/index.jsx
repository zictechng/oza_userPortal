import React, { useEffect } from 'react';
import {
  Box, Flex, SimpleGrid, Text, Button, Icon,
  useColorModeValue, Divider, Badge, Spinner,
  Stat, StatLabel, StatNumber, StatHelpText,
  Progress, Tooltip,
} from '@chakra-ui/react';
import {
  MdAdd, MdArrowDownward, MdArrowUpward,
  MdOutlineAccountBalanceWallet, MdCurrencyExchange,
  MdStar, MdOutlineWarning,
} from 'react-icons/md';
import { FiSend } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getPendingBonus, resetState } from 'storeMtg/pendingBonusSlice';
import { fetchProducts, clearProducts } from 'storeMtg/dashRecentRecordSlice';
import { PageLayout, PageCard } from 'layouts/PageLayout';

// ── Wallet balance card ───────────────────────────
const BalanceCard = ({ label, value, subValue, subLabel, icon, color, iconBg, actions }) => {
  const bg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');

  return (
    <Box
      bg={bg} borderRadius='20px' p='24px'
      border='1px solid' borderColor={borderColor}
      boxShadow='0 2px 8px rgba(0,0,0,0.08)'
      _hover={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)', transform: 'translateY(-2px)' }}
      transition='all 0.2s'>
      <Flex justify='space-between' align='flex-start' mb='16px'>
        <Box
          w='48px' h='48px' borderRadius='14px'
          bg={iconBg}
          display='flex' alignItems='center' justifyContent='center'>
          <Icon as={icon} color={color} w='24px' h='24px' />
        </Box>
        <Badge
          colorScheme='green' variant='subtle'
          borderRadius='full' fontSize='xs' px='10px'>
          Active
        </Badge>
      </Flex>
      <Text color={subColor} fontSize='xs' fontWeight='600'
        textTransform='uppercase' letterSpacing='0.5px' mb='6px'>
        {label}
      </Text>
      <Text color={textColor} fontSize='2xl' fontWeight='800' mb='4px'>
        {value}
      </Text>
      {subValue && (
        <Text color={subColor} fontSize='xs'>
          {subLabel}: {subValue}
        </Text>
      )}
      {actions && (
        <Flex gap='8px' mt='16px' flexWrap='wrap'>
          {actions}
        </Flex>
      )}
    </Box>
  );
};

export default function Wallet() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, userToken } = useSelector(state => state.authUser);
  const { recentData, status } = useSelector(state => state.recentTransaction);
  const { data: bonusData, dataLoading: bonusLoading } = useSelector(state => state.pendingBonus);

  const userData = user?.userData;

  const bg = useColorModeValue('gray.50', 'navy.900');
  const cardBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #4C5FD5 0%, #6C5CE7 100%)',
    'linear-gradient(135deg, #1E2C5A 0%, #2D3A6A 100%)'
  );

  const formatNaira = (val) => `₦${Number(val || 0).toLocaleString()}`;
  const formatDollar = (val) => `$${Number(val || 0).toLocaleString()}`;

  useEffect(() => {
    if (!userData?._id || !userToken) return;
    dispatch(fetchProducts({ userID: userData._id, user_token: userToken }));
    dispatch(getPendingBonus({ tag_id: userData?.tag_id, user_token: userToken }));
    return () => {
      dispatch(clearProducts());
      dispatch(resetState());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userData?._id, userToken]);

  const totalBalance = Number(userData?.amount || 0) + Number(userData?.all_bonus_acct || 0);

  // Calculate tx stats
  const txList = Array.isArray(recentData) ? recentData : [];
  const totalCredit = txList.filter(t => t.tran_type === 'Credit').reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalDebit = txList.filter(t => t.tran_type === 'Debit').reduce((s, t) => s + Number(t.amount || 0), 0);

  return (
    <PageLayout>

      {/* Total Balance Banner */}
      <Box
        bg={bannerGrad}
        borderRadius='24px'
        p={{ base: '24px', md: '32px' }}
        mb='24px'
        position='relative'
        overflow='hidden'>
        <Box position='absolute' top='-40px' right='-40px'
          w='160px' h='160px' borderRadius='full' bg='whiteAlpha.100' />
        <Box position='absolute' bottom='-30px' left='40px'
          w='100px' h='100px' borderRadius='full' bg='whiteAlpha.100' />

        <Flex justify='space-between' align='center' position='relative' zIndex='1'
          flexWrap='wrap' gap='16px'>
          <Box>
            <Text color='whiteAlpha.700' fontSize='sm' fontWeight='500' mb='4px'>
              Total Available Balance
            </Text>
            <Text color='white' fontSize={{ base: '32px', md: '42px' }} fontWeight='800' mb='8px'>
              {formatNaira(totalBalance)}
            </Text>
            <Text color='whiteAlpha.600' fontSize='xs'>
              Last updated: {moment().format('DD MMM YYYY, hh:mm A')}
            </Text>
          </Box>
          <Flex gap='10px' flexWrap='wrap'>
            <Button
              bg='white' color='brand.500' fontWeight='700'
              borderRadius='12px' size='sm' px='16px'
              leftIcon={<MdAdd />}
              _hover={{ bg: 'whiteAlpha.900' }}
              onClick={() => navigate('/user/fund-account')}>
              Fund
            </Button>
            <Button
              bg='whiteAlpha.200' color='white' fontWeight='700'
              borderRadius='12px' size='sm' px='16px'
              leftIcon={<MdArrowDownward />}
              _hover={{ bg: 'whiteAlpha.300' }}
              onClick={() => navigate('/user/withdraw')}>
              Withdraw
            </Button>
            <Button
              bg='whiteAlpha.200' color='white' fontWeight='700'
              borderRadius='12px' size='sm' px='16px'
              leftIcon={<FiSend />}
              _hover={{ bg: 'whiteAlpha.300' }}
              onClick={() => navigate('/user/send-fund')}>
              Transfer
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* Wallet Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap='16px' mb='24px'>
        <BalanceCard
          label='Main Wallet'
          value={formatNaira(userData?.amount)}
          subLabel='Available to use'
          icon={MdOutlineAccountBalanceWallet}
          color='#4C5FD5' iconBg='#EEF2FF'
          actions={[
            <Button key='fund' size='xs' colorScheme='brand' variant='solid'
              borderRadius='8px' onClick={() => navigate('/user/fund-account')}>
              Fund +
            </Button>,
            <Button key='withdraw' size='xs' colorScheme='brand' variant='outline'
              borderRadius='8px' onClick={() => navigate('/user/withdraw')}>
              Withdraw
            </Button>,
          ]}
        />
        <BalanceCard
          label='Bonus Wallet'
          value={formatNaira(userData?.all_bonus_acct)}
          subLabel='Withdrawable earnings'
          icon={MdStar}
          color='#10B981' iconBg='#D1FAE5'
          actions={[
            <Button key='w' size='xs' colorScheme='green' variant='solid'
              borderRadius='8px' onClick={() => navigate('/user/withdraw')}>
              Withdraw
            </Button>,
          ]}
        />
        <BalanceCard
          label='Signup Bonus'
          value={bonusLoading ? '...' : formatNaira(bonusData?.feedbackBonus || userData?.signup_account || 0)}
          subLabel='Pending activation'
          icon={MdOutlineWarning}
          color='#F59E0B' iconBg='#FEF3C7'
        />
        <BalanceCard
          label='All-time Volume'
          value={formatDollar(userData?.tran_account)}
          subLabel='Total transactions'
          icon={MdCurrencyExchange}
          color='#8B5CF6' iconBg='#EDE9FE'
        />
      </SimpleGrid>

      {/* Stats Row */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap='16px' mb='24px'>
        <Box bg={cardBg} borderRadius='16px' p='20px'
          border='1px solid' borderColor={borderColor}
          boxShadow='0 2px 8px rgba(0,0,0,0.08)'>
          <Stat>
            <StatLabel color={subColor} fontSize='xs' textTransform='uppercase' letterSpacing='0.5px'>Recent Credits</StatLabel>
            <StatNumber color='green.500' fontSize='xl' mt='4px'>{formatNaira(totalCredit)}</StatNumber>
            <StatHelpText color={subColor} fontSize='xs'>From recent transactions</StatHelpText>
          </Stat>
        </Box>
        <Box bg={cardBg} borderRadius='16px' p='20px'
          border='1px solid' borderColor={borderColor}
          boxShadow='0 2px 8px rgba(0,0,0,0.08)'>
          <Stat>
            <StatLabel color={subColor} fontSize='xs' textTransform='uppercase' letterSpacing='0.5px'>Recent Debits</StatLabel>
            <StatNumber color='red.500' fontSize='xl' mt='4px'>{formatNaira(totalDebit)}</StatNumber>
            <StatHelpText color={subColor} fontSize='xs'>From recent transactions</StatHelpText>
          </Stat>
        </Box>
        <Box bg={cardBg} borderRadius='16px' p='20px'
          border='1px solid' borderColor={borderColor}
          boxShadow='0 2px 8px rgba(0,0,0,0.08)'>
          <Stat>
            <StatLabel color={subColor} fontSize='xs' textTransform='uppercase' letterSpacing='0.5px'>Your Tag ID</StatLabel>
            <StatNumber color={textColor} fontSize='xl' mt='4px' fontFamily='monospace'>{userData?.tag_id || '—'}</StatNumber>
            <StatHelpText color={subColor} fontSize='xs'>Share to earn referral bonus</StatHelpText>
          </Stat>
        </Box>
      </SimpleGrid>

      {/* Recent Transactions */}
      <Box bg={cardBg} borderRadius='20px' p='20px'
        border='1px solid' borderColor={borderColor}
        boxShadow='0 2px 8px rgba(0,0,0,0.08)'>
        <Flex justify='space-between' align='center' mb='16px'>
          <Text color={textColor} fontWeight='700' fontSize='md'>Recent Transactions</Text>
          <Button size='sm' variant='ghost' color='brand.500' fontWeight='600'
            onClick={() => navigate('/user/history')}>
            View All →
          </Button>
        </Flex>

        {status === 'loading' ? (
          <Flex justify='center' py='32px'><Spinner color='brand.500' /></Flex>
        ) : txList.length === 0 ? (
          <Flex direction='column' align='center' py='32px' color={subColor}>
            <Icon as={MdOutlineAccountBalanceWallet} w='40px' h='40px' mb='8px' opacity={0.4} />
            <Text fontSize='sm'>No transactions yet</Text>
          </Flex>
        ) : (
          txList.slice(0, 6).map((tx, i) => (
            <Box key={tx._id || i}>
              <Flex align='center' py='12px'>
                <Box
                  w='40px' h='40px' borderRadius='12px'
                  bg={tx.tran_type === 'Credit' ? '#D1FAE5' : '#FEE2E2'}
                  display='flex' alignItems='center' justifyContent='center' mr='12px' flexShrink='0'>
                  <Icon
                    as={tx.tran_type === 'Credit' ? MdArrowDownward : MdArrowUpward}
                    color={tx.tran_type === 'Credit' ? 'green.500' : 'red.500'}
                    w='18px' h='18px'
                  />
                </Box>
                <Box flex='1' minW='0'>
                  <Text color={textColor} fontSize='sm' fontWeight='600' noOfLines={1}>
                    {tx.transac_nature || 'Transaction'}
                  </Text>
                  <Text color={subColor} fontSize='xs'>
                    {tx.creditOn ? moment(tx.creditOn).format('DD MMM YYYY, hh:mm A') : '—'}
                  </Text>
                </Box>
                <Text
                  fontSize='sm' fontWeight='700'
                  color={tx.tran_type === 'Credit' ? 'green.500' : 'red.500'}>
                  {tx.tran_type === 'Credit' ? '+' : '-'}₦{Number(tx.amount || 0).toLocaleString()}
                </Text>
              </Flex>
              {i < Math.min(txList.length, 6) - 1 && <Divider borderColor={borderColor} />}
            </Box>
          ))
        )}
      </Box>
    </PageLayout>
  );
}