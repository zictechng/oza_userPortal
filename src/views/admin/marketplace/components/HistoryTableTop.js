import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHistory, setPage, clearHistoryData,resetPage } from 'storeMtg/dashHistorySlice';
import moment from 'moment';
import { DollarValueFormat } from 'components/DollarFormat';
import { NairaValueFormat } from 'components/NairaFormat';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

export default function HistoryTable() {
  const dispatch = useDispatch();

  // Redux states
  const { user, userToken } = useSelector((state) => state.authUser);
  const {
    historyData,
    currentPage,
    totalPages,
    paginationStatus,
    initialLoading,
    paginationLoading,
  } = useSelector((state) => state.history);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Fetch history data on load and when currentPage changes
  useEffect(() => {
    if (user?.userData?._id && userToken) {
      dispatch(
        fetchHistory({
          userID: user.userData._id,
          user_token: userToken,
          page: currentPage,
          pageSize: 10,
        })
      );
     }
  }, [dispatch, user, userToken, currentPage]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      dispatch(setPage(newPage)); // Update page in Redux store
    }
  };
  
// this will reset the page to start from page 1 when it first loads
  useEffect(() => {
    return () => {
      dispatch(resetPage())
     };
  }, [dispatch]);

  return (
    <Flex direction="column" w="100%" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      {/* Display initial loading spinner */}
      {initialLoading && (
        <Flex
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bg="rgba(255, 255, 255, 0.8)"
          justify="center"
          align="center"
          zIndex={10}
        >
          <Spinner size="xl" />
        </Flex>
      )}

      {/* Content */}
      <Box position="relative" mt="20px">
        {/* Pagination overlay loader */}
        {paginationLoading && !initialLoading && (
          <Flex
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            bg="rgba(255, 255, 255, 0.8)"
            justify="center"
            align="center"
            zIndex={10}
          >
            <Spinner size="lg" />
          </Flex>
        )}
              {/* Pagination controls */}
                {totalPages > 1 && 
                  <Flex justify="flex-end" align="center" mr="8px" ml="8px" gap="8px">
                    <Button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || paginationStatus === 'loading'}
                    >
                      <Box as={ChevronLeftIcon} boxSize="20px" color="#222" />
                    </Button>
                    <Text>Page {currentPage} of {totalPages}</Text>
                    <Button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || paginationStatus === 'loading'}
                    >
                      <Box as={ChevronRightIcon} boxSize="20px" color="#222" />
                    </Button>
                  </Flex>
                  }
        <Table variant="simple" color="gray.500" mt="12px">
          <Thead>
            <Tr>
              <Th borderColor={borderColor}>Service</Th>
              <Th borderColor={borderColor}>Status</Th>
              <Th borderColor={borderColor}>Amount</Th>
              <Th borderColor={borderColor}>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {historyData?.map((transaction) => (
              <Tr key={transaction._id}>
                <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                  {transaction.transac_nature}
                </Td>
                <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                  {transaction.transaction_status}
                </Td>
                <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                  <Flex align="center">
                    {transaction.tran_type === 'Debit' ? '-' : '+'}
                    {transaction.currency_level === '2' ? (
                      <DollarValueFormat value={transaction.amount} />
                    ) : (
                      <NairaValueFormat value={transaction.amount} />
                    )}
                  </Flex>
                </Td>
                <Td fontSize="sm" color={textColorSecondary} borderColor={borderColor}>
                  {moment(transaction.creditOn).format('DD/MM/YYYY hh:mm:ss')}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Pagination controls */}
        {/* <Flex justify="space-between" mt={4} mr='8px' ml='8px'>
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || paginationStatus === 'loading'}
          >
            Previous
          </Button>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || paginationStatus === 'loading'}
          >
            Next
          </Button>
        </Flex> */}
      </Box>
    </Flex>
  );
}
