/* eslint-disable */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Flex,
  Icon,
  Progress,
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
import { MdCancel, MdCheckCircle, MdOutlineError } from 'react-icons/md';
import { createColumnHelper, useReactTable, flexRender } from '@tanstack/react-table';
import { DollarValueFormat } from 'components/DollarFormat';
import { NairaValueFormat } from 'components/NairaFormat';
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenuRecent';
import { fetchProducts, clearProducts } from 'storeMtg/dashRecentRecordSlice';
import moment from 'moment/moment';


const columnHelper = createColumnHelper();

export default function ComplexTable({ tableData }) {
  const dispatch = useDispatch();
  const { recentData, status, error } = useSelector((state) => state.recentTransaction);
  const { user, userToken } = useSelector((state) => state.authUser);
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  useEffect(() => {
    if (user.userData?._id && userToken) {
      const passData = {
        userID: user.userData._id,
        user_token: userToken,
      };
      dispatch(fetchProducts(passData));
    }

    return () => dispatch(clearProducts());
  }, [dispatch, user.userData._id, userToken]);

   

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
          Recent Transactions
        </Text>
        <Menu />
      </Flex>

      <Box>
        {/* Loading Spinner when data is being fetched */}
        {status === 'loading' && (
          <Flex justifyContent="center" alignItems="center">
            <Spinner size="lg" />
          </Flex>
        )}

        {/* Display table if data is available */}
        {status !== 'loading' && recentData.length > 0 ? (
          <Table variant="simple" color="gray.500" mb="24px" mt="12px">
            <Thead>
              <Tr>
                <Th borderColor={borderColor}>Service</Th>
                <Th borderColor={borderColor}>Status</Th>
                <Th borderColor={borderColor}>Amount</Th>
                <Th borderColor={borderColor}>Date</Th>
              </Tr>
            </Thead>

            <Tbody>
              {recentData.map((transaction) => (
                <Tr key={transaction._id}>
                  <Td fontSize={{ sm: '14px' }} minW={{ sm: '150px', md: '200px', lg: 'auto' }} borderColor="transparent">
                    {transaction.transac_nature}
                  </Td>
                  <Td fontSize={{ sm: '14px' }} minW={{ sm: '150px', md: '200px', lg: 'auto' }} borderColor="transparent">
                    {transaction.transaction_status}
                  </Td>
                  <Td fontSize={{ sm: '14px' }} minW={{ sm: '150px', md: '200px', lg: 'auto' }} borderColor="transparent">
                    {transaction.currency_level === '2' ? <DollarValueFormat value={transaction.amount} /> : <NairaValueFormat value={transaction.amount} />}
                  </Td>
                  <Td fontSize={{ sm: '14px' }} minW={{ sm: '150px', md: '200px', lg: 'auto' }} borderColor="transparent">
                    {moment(transaction.creditOn).format('DD/MM/YYYY hh:mm:ss')}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Flex justifyContent="center" alignItems="center">
            <p>{status === 'failed' ? `Error occurred: ${error}` : 'No record at the moment'}</p>
          </Flex>
        )}
      </Box>
    </Card>
  );
}
