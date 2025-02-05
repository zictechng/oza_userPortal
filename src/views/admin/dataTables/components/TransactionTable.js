'use client';
/* eslint-disable */

import {
  Box,
  Flex,
  Text,
  Button,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { MdCurrencyExchange, MdSend } from 'react-icons/md';
// Custom components
import Card from 'components/card/Card';
import * as React from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
// Assets

const columnHelper = createColumnHelper();

// const columns = columnsDataCheck;
export default function ComplexTable(props) {
  const navigate = useNavigate();
  const { tableData } = props;
  const [sorting, setSorting] = React.useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const iconColor = useColorModeValue('secondaryGray.500', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const fundAccountRedirect = () => {
    navigate('/user/fund-account');
  };
  const sendFundRedirect = () => {
    navigate('/user/send-fund');
  };

  const exchangeRedirect = () => {
    navigate('/user/exchange-rate');
  };

  return (
    <Card
      flexDirection="column"
      w={{ base: '100%', sm: '95%', md: '90%', lg: '70%', xl: '60%' }}
      px="0px"
      overflowX={{ base: 'hidden', lg: 'hidden' }}
    >
      <Flex
        px={{ base: '15px', md: '25px' }}
        mb="8px"
        justifyContent="space-between"
        align="center"
      >
        <Text
          color={textColor}
          fontSize={{ base: '18px', md: '20px', lg: '22px' }}
          fontWeight="700"
          lineHeight="100%"
        >
          App Transactions
          <Text
            fontSize={{ base: '14px', lg: '16px' }}
            py={1.5}
            color="gray.400"
          >
            What did you want to do today?
          </Text>
        </Text>
      </Flex>
      <Box>
        <Flex
          px={{ base: '15px', md: '45px' }}
          align="center"
          mb={{ base: '10px', md: '20px', lg: '20px' }}
        >
          <Box
            align="center"
            mt={{ base: '10px', md: '20px', lg: '20px' }}
            w="100%"
          >
            <Flex
              direction={{ base: 'column', md: 'row' }}
              gap={{ base: '25px', md: '10px', lg: '10px' }}
              align="center"
              justifyContent={{
                base: 'center',
                md: 'space-around',
                lg: 'space-between',
              }}
            >
              <Button
                bg="#1D2667"
                color="white"
                _hover={{ bg: '#5363CE' }}
                _active={{ bg: '#5363CE' }}
                _focus={{ bg: '#5363CE' }}
                fontWeight="500"
                fontSize={{ base: '12px', md: '14px' }}
                py={{ base: '15px', md: '20px' }}
                px="27"
                leftIcon={<AddIcon w="20px" h="20px" />}
                width={{ base: '100%', md: '200px' }}
                height={{ base: '45px', md: '40px', lg: '40px' }}
                onClick={fundAccountRedirect}>
                Fund Account
              </Button>

              <Button
                bg="#1D2667"
                color="white"
                _hover={{ bg: '#5363CE' }}
                _active={{ bg: '#5363CE' }}
                _focus={{ bg: '#5363CE' }}
                fontWeight="500"
                fontSize={{ base: '12px', md: '14px' }}
                py={{ base: '15px', md: '20px' }}
                px="27"
                leftIcon={<Box as={MdSend} size="20px" />}
                width={{ base: '100%', md: '200px' }}
                height={{ base: '45px', md: '40px', lg: '40px' }}
                onClick={sendFundRedirect}>
                Send Funds
              </Button>

              <Button
                bg="#1D2667"
                color="white"
                _hover={{ bg: '#5363CE' }}
                _active={{ bg: '#5363CE' }}
                _focus={{ bg: '#5363CE' }}
                fontWeight="500"
                fontSize={{ base: '12px', md: '14px' }}
                py={{ base: '15px', md: '20px' }}
                px="27"
                leftIcon={<Box as={MdCurrencyExchange} size="20px" />}
                width={{ base: '100%', md: '200px' }}
                height={{ base: '45px', md: '40px', lg: '40px' }}
                onClick={exchangeRedirect}>
                Exchange Rate
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Card>
  );
}
