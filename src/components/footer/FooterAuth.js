import React from 'react';
import { Flex, Text, Link, useColorModeValue } from '@chakra-ui/react';
import { useAppContext } from 'contexts/AppContext';

export default function FooterAuth() {
  const textColor = useColorModeValue('gray.400', 'whiteAlpha.600');
  const { appName } = useAppContext();
  const year = new Date().getFullYear();

  return (
    <Flex
      justify='space-between'
      align='center'
      pt='24px'
      mt='24px'
      borderTop='1px solid'
      borderColor={useColorModeValue('gray.100', 'whiteAlpha.200')}
      flexWrap='wrap'
      gap='8px'>
      <Text color={textColor} fontSize='xs'>
        &copy; {year} {appName || ''}. All rights reserved.
      </Text>
      <Flex gap='16px'>
        <Link href='/terms' color={textColor} fontSize='xs' _hover={{ color: 'brand.500' }}>
          Terms
        </Link>
        <Link href='/privacy' color={textColor} fontSize='xs' _hover={{ color: 'brand.500' }}>
          Privacy
        </Link>
        <Link href='/user/support' color={textColor} fontSize='xs' _hover={{ color: 'brand.500' }}>
          Support
        </Link>
      </Flex>
    </Flex>
  );
}