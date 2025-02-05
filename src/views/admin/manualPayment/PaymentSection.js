/* eslint-disable */

import {
  Box,
  Flex,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  createColumnHelper,
} from '@tanstack/react-table';
import * as React from 'react';

const columnHelper = createColumnHelper();

export default function TopCreatorTable(props) {
  const { data, companyName } = props;

  return (
    <Flex
      direction="column"
      w="100%"
      overflowX={{ lg: 'hidden' }}
    >
      <Flex
        align={{ sm: 'flex-start', lg: 'center' }}
        justify="space-between"
        w="100%"
        px="22px"
        pb="20px"
        mb="10px"
        boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)"
      >
        <Text color={'#aaa'} fontSize="xl" fontWeight="600">
         Note
        </Text>
        {/* <Button variant="action">See all</Button> */}
      </Flex>
        <Box ml={5}>
            <Text mt={4} fontSize='20px' fontWeight='600'>Request elapsed within one hour</Text>
            <Text mt={4} fontSize='16px' fontWeight='300'>Payment should be made to {companyName} official account only.</Text>
            <Text mt={4} fontSize='20px' fontWeight='300' align='center'><b>Ref ID: </b>{data} </Text>
        </Box>

    </Flex>
  );
}
