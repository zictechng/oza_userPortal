import React from 'react';
import { Flex, Image, Text, Box, useColorMode } from '@chakra-ui/react';
import { HSeparator } from 'components/separator/Separator';
import { useAppContext } from 'contexts/AppContext';

export function SidebarBrand() {
  const { colorMode } = useColorMode();
  const { appName, appLogo } = useAppContext();

  return (
    <Flex direction='column'>
      <Flex align='center' gap='10px' my='16px' px='4px'>
        {/* Logo or initial */}
        {appLogo ? (
          <Image
            src={appLogo}
            alt={appName}
            h='32px'
            w='32px'
            objectFit='contain'
            borderRadius='8px'
            flexShrink='0'
          />
        ) : (
          <Box
            w='32px' h='32px'
            borderRadius='8px'
            bg='brand.500'
            display='flex'
            alignItems='center'
            justifyContent='center'
            flexShrink='0'>
            <Text color='white' fontWeight='800' fontSize='16px'>
              {appName?.charAt(0) || 'A'}
            </Text>
          </Box>
        )}

        {/* App name */}
        <Text
          fontSize='17px'
          fontWeight='800'
          color={colorMode === 'light' ? 'navy.700' : 'white'}
          letterSpacing='-0.5px'
          noOfLines={1}>
          {appName || ''}
        </Text>
      </Flex>

      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;