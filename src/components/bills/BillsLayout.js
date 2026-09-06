
import React from 'react';
import {
  Box, Flex, Text, Icon, Button,
  useColorModeValue, Badge,
} from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const BillsLayout = ({ title, subtitle, icon, iconBg, iconColor, children }) => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.authUser);
  const bg = useColorModeValue('gray.50', 'navy.900');
  const cardBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const balance = Number(user?.userData?.amount || 0);

  return (
    <Box
      pt={{ base: '100px', md: '80px' }}
      px={{ base: '16px', md: '24px' }}
      pb='40px'
      bg={bg}
      minH='100vh'>

      {/* Header */}
      <Flex align='center' gap='12px' mb='24px'>
        <Button
          variant='ghost' borderRadius='12px' p='8px'
          onClick={() => navigate(-1)}>
          <Icon as={MdArrowBack} w='20px' h='20px' />
        </Button>
        <Box
          w='44px' h='44px' borderRadius='12px'
          bg={iconBg}
          display='flex' alignItems='center' justifyContent='center'>
          <Icon as={icon} color={iconColor} w='22px' h='22px' />
        </Box>
        <Box>
          <Text color={textColor} fontSize='lg' fontWeight='800'>{title}</Text>
          {subtitle && (
            <Text color={subColor} fontSize='xs'>{subtitle}</Text>
          )}
        </Box>
        <Box ml='auto'>
          <Text color={subColor} fontSize='xs' textAlign='right'>Balance</Text>
          <Text color={textColor} fontSize='sm' fontWeight='700'>
            ₦{balance.toLocaleString()}
          </Text>
        </Box>
      </Flex>

      {/* Content */}
      <Box
        bg={cardBg}
        borderRadius='20px'
        p={{ base: '20px', md: '28px' }}
        border='1px solid'
        borderColor={borderColor}
        maxW='560px'
        mx='auto'>
        {children}
      </Box>
    </Box>
  );
};

// Reusable success result card
export const BillsSuccess = ({ title, items, onDone }) => {
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');

  return (
    <Box textAlign='center' py='16px'>
      <Box
        w='64px' h='64px' borderRadius='full'
        bg='green.100' display='flex'
        alignItems='center' justifyContent='center'
        mx='auto' mb='16px'>
        <Text fontSize='32px'>✅</Text>
      </Box>
      <Text color={textColor} fontSize='lg' fontWeight='800' mb='8px'>{title}</Text>
      <Text color={subColor} fontSize='sm' mb='24px'>Transaction completed successfully</Text>

      {items && items.map((item, i) => (
        <Flex key={i} justify='space-between' py='10px'
          borderBottom='1px solid' borderColor={borderColor}>
          <Text color={subColor} fontSize='sm'>{item.label}</Text>
          <Text color={textColor} fontSize='sm' fontWeight='600'>{item.value}</Text>
        </Flex>
      ))}

      <Button
        mt='24px' w='100%' h='48px'
        bg='brand.500' color='white'
        borderRadius='12px' fontWeight='700'
        _hover={{ bg: 'brand.600' }}
        onClick={onDone}>
        Done
      </Button>
    </Box>
  );
};