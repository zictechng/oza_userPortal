import React, { useEffect, useState } from 'react';
import {
  Box, Flex, Text, Icon, Button, Badge,
  useColorModeValue, Spinner, Divider,
  Select, Input, InputGroup, InputLeftElement,
} from '@chakra-ui/react';
import {
  MdArrowDownward, MdArrowUpward, MdSearch,
  MdHistory,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  fetchHistory, clearHistoryData,
  setPage, resetPage,
} from 'storeMtg/dashHistorySlice';

const txStatusColor = (status) => {
  const s = status?.toLowerCase();
  if (s === 'completed' || s === 'successful') return 'green';
  if (s === 'pending') return 'orange';
  if (s === 'failed') return 'red';
  return 'gray';
};

export default function History() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, userToken } = useSelector(state => state.authUser);
  const {
    historyData, currentPage, totalPages,
    initialLoading, paginationLoading,
  } = useSelector(state => state.history);

  const userData = user?.userData;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const bg = useColorModeValue('gray.50', 'navy.900');
  const cardBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBg = useColorModeValue('white', 'navy.800');
  const alertBg = useColorModeValue('#FFF7ED', '#3D2A00');
  const alertBorderColor = useColorModeValue('orange.200', 'orange.800');
  const hoverBg = useColorModeValue('gray.50', 'navy.700');

  useEffect(() => {
    dispatch(resetPage());
    return () => dispatch(clearHistoryData());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const matchFilter = filter === 'all' ||
      (filter === 'credit' && tx.tran_type === 'Credit') ||
      (filter === 'debit' && tx.tran_type === 'Debit');
    return matchSearch && matchFilter;
  }) : [];

  return (
    <Box
      pt={{ base: '100px', md: '80px' }}
      px={{ base: '16px', md: '24px' }}
      pb='40px'
      bg={bg}
      minH='100vh'>

      {/* Header */}
      <Flex justify='space-between' align='center' mb='24px'>
        <Box>
          <Text color={subColor} fontSize='sm'>My Account</Text>
          <Text color={textColor} fontSize='xl' fontWeight='800'>
            Transaction History
          </Text>
        </Box>
      </Flex>

      {/* Filters */}
      <Flex gap='12px' mb='20px' flexWrap='wrap'>
        <InputGroup maxW='300px'>
          <InputLeftElement pointerEvents='none'>
            <Icon as={MdSearch} color={subColor} />
          </InputLeftElement>
          <Input
            placeholder='Search transactions...'
            bg={inputBg}
            borderRadius='12px'
            fontSize='sm'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </InputGroup>
        <Select
          maxW='160px'
          bg={inputBg}
          borderRadius='12px'
          fontSize='sm'
          value={filter}
          onChange={e => setFilter(e.target.value)}>
          <option value='all'>All</option>
          <option value='credit'>Credits</option>
          <option value='debit'>Debits</option>
        </Select>
      </Flex>

      {/* Table */}
      <Box
        bg={cardBg}
        borderRadius='20px'
        border='1px solid'
        borderColor={borderColor}
        overflow='hidden'>

        {/* Header row */}
        <Flex
          px='20px' py='14px'
          bg={useColorModeValue('gray.50', 'navy.700')}
          borderBottom='1px solid'
          borderColor={borderColor}
          display={{ base: 'none', md: 'flex' }}>
          <Text color={subColor} fontSize='xs' fontWeight='700'
            textTransform='uppercase' letterSpacing='0.5px' flex='1'>
            Transaction
          </Text>
          <Text color={subColor} fontSize='xs' fontWeight='700'
            textTransform='uppercase' letterSpacing='0.5px' w='140px'>
            Date
          </Text>
          <Text color={subColor} fontSize='xs' fontWeight='700'
            textTransform='uppercase' letterSpacing='0.5px' w='100px'>
            Status
          </Text>
          <Text color={subColor} fontSize='xs' fontWeight='700'
            textTransform='uppercase' letterSpacing='0.5px' w='120px' textAlign='right'>
            Amount
          </Text>
        </Flex>

        {initialLoading ? (
          <Flex justify='center' py='48px'>
            <Spinner color='brand.500' size='lg' />
          </Flex>
        ) : filtered.length === 0 ? (
          <Flex direction='column' align='center' py='48px' color={subColor}>
            <Icon as={MdHistory} w='48px' h='48px' mb='12px' opacity={0.4} />
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
                  align='center'
                  px='20px' py='16px'
                  _hover={{ bg: hoverBg, borderRadius: '12px', px: '8px' }}
                  transition='all 0.15s'>
                  {/* Icon + Info */}
                  <Flex align='center' flex='1' gap='12px'>
                    <Box
                      w='40px' h='40px' borderRadius='12px'
                      bg={tx.tran_type === 'Credit' ? '#D1FAE5' : '#FEE2E2'}
                      display='flex' alignItems='center' justifyContent='center'
                      flexShrink='0'>
                      <Icon
                        as={tx.tran_type === 'Credit' ? MdArrowDownward : MdArrowUpward}
                        color={tx.tran_type === 'Credit' ? 'green.500' : 'red.500'}
                        w='18px' h='18px'
                      />
                    </Box>
                    <Box minW='0'>
                      <Text color={textColor} fontSize='sm' fontWeight='600' noOfLines={1}>
                        {tx.transac_nature || tx.tran_desc || 'Transaction'}
                      </Text>
                      <Text color={subColor} fontSize='xs' noOfLines={1}>
                        Ref: {tx.tid || '—'}
                      </Text>
                      {/* Date on mobile */}
                      <Text color={subColor} fontSize='xs'
                        display={{ base: 'block', md: 'none' }}>
                        {tx.creditOn ? moment(tx.creditOn).format('DD MMM YYYY, hh:mm A') : '—'}
                      </Text>
                    </Box>
                  </Flex>

                  {/* Date */}
                  <Text color={subColor} fontSize='xs' w='140px'
                    display={{ base: 'none', md: 'block' }}>
                    {tx.creditOn ? moment(tx.creditOn).format('DD MMM YYYY, hh:mm A') : '—'}
                  </Text>

                  {/* Status */}
                  <Box w='100px' display={{ base: 'none', md: 'block' }}>
                    <Badge
                      colorScheme={txStatusColor(tx.transaction_status)}
                      borderRadius='full' fontSize='10px' px='8px'>
                      {tx.transaction_status || 'Pending'}
                    </Badge>
                  </Box>

                  {/* Amount */}
                  <Text
                    fontSize='sm' fontWeight='700' w='120px' textAlign='right'
                    color={tx.tran_type === 'Credit' ? 'green.500' : 'red.500'}>
                    {tx.tran_type === 'Credit' ? '+' : '-'}₦{Number(tx.amount || 0).toLocaleString()}
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
            </Text>
            <Flex gap='8px'>
              <Button
                size='sm' borderRadius='10px' variant='outline'
                isDisabled={currentPage === 1 || paginationLoading}
                onClick={() => handlePageChange(currentPage - 1)}>
                ← Prev
              </Button>
              <Button
                size='sm' borderRadius='10px' variant='outline'
                isDisabled={currentPage === totalPages || paginationLoading}
                onClick={() => handlePageChange(currentPage + 1)}>
                Next →
              </Button>
            </Flex>
          </Flex>
        )}
      </Box>
    </Box>
  );
}