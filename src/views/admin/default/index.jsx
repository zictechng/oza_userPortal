import React, { useEffect, useState } from 'react';
import {
  Box, Flex, SimpleGrid, Text, Button, Icon,
  useColorModeValue, Avatar, Badge, Spinner,
  Alert, AlertIcon, AlertDescription, CloseButton,
  Grid, GridItem, Stat, StatLabel, StatNumber,
  StatHelpText, Divider, IconButton, Tooltip,
} from '@chakra-ui/react';
import {
  MdAdd, MdArrowDownward, MdArrowUpward,
  MdCurrencyExchange, MdOutlineAccountBalanceWallet,
  MdOutlineWarning, MdCheckCircle, MdRefresh,
} from 'react-icons/md';
import {
  FiSend, FiPhone, FiZap, FiTv, FiFileText,
  FiWifi,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useAppContext } from 'contexts/AppContext';
import { fetchProducts, clearProducts } from 'storeMtg/dashRecentRecordSlice';
import { getPendingBonus, resetState } from 'storeMtg/pendingBonusSlice';
import { PageLayout, PageCard } from 'layouts/PageLayout';

// ── Reusable wallet card
const WalletCard = ({ label, value, icon, color, iconBg, action, actionLabel, onAction }) => {
  const bg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box
      bg={bg}
      borderRadius='20px'
      p='20px'
      boxShadow='0 2px 8px rgba(0,0,0,0.08)'
      _hover={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)', transform: 'translateY(-2px)' }}
      transition='all 0.2s'>
      <Flex justify='space-between' align='flex-start' mb='12px'>
        <Box
          w='44px' h='44px' borderRadius='12px'
          bg={iconBg}
          display='flex' alignItems='center' justifyContent='center'>
          <Icon as={icon} color={color} w='22px' h='22px' />
        </Box>
        {action && (
          <Button
            size='sm'
            variant='ghost'
            color={color}
            borderRadius='10px'
            fontSize='xs'
            fontWeight='600'
            onClick={onAction}
            _hover={{ bg: iconBg }}>
            {actionLabel}
          </Button>
        )}
      </Flex>
      <Text color={subColor} fontSize='xs' fontWeight='600' mb='4px' textTransform='uppercase' letterSpacing='0.5px'>
        {label}
      </Text>
      <Text color={textColor} fontSize='xl' fontWeight='800'>
        {value}
      </Text>
    </Box>
  );
};

// ── Quick action button
const QuickAction = ({ icon, label, color, iconBg, onClick }) => {
  const textColor = useColorModeValue('gray.600', 'gray.300');
  return (
    <Flex
      direction='column' align='center' gap='8px'
      cursor='pointer' onClick={onClick}
      _hover={{ transform: 'translateY(-2px)' }}
      transition='all 0.2s'>
      <Box
        w='52px' h='52px' borderRadius='16px'
        bg={iconBg}
        display='flex' alignItems='center' justifyContent='center'
        shadow='sm'>
        <Icon as={icon} color={color} w='24px' h='24px' />
      </Box>
      <Text fontSize='xs' fontWeight='600' color={textColor} textAlign='center'>
        {label}
      </Text>
    </Flex>
  );
};

// ── Transaction status color
const txStatusColor = (status) => {
  const s = status?.toLowerCase();
  if (s === 'completed' || s === 'successful') return 'green';
  if (s === 'pending') return 'orange';
  if (s === 'failed') return 'red';
  return 'gray';
};

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appName } = useAppContext();

  const { user, userToken } = useSelector(state => state.authUser);
  const { recentData, status } = useSelector(state => state.recentTransaction);
  const { data: bonusData, dataLoading: bonusLoading } = useSelector(state => state.pendingBonus);

  const userData = user?.userData;
  const [showProfileAlert, setShowProfileAlert] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const bg = useColorModeValue('gray.50', 'navy.900');
  const cardBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const alertBg = useColorModeValue('#FFF7ED', '#3D2A00');
  const alertBorderColor = useColorModeValue('orange.200', 'orange.800');
  const hoverBg = useColorModeValue('gray.50', 'navy.700');
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #4C5FD5 0%, #3D4EAA 60%, #6C5CE7 100%)',
    'linear-gradient(135deg, #1E2C5A 0%, #2D3A6A 60%, #3D2C6A 100%)'
  );

    const allStepsDone =
    userData?.reg_stage2 === 'Yes' &&
    userData?.reg_stage3 === 'Yes' &&
    userData?.reg_stage4 === 'Yes' &&
    userData?.reg_stage5 === 'Yes' &&
    userData?.reg_stage6 === 'Yes';

  const isProfileComplete = allStepsDone;

  const fetchData = () => {
    if (!userData?._id || !userToken) return;
    dispatch(fetchProducts({ userID: userData._id, user_token: userToken }));
    dispatch(getPendingBonus({ tag_id: userData?.tag_id, user_token: userToken }));
  };

  useEffect(() => {
    fetchData();
    return () => {
      dispatch(clearProducts());
      dispatch(resetState());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userData?._id, userToken]);

  const handleRefresh = async () => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Format currency
  const formatNaira = (val) => `₦${Number(val || 0).toLocaleString()}`;
  const formatDollar = (val) => `$${Number(val || 0).toLocaleString()}`;

  // Quick actions
  const quickActions = [
    { icon: MdAdd, label: 'Fund Account', color: '#4C5FD5', iconBg: '#EEF2FF', path: '/user/fund-account' },
    { icon: MdArrowDownward, label: 'Withdraw', color: '#10B981', iconBg: '#D1FAE5', path: '/user/withdraw' },
    { icon: MdArrowUpward, label: 'Sell', color: '#F59E0B', iconBg: '#FEF3C7', path: '/user/sales' },
    { icon: MdCurrencyExchange, label: 'Buy', color: '#8B5CF6', iconBg: '#EDE9FE', path: '/user/buy' },
    { icon: FiPhone, label: 'Airtime', color: '#EF4444', iconBg: '#FEE2E2', path: '/user/bills/airtime' },
    { icon: FiWifi, label: 'Data', color: '#3B82F6', iconBg: '#DBEAFE', path: '/user/bills/data' },
    { icon: FiZap, label: 'Electricity', color: '#F59E0B', iconBg: '#FEF3C7', path: '/user/bills/electricity' },
    { icon: FiTv, label: 'TV Sub', color: '#10B981', iconBg: '#D1FAE5', path: '/user/bills/tv' },
    { icon: FiFileText, label: 'Exam Cards', color: '#8B5CF6', iconBg: '#EDE9FE', path: '/user/bills/exam-cards' },
  ];

  return (
      <PageLayout>

      {/* Header */}
      <Flex justify='space-between' align='center' mb='24px'>
        <Box>
          <Text color={subColor} fontSize='sm' fontWeight='500'>
            {moment().format('dddd, DD MMMM YYYY')}
          </Text>
          <Text color={textColor} fontSize='xl' fontWeight='800'>
            Welcome back, {userData?.display_name?.split(' ')[0] || 'there'} 👋
          </Text>
        </Box>
        <Tooltip label='Refresh'>
          <IconButton
            icon={<MdRefresh />}
            variant='ghost'
            borderRadius='12px'
            isLoading={refreshing}
            onClick={handleRefresh}
            aria-label='Refresh'
          />
        </Tooltip>
      </Flex>

      {/* Incomplete Profile Alert */}
      {!isProfileComplete && showProfileAlert && (
        <Alert
          status='warning'
          borderRadius='16px'
          mb='20px'
          bg={alertBg}
          border='1px solid'
          borderColor={alertBorderColor}>
          <Icon as={MdOutlineWarning} color='orange.500' w='20px' h='20px' me='12px' />
          <Box flex='1'>
            <Text fontWeight='700' fontSize='sm' color={textColor}>
              Complete your profile
            </Text>
            <AlertDescription fontSize='xs' color={subColor}>
              Complete your account registration to unlock all features and receive bonuses.
            </AlertDescription>
          </Box>
          <Button
            size='sm' colorScheme='orange' variant='solid'
            borderRadius='10px' fontSize='xs' fontWeight='700' me='8px'
            onClick={() => navigate('/user/signup-process')}>
            Complete Now
          </Button>
          <CloseButton size='sm' onClick={() => setShowProfileAlert(false)} />
        </Alert>
      )}

      {/* Hero Banner */}
      <Box
        bg={bannerGrad}
        shadow='lg'
        borderRadius='24px'
        p={{ base: '24px', md: '32px' }}
        mb='24px'
        position='relative'
        overflow='hidden'>
        {/* Decorative circles */}
        <Box position='absolute' top='-40px' right='-40px' w='150px' h='150px'
          borderRadius='full' bg='whiteAlpha.100' />
        <Box position='absolute' bottom='-30px' right='60px' w='100px' h='100px'
          borderRadius='full' bg='whiteAlpha.100' />

        <Flex justify='space-between' align='center' position='relative' zIndex='1'>
          <Box>
            <Text color='whiteAlpha.700' fontSize='sm' fontWeight='500' mb='4px'>
              Total Portfolio Value
            </Text>
            <Text color='white' fontSize={{ base: '28px', md: '36px' }} fontWeight='800' mb='8px'>
              {formatNaira(userData?.amount || 0)}
            </Text>
            <Flex gap='8px' flexWrap='wrap'>
              <Badge colorScheme='whiteAlpha' variant='solid' borderRadius='full' px='10px'>
                Tag: {userData?.tag_id || '—'}
              </Badge>
              {userData?.acct_approved_status === 'Approved' && (
                <Badge colorScheme='green' variant='solid' borderRadius='full' px='10px'
                  display='flex' alignItems='center' gap='4px'>
                  <Icon as={MdCheckCircle} w='12px' h='12px' /> Verified
                </Badge>
              )}
            </Flex>
          </Box>
          <Flex gap='10px' direction={{ base: 'column', sm: 'row' }}>
            <Button
              bg='white' color='brand.500'
              _hover={{ bg: 'whiteAlpha.900' }}
              fontWeight='700' fontSize='sm'
              borderRadius='12px' px='20px'
              onClick={() => navigate('/user/fund-account')}>
              Fund +
            </Button>
            <Button
              bg='whiteAlpha.200' color='white'
              _hover={{ bg: 'whiteAlpha.300' }}
              fontWeight='700' fontSize='sm'
              borderRadius='12px' px='20px'
              onClick={() => navigate('/user/withdraw')}>
              Withdraw
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* Wallet Cards */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap='16px' mb='24px'>
        <WalletCard
          label='Main Wallet'
          value={formatNaira(userData?.amount)}
          icon={MdOutlineAccountBalanceWallet}
          color='#4C5FD5'
          iconBg='#EEF2FF'
          action onAction={() => navigate('/user/wallet')} actionLabel='View'
        />
        <WalletCard
          label='Bonus Wallet'
          value={formatNaira(userData?.all_bonus_acct)}
          icon={MdArrowDownward}
          color='#10B981'
          iconBg='#D1FAE5'
          action onAction={() => navigate('/user/withdraw')} actionLabel='Withdraw'
        />
        <WalletCard
          label='Signup Bonus'
          value={bonusLoading
            ? '...'
            : formatNaira(bonusData?.feedbackBonus || userData?.signup_account || 0)}
          icon={MdOutlineWarning}
          color='#F59E0B'
          iconBg='#FEF3C7'
        />
        <WalletCard
          label='All-time Volume'
          value={formatDollar(userData?.tran_account)}
          icon={MdCurrencyExchange}
          color='#8B5CF6'
          iconBg='#EDE9FE'
        />
      </SimpleGrid>

      {/* Quick Actions */}
      <PageCard p='20px' mb='24px'>
        <Text color={textColor} fontWeight='700' fontSize='md' mb='16px'>
          Quick Actions
        </Text>
        <SimpleGrid columns={{ base: 4, md: 8 }} gap='12px'>
          {quickActions.map((action, i) => (
            <QuickAction
              key={i}
              icon={action.icon}
              label={action.label}
              color={action.color}
              iconBg={action.iconBg}
              onClick={() => navigate(action.path)}
            />
          ))}
        </SimpleGrid>
      </PageCard>

      {/* Recent Transactions */}
      <PageCard p='20px'>
        <Flex justify='space-between' align='center' mb='16px'>
          <Text color={textColor} fontWeight='700' fontSize='md'>
            Recent Transactions
          </Text>
          <Button
            size='sm' variant='ghost' color='brand.500'
            fontWeight='600' fontSize='sm'
            onClick={() => navigate('/user/history')}>
            View All →
          </Button>
        </Flex>

        {status === 'loading' ? (
          <Flex justify='center' py='40px'>
            <Spinner color='brand.500' size='lg' />
          </Flex>
        ) : !recentData || recentData.length === 0 ? (
          <Flex direction='column' align='center' py='40px' color={subColor}>
            <Icon as={MdOutlineAccountBalanceWallet} w='48px' h='48px' mb='12px' opacity={0.4} />
            <Text fontSize='sm' fontWeight='500'>No transactions yet</Text>
            <Text fontSize='xs' mt='4px'>Your recent transactions will appear here</Text>
          </Flex>
        ) : (
          <Box>
            {(Array.isArray(recentData) ? recentData : []).slice(0, 8).map((tx, i) => (
              <Box key={tx._id || i}>
                <Flex
                  align='center'
                  py='12px'
                  _hover={{ bg: hoverBg, borderRadius: '12px', px: '8px' }}
                  transition='all 0.15s'>
                  <Box
                    w='40px' h='40px' borderRadius='12px'
                    bg={tx.tran_type === 'Credit' ? '#D1FAE5' : '#FEE2E2'}
                    display='flex' alignItems='center' justifyContent='center'
                    mr='12px' flexShrink='0'>
                    <Icon
                      as={tx.tran_type === 'Credit' ? MdArrowDownward : MdArrowUpward}
                      color={tx.tran_type === 'Credit' ? 'green.500' : 'red.500'}
                      w='18px' h='18px'
                    />
                  </Box>
                  <Box flex='1' minW='0'>
                    <Text color={textColor} fontSize='sm' fontWeight='600' noOfLines={1}>
                      {tx.transac_nature || tx.tran_desc || 'Transaction'}
                    </Text>
                    <Text color={subColor} fontSize='xs'>
                      {tx.creditOn ? moment(tx.creditOn).format('DD MMM YYYY, hh:mm A') : '—'}
                    </Text>
                  </Box>
                  <Box textAlign='right'>
                    <Text
                      fontSize='base' fontWeight='700'
                      color={tx.tran_type === 'Credit' ? 'green.500' : 'red.500'}>
                      {tx.tran_type === 'Credit' ? '+' : '-'}
                      {tx.sender_currency_type === '$' ? '$' : '₦'}
                      {Number(tx.amount || 0).toLocaleString()}
                    </Text>
                    <Badge
                      colorScheme={txStatusColor(tx.transaction_status)}
                      borderRadius='full' fontSize='10px' px='8px'>
                      {tx.transaction_status}
                    </Badge>
                  </Box>
                </Flex>
                {i < Math.min(recentData.length, 8) - 1 && (
                  <Divider borderColor={borderColor} />
                )}
              </Box>
            ))}
          </Box>
        )}
      </PageCard>
    </PageLayout>
  );
}