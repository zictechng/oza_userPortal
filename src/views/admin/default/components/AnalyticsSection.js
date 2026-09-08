
import React, { useEffect, useState } from 'react';
import {
  Box, Flex, Text, Icon, Spinner,
  SimpleGrid, useColorModeValue, Button,
} from '@chakra-ui/react';
import {
  MdTrendingUp, MdTrendingDown, MdBarChart,
} from 'react-icons/md';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useSelector } from 'react-redux';
import client from 'components/client';

const COLORS = ['#4C5FD5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const CustomTooltip = ({ active, payload, label, textColor }) => {
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

export default function AnalyticsSection() {
  const { user, userToken } = useSelector(state => state.authUser);
  const userData = user?.userData;

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const gridColor = useColorModeValue('#f0f0f0', '#1E2C5A');

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('weekly'); // weekly | monthly

  useEffect(() => {
    if (!userData?._id || !userToken) return;
    fetchChartData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?._id]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const res = await client.get(
        `/api/user_chart_data/${userData._id}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (res.data.msg === '201') {
        setChartData(res.data);
      }
    } catch (e) {
      console.log('chart error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const chartDataToShow = view === 'weekly'
    ? chartData?.daily || []
    : chartData?.monthly || [];

  if (loading) {
    return (
      <Flex justify='center' py='40px'>
        <Spinner color='brand.500' size='lg' />
      </Flex>
    );
  }

  if (!chartData) return null;

  return (
    <Box mt='24px'>
      <Flex justify='space-between' align='center' mb='20px'>
        <Box>
          <Text color={textColor} fontSize='lg' fontWeight='800'>
            Analytics Overview
          </Text>
          <Text color={subColor} fontSize='xs'>
            Your transaction trends and activity breakdown
          </Text>
        </Box>
        <Flex gap='8px'>
          {['weekly', 'monthly'].map(v => (
            <Button key={v} size='sm' borderRadius='10px'
              bg={view === v ? 'brand.500' : cardBg}
              color={view === v ? 'white' : subColor}
              border='1px solid' borderColor={view === v ? 'brand.500' : borderColor}
              fontWeight='600' fontSize='xs'
              _hover={{ borderColor: 'brand.500' }}
              onClick={() => setView(v)}>
              {v === 'weekly' ? 'This Week' : '6 Months'}
            </Button>
          ))}
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap='20px' mb='20px'>
        {/* Area Chart — Credits vs Debits */}
        <Box bg={cardBg} borderRadius='20px' p='20px'
          border='1px solid' borderColor={borderColor}
          boxShadow='0 2px 8px rgba(0,0,0,0.06)'>
          <Flex align='center' gap='8px' mb='16px'>
            <Icon as={MdTrendingUp} color='brand.500' w='18px' h='18px' />
            <Text color={textColor} fontSize='sm' fontWeight='700'>
              Credit vs Debit Trend
            </Text>
          </Flex>
          {chartDataToShow.length === 0 ? (
            <Flex justify='center' align='center' h='200px' color={subColor}>
              <Text fontSize='sm'>No data for this period</Text>
            </Flex>
          ) : (
            <ResponsiveContainer width='100%' height={200}>
              <AreaChart data={chartDataToShow}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id='creditGrad' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#4C5FD5' stopOpacity={0.3} />
                    <stop offset='95%' stopColor='#4C5FD5' stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id='debitGrad' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#EF4444' stopOpacity={0.3} />
                    <stop offset='95%' stopColor='#EF4444' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='3 3' stroke={gridColor} />
                <XAxis dataKey={view === 'weekly' ? 'date' : 'month'}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickFormatter={v => `₦${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type='monotone' dataKey='credit' name='Credit'
                  stroke='#4C5FD5' fill='url(#creditGrad)' strokeWidth={2} />
                <Area type='monotone' dataKey='debit' name='Debit'
                  stroke='#EF4444' fill='url(#debitGrad)' strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Box>

        {/* Bar Chart — Monthly comparison */}
        <Box bg={cardBg} borderRadius='20px' p='20px'
          border='1px solid' borderColor={borderColor}
          boxShadow='0 2px 8px rgba(0,0,0,0.06)'>
          <Flex align='center' gap='8px' mb='16px'>
            <Icon as={MdBarChart} color='green.500' w='18px' h='18px' />
            <Text color={textColor} fontSize='sm' fontWeight='700'>
              Transaction Volume
            </Text>
          </Flex>
          {chartDataToShow.length === 0 ? (
            <Flex justify='center' align='center' h='200px' color={subColor}>
              <Text fontSize='sm'>No data for this period</Text>
            </Flex>
          ) : (
            <ResponsiveContainer width='100%' height={200}>
              <BarChart data={chartDataToShow}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' stroke={gridColor} />
                <XAxis dataKey={view === 'weekly' ? 'date' : 'month'}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickFormatter={v => `₦${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey='credit' name='Credit' fill='#4C5FD5'
                  radius={[4, 4, 0, 0]} />
                <Bar dataKey='debit' name='Debit' fill='#10B981'
                  radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>
      </SimpleGrid>

      {/* Service Breakdown Pie */}
      {chartData.serviceBreakdown?.length > 0 && (
        <Box bg={cardBg} borderRadius='20px' p='20px'
          border='1px solid' borderColor={borderColor}
          boxShadow='0 2px 8px rgba(0,0,0,0.06)'>
          <Flex align='center' gap='8px' mb='16px'>
            <Icon as={MdTrendingDown} color='orange.400' w='18px' h='18px' />
            <Text color={textColor} fontSize='sm' fontWeight='700'>
              Spending by Service (Last 30 Days)
            </Text>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap='20px'>
            <ResponsiveContainer width='100%' height={200}>
              <PieChart>
                <Pie
                  data={chartData.serviceBreakdown}
                  cx='50%' cy='50%'
                  innerRadius={50} outerRadius={80}
                  paddingAngle={3}
                  dataKey='value'>
                  {chartData.serviceBreakdown.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <Flex direction='column' justify='center' gap='10px'>
              {chartData.serviceBreakdown.map((item, i) => (
                <Flex key={i} align='center' justify='space-between'>
                  <Flex align='center' gap='8px'>
                    <Box w='10px' h='10px' borderRadius='full'
                      bg={COLORS[i % COLORS.length]} flexShrink='0' />
                    <Text color={subColor} fontSize='xs' noOfLines={1}>
                      {item.name}
                    </Text>
                  </Flex>
                  <Text color={textColor} fontSize='xs' fontWeight='700'>
                    ₦{Number(item.value).toLocaleString()}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
}