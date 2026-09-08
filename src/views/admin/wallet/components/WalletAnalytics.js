
import React, { useEffect, useState } from 'react';
import {
  Box, Flex, Text, Icon, Spinner,
  SimpleGrid, useColorModeValue, Button,
} from '@chakra-ui/react';
import { MdAccountBalanceWallet, MdBarChart } from 'react-icons/md';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useSelector } from 'react-redux';
import client from 'components/client';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box bg='white' p='10px' borderRadius='10px'
        shadow='lg' border='1px solid' borderColor='gray.100'>
        <Text fontSize='xs' fontWeight='700' color='gray.600' mb='4px'>{label}</Text>
        {payload.map((p, i) => (
          <Text key={i} fontSize='xs' color={p.color} fontWeight='600'>
            {p.name}: ₦{Number(p.value).toLocaleString()}
          </Text>
        ))}
      </Box>
    );
  }
  return null;
};

export default function WalletAnalytics() {
  const { user, userToken } = useSelector(state => state.authUser);
  const userData = user?.userData;

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const gridColor = useColorModeValue('#f0f0f0', '#1E2C5A');

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?._id || !userToken) return;
    fetchChartData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?._id]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const res = await client.get(
        `/api/user_wallet_chart/${userData._id}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (res.data.msg === '201') setChartData(res.data);
    } catch (e) {
      console.log('wallet chart error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex justify='center' py='40px'>
        <Spinner color='brand.500' size='lg' />
      </Flex>
    );
  }

  if (!chartData) return null;

  return (
    <Box mt='34px' mb='30px'>
      <Flex justify='space-between' align='center' mb='20px'>
        <Box>
          <Text color={textColor} fontSize='lg' fontWeight='800'>
            Wallet Analytics
          </Text>
          <Text color={subColor} fontSize='xs'>
            Balance history and monthly activity breakdown
          </Text>
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap='20px'>
        {/* Balance History — Area Chart */}
        <Box bg={cardBg} borderRadius='20px' p='20px'
          border='1px solid' borderColor={borderColor}
          boxShadow='0 2px 8px rgba(0,0,0,0.06)'>
          <Flex align='center' gap='8px' mb='16px'>
            <Icon as={MdAccountBalanceWallet} color='brand.500' w='18px' h='18px' />
            <Box>
              <Text color={textColor} fontSize='sm' fontWeight='700'>
                Balance History
              </Text>
              <Text color={subColor} fontSize='xs'>Last 30 days activity</Text>
            </Box>
          </Flex>

          {!chartData.balanceHistory?.length ? (
            <Flex justify='center' align='center' h='200px' color={subColor}>
              <Text fontSize='sm'>No balance history available</Text>
            </Flex>
          ) : (
            <ResponsiveContainer width='100%' height={220}>
              <AreaChart data={chartData.balanceHistory}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id='balanceGrad' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#4C5FD5' stopOpacity={0.4} />
                    <stop offset='95%' stopColor='#4C5FD5' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='3 3' stroke={gridColor} />
                <XAxis dataKey='date'
                  tick={{ fontSize: 9, fill: '#9CA3AF' }} />
                <YAxis
                  tick={{ fontSize: 9, fill: '#9CA3AF' }}
                  tickFormatter={v => `₦${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type='monotone' dataKey='balance' name='Balance'
                  stroke='#4C5FD5' fill='url(#balanceGrad)'
                  strokeWidth={2.5} dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Box>

        {/* Monthly Credit vs Debit — Bar Chart */}
        <Box bg={cardBg} borderRadius='20px' p='20px'
          border='1px solid' borderColor={borderColor}
          boxShadow='0 2px 8px rgba(0,0,0,0.06)'>
          <Flex align='center' gap='8px' mb='16px'>
            <Icon as={MdBarChart} color='green.500' w='18px' h='18px' />
            <Box>
              <Text color={textColor} fontSize='sm' fontWeight='700'>
                Monthly Credit vs Debit
              </Text>
              <Text color={subColor} fontSize='xs'>Last 6 months comparison</Text>
            </Box>
          </Flex>

          {/* Legend */}
          <Flex gap='16px' mb='12px'>
            <Flex align='center' gap='6px'>
              <Box w='10px' h='10px' borderRadius='full' bg='#4C5FD5' />
              <Text color={subColor} fontSize='xs'>Credit</Text>
            </Flex>
            <Flex align='center' gap='6px'>
              <Box w='10px' h='10px' borderRadius='full' bg='#EF4444' />
              <Text color={subColor} fontSize='xs'>Debit</Text>
            </Flex>
          </Flex>

          {!chartData.monthly?.length ? (
            <Flex justify='center' align='center' h='200px' color={subColor}>
              <Text fontSize='sm'>No monthly data available</Text>
            </Flex>
          ) : (
            <ResponsiveContainer width='100%' height={200}>
              <BarChart data={chartData.monthly}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' stroke={gridColor} />
                <XAxis dataKey='month'
                  tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickFormatter={v => `₦${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey='credit' name='Credit'
                  fill='#4C5FD5' radius={[4, 4, 0, 0]} />
                <Bar dataKey='debit' name='Debit'
                  fill='#EF4444' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
}