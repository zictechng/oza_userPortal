import React from 'react';
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';

// Reusable page wrapper
export const PageLayout = ({ children, noPadding = false }) => {
  const bg = useColorModeValue('gray.100', 'navy.900');
  return (
    <Box
      pt={{ base: '100px', md: '80px' }}
      px={noPadding ? 0 : { base: '16px', md: '24px' }}
      pb='40px'
      bg={bg}
      minH='100vh'>
      {children}
    </Box>
  );
};

// Reusable card with clear shadow and border
export const PageCard = ({ children, p = '24px', ...rest }) => {
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  return (
    <Box
      bg={cardBg}
      borderRadius='20px'
      border='1px solid'
      borderColor={borderColor}
      boxShadow='0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)'
      p={p}
      {...rest}>
      {children}
    </Box>
  );
};

// Section title
export const PageSection = ({ title, subtitle, action }) => {
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  return (
    <Flex justify='space-between' align='center' mb='20px'>
      <Box>
        {subtitle && (
          <Text color={subColor} fontSize='xs' fontWeight='500' mb='2px'>
            {subtitle}
          </Text>
        )}
        <Text color={textColor} fontSize='lg' fontWeight='800'>
          {title}
        </Text>
      </Box>
      {action && action}
    </Flex>
  );
};