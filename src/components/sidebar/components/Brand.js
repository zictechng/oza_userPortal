import React from 'react';
import { Flex, Image, Text, Box, useColorMode } from '@chakra-ui/react';
import { HSeparator } from 'components/separator/Separator';
import { useAppContext } from 'contexts/AppContext';

export function SidebarBrand() {
  const { colorMode } = useColorMode();
  const { appName, appLogo } = useAppContext();

  return (
    <Flex align='center' direction='column'>
      {appLogo ? (
        <Image
          src={appLogo}
          alt={appName}
          h='32px'
          objectFit='contain'
          my='16px'
        />
      ) : (
        <Flex align='center' gap='8px' my='16px'>
          <Box
            w='32px' h='32px'
            borderRadius='8px'
            bg='brand.500'
            display='flex'
            alignItems='center'
            justifyContent='center'>
            <Text color='white' fontWeight='800' fontSize='16px'>
              {appName?.charAt(0) || 'A'}
            </Text>
          </Box>
          <Text
            fontSize='20px'
            fontWeight='800'
            color={colorMode === 'light' ? 'brand.500' : 'white'}
            letterSpacing='-0.5px'>
            {appName || ''}
          </Text>
        </Flex>
      )}
      <HSeparator mb='20px' mt='10px' />
    </Flex>
  );
}

export default SidebarBrand;