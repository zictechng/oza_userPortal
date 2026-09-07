import React, { useEffect, useState } from 'react';
import {
  Box, Flex, Text, Icon, Button, Badge,
  useColorModeValue, Spinner, Divider,
  SimpleGrid, Select, Input, InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import {
  MdArrowDownward, MdArrowUpward, MdSearch,
  MdCurrencyExchange, MdFilterList,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  fetchHistory, clearHistoryData,
  setPage, resetPage,
} from 'storeMtg/dashHistorySlice';
import { PageLayout, PageCard } from 'layouts/PageLayout';
import { useNavigate } from 'react-router-dom';
import client from 'components/client';

const statusColor = (status) => {
  const s = status?.toLowerCase();
  if (s === 'completed' || s === 'successful') return 'green';
  if (s === 'pending') return 'orange';
  if (s === 'failed') return 'red';
  return 'gray';
};

export default function Transactions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userToken } = useSelector(state => state.authUser);
  const {
    historyData, currentPage, totalPages,
    initialLoading, paginationLoading,
  } = useSelector(state => state.history);

  const userData = user?.userData;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // All-time stats from user data directly
  const [summary, setSummary] = useState({
    totalNairaVolume: 0, totalCredit: 0, totalDebit: 0, totalDollar: 0, totalCount: 0,
  });
  const [summaryLoading, setSummaryLoading] = useState(false);

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const headerBg = useColorModeValue('gray.50', 'navy.700');
  const hoverBg = useColorModeValue('gray.50', 'navy.700');
  const inputBg = useColorModeValue('white', 'navy.800');
  const statBg = useColorModeValue('white', 'navy.800');

  useEffect(() => {
    dispatch(resetPage());
    fetchSummary();
    return () => dispatch(clearHistoryData());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSummary = async () => {
    if (!userData?._id || !userToken) return;
    setSummaryLoading(true);
    try {
      const res = await client.get(
        `/api/user_transaction_summary/${userData._id}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (res.data.msg === '201') setSummary(res.data);
    } catch (e) {
      console.log('Summary error:', e.message);
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    if (!userData?._id || !userToken) return;
    dispatch(fetchHistory({
      userID: userData._id,
      user_token: userToken,
      page: currentPage,
      pageSize: 15,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentPage, userData?._id, userToken]);

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = Array.isArray(historyData) ? historyData.filter(tx => {
    const matchSearch = !search ||
      tx.transac_nature?.toLowerCase().includes(search.toLowerCase()) ||
      tx.tran_desc?.toLowerCase().includes(search.toLowerCase()) ||
      tx.tid?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'credit' && tx.tran_type === 'Credit') ||
      (filter === 'debit' && tx.tran_type === 'Debit');
    return matchSearch && matchFilter;
  }) : [];

  // Summary stats
  const allTx = Array.isArray(historyData) ? historyData : [];
  const totalCredit = Number(userData?.amount || 0);
  const totalDebit = Number(userData?.tran_account || 0);

  return (
    <PageLayout>
      {/* Summary Cards */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap='16px' mb='24px'>
        {[
          { label: 'Total ₦ Volume', value: summaryLoading ? '...' : `₦${Number(summary.totalNairaVolume || 0).toLocaleString()}`, color: 'brand.500', bg: 'brand.50' },
          { label: 'Total Credits', value: summaryLoading ? '...' : `₦${Number(summary.totalCredit || 0).toLocaleString()}`, color: 'green.500', bg: 'green.50' },
          { label: 'Total Debits', value: summaryLoading ? '...' : `₦${Number(summary.totalDebit || 0).toLocaleString()}`, color: 'red.500', bg: 'red.50' },
          { label: 'Dollar Volume', value: summaryLoading ? '...' : `$${Number(summary.totalDollar || 0).toLocaleString()}`, color: 'orange.500', bg: 'orange.50' },
        ].map((stat, i) => (
          <Box key={i}
            bg={statBg}
            borderRadius='16px' p='20px'
            border='1px solid' borderColor={borderColor}
            boxShadow='0 2px 8px rgba(0,0,0,0.06)'>
            <Text color={subColor} fontSize='xs' fontWeight='600'
              textTransform='uppercase' letterSpacing='0.5px' mb='6px'>
              {stat.label}
            </Text>
            <Text color={stat.color} fontSize='lg' fontWeight='800'>
              {stat.value}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* Filters */}
      <Flex gap='12px' mb='16px' flexWrap='wrap'>
        <InputGroup maxW='300px'>
          <InputLeftElement pointerEvents='none'>
            <Icon as={MdSearch} color={subColor} />
          </InputLeftElement>
          <Input
            placeholder='Search transactions...'
            bg={inputBg}
            borderRadius='12px'
            fontSize='sm'
            borderColor={borderColor}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </InputGroup>
        <Select
          maxW='160px'
          bg={inputBg}
          borderRadius='12px'
          fontSize='sm'
          borderColor={borderColor}
          value={filter}
          onChange={e => setFilter(e.target.value)}>
          <option value='all'>All Types</option>
          <option value='credit'>Credits Only</option>
          <option value='debit'>Debits Only</option>
        </Select>
      </Flex>

      {/* Table */}
      <PageCard p='0' overflow='hidden'>
        {/* Header */}
        <Flex
          px='20px' py='14px'
          bg={headerBg}
          borderBottom='1px solid' borderColor={borderColor}>
          <Text color={subColor} fontSize='xs' fontWeight='700'
            textTransform='uppercase' letterSpacing='0.5px' flex='2'>
            Transaction
          </Text>
          <Text color={subColor} fontSize='xs' fontWeight='700'
            textTransform='uppercase' letterSpacing='0.5px' w='160px'
            display={{ base: 'none', md: 'block' }}>
            Date
          </Text>
          <Text color={subColor} fontSize='xs' fontWeight='700'
            textTransform='uppercase' letterSpacing='0.5px' w='100px'
            display={{ base: 'none', md: 'block' }}>
            Status
          </Text>
          <Text color={subColor} fontSize='xs' fontWeight='700'
            textTransform='uppercase' letterSpacing='0.5px' w='120px'
            textAlign='right'>
            Amount
          </Text>
        </Flex>

        {initialLoading ? (
          <Flex justify='center' py='48px'>
            <Spinner color='brand.500' size='lg' />
          </Flex>
        ) : paginationLoading ? (
          <Flex justify='center' py='48px'>
            <Spinner color='brand.500' size='md' />
          </Flex>
        ) : filtered.length === 0 ? (
          <Flex direction='column' align='center' py='48px' color={subColor}>
            <Icon as={MdCurrencyExchange} w='48px' h='48px' mb='12px' opacity={0.4} />
            <Text fontSize='sm' fontWeight='500'>No transactions found</Text>
            <Text fontSize='xs' mt='4px'>
              {search ? 'Try a different search term' : 'Your transactions will appear here'}
            </Text>
          </Flex>
        ) : (
          <Box opacity={paginationLoading ? 0.6 : 1} transition='opacity 0.2s'>
            {filtered.map((tx, i) => (
              <Box key={tx._id || i}>
                <Flex
                  align='center' px='20px' py='14px'
                  _hover={{ bg: hoverBg }}
                  transition='all 0.15s'>
                  {/* Icon + Info */}
                  <Flex align='center' flex='2' gap='12px'>
                    <Box
                      w='38px' h='38px' borderRadius='10px'
                      bg={tx.tran_type === 'Credit' ? '#D1FAE5' : '#FEE2E2'}
                      display='flex' alignItems='center'
                      justifyContent='center' flexShrink='0'>
                      <Icon
                        as={tx.tran_type === 'Credit' ? MdArrowDownward : MdArrowUpward}
                        color={tx.tran_type === 'Credit' ? 'green.500' : 'red.500'}
                        w='16px' h='16px'
                      />
                    </Box>
                    <Box minW='0'>
                      <Text color={textColor} fontSize='sm' fontWeight='600' noOfLines={1}>
                        {tx.transac_nature || tx.tran_desc || 'Transaction'}
                      </Text>
                      <Text color={subColor} fontSize='xs' noOfLines={1}>
                        Ref: {tx.tid || '—'}
                      </Text>
                      {/* Mobile date */}
                      <Text color={subColor} fontSize='sm'
                        display={{ base: 'block', md: 'none' }}>
                        {tx.creditOn ? moment(tx.creditOn).format('DD MMM YYYY') : '—'}
                      </Text>
                    </Box>
                  </Flex>

                  {/* Date */}
                  <Text color={subColor} fontSize='xs' w='160px'
                    display={{ base: 'none', md: 'block' }}>
                    {tx.creditOn ? moment(tx.creditOn).format('DD MMM YYYY, hh:mm A') : '—'}
                  </Text>

                  {/* Status */}
                  <Box w='100px' display={{ base: 'none', md: 'block' }}>
                    <Badge
                      colorScheme={statusColor(tx.transaction_status)}
                      borderRadius='full' fontSize='13px' px='8px'
                      textTransform='capitalize'>
                      {tx.transaction_status || 'Pending'}
                    </Badge>
                  </Box>

                  {/* Amount */}
                  <Text
                    fontSize='base' fontWeight='700' w='120px' textAlign='right'
                    color={tx.tran_type === 'Credit' ? 'green.500' : 'red.500'}>
                    {tx.tran_type === 'Credit' ? '+' : '-'}
                    {tx.sender_currency_type === '$' ? '$' : '₦'}
                    {Number(tx.amount || 0).toLocaleString()}
                  </Text>
                </Flex>
                {i < filtered.length - 1 && <Divider borderColor={borderColor} />}
              </Box>
            ))}
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && !initialLoading && (
          <Flex
            justify='space-between' align='center'
            px='20px' py='16px'
            borderTop='1px solid' borderColor={borderColor}>
            <Text color={subColor} fontSize='sm'>
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              {' · '}{filtered.length} records shown
            </Text>
            <Flex gap='8px'>
              <Button size='sm' borderRadius='10px' variant='outline'
                isDisabled={currentPage === 1 || paginationLoading}
                onClick={() => handlePageChange(currentPage - 1)}>
                ← Prev
              </Button>
              <Button size='sm' borderRadius='10px' variant='outline'
                isDisabled={currentPage === totalPages || paginationLoading}
                onClick={() => handlePageChange(currentPage + 1)}>
                Next →
              </Button>
            </Flex>
          </Flex>
        )}
      </PageCard>
    </PageLayout>
  );
}