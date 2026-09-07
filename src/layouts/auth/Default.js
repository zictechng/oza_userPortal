import {
  Box, Flex, Text, Image, useColorModeValue,
  useColorMode, IconButton, Tooltip,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useAppContext } from 'contexts/AppContext';
import FooterAuth from 'components/footer/FooterAuth';

function AuthIllustration(props) {
  const { children, illustrationBackground } = props;
  const { appName, appLogo } = useAppContext();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'navy.900');
  const textColor = useColorModeValue('navy.700', 'white');
  const panelBg = useColorModeValue(
    'linear-gradient(135deg, #4C5FD5 0%, #3D4EAA 100%)',
    'linear-gradient(135deg, #1E2C5A 0%, #111c44 100%)'
  );

  return (
    <Flex
      minH='100vh'
      bg={bgColor}
      position='relative'>

      {/* Left Panel — Form */}
      <Flex
        flex={{ base: 1, lg: '0 0 520px' }}
        direction='column'
        px={{ base: '24px', md: '48px', lg: '60px' }}
        py='40px'
        overflowY='auto'>

        {/* Header — Logo + Dark Mode */}
        <Flex justify='space-between' align='center' mb='48px'>
          <Flex align='center' gap='10px'>
          {appLogo ? (
            <Image src={appLogo} alt={appName} h='32px' objectFit='contain' />
          ) : (
            <Flex align='center' gap='8px'>
              <Box
                w='36px' h='36px' borderRadius='10px'
                bg='brand.500'
                display='flex' alignItems='center' justifyContent='center'
                shadow='md'>
                <Text color='white' fontWeight='800' fontSize='18px'>
                  {appName ? appName.charAt(0) : '•'}
                </Text>
              </Box>
              {appName && (
                <Text
                  fontSize='20px' fontWeight='800'
                  color={textColor}
                  letterSpacing='-0.5px'>
                  {appName}
                </Text>
              )}
            </Flex>
          )}
          </Flex>

          <Tooltip label={colorMode === 'light' ? 'Dark mode' : 'Light mode'}>
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant='ghost'
              size='sm'
              borderRadius='10px'
              aria-label='Toggle color mode'
            />
          </Tooltip>
        </Flex>

        {/* Form Content */}
        <Box flex='1'>
          {children}
        </Box>

        {/* Footer */}
        <FooterAuth />
      </Flex>

      {/* Right Panel — Illustration */}
      <Box
        display={{ base: 'none', lg: 'flex' }}
        flex='1'
        bg={panelBg}
        position='relative'
        overflow='hidden'
        borderRadius='0 0 0 80px'>

        {/* Background illustration */}
        <Box
          position='absolute'
          inset='0'
          bgImage={`url(${illustrationBackground})`}
          bgSize='cover'
          bgPosition='center'
          opacity={colorMode === 'light' ? 0.15 : 0.1}
        />

        {/* Overlay content */}
        <Flex
          position='relative'
          zIndex='1'
          direction='column'
          justify='center'
          align='center'
          w='100%'
          px='60px'
          color='white'>
          <Box
            w='80px' h='80px' borderRadius='20px'
            bg='whiteAlpha.200'
            display='flex' alignItems='center' justifyContent='center'
            mb='24px'
            shadow='xl'>
            {appLogo ? (
              <Image src={appLogo} alt={appName} h='48px' objectFit='contain' />
            ) : (
              <Text fontSize='40px' fontWeight='800'>
                {appName?.charAt(0) || '✦'}
              </Text>
            )}
          </Box>
          <Text fontSize='32px' fontWeight='800' textAlign='center' mb='16px' lineHeight='1.2'>
            {appName ? `Welcome to ${appName}` : 'Welcome'}
          </Text>
          <Text fontSize='18px' textAlign='center' opacity={0.8} maxW='340px' lineHeight='1.6'>
            The secure and profitable way to manage your virtual funds
          </Text>

          {/* Feature dots */}
          <Flex gap='12px' mt='48px'>
            {['Buy & Sell Virtual Funds', 'Bills Payment', 'Earn Rewards'].map((item, i) => (
              <Box
                key={i}
                px='16px' py='8px'
                bg='whiteAlpha.200'
                borderRadius='full'
                fontSize='20px'
                fontWeight='800'>
                {item}
              </Box>
            ))}
          </Flex>
        </Flex>

        {/* Decorative circles */}
        <Box
          position='absolute'
          bottom='-80px'
          right='-80px'
          w='300px' h='300px'
          borderRadius='full'
          bg='whiteAlpha.100'
        />
        <Box
          position='absolute'
          top='-60px'
          left='-60px'
          w='200px' h='200px'
          borderRadius='full'
          bg='whiteAlpha.100'
        />
      </Box>
    </Flex>
  );
}

AuthIllustration.propTypes = {
  illustrationBackground: PropTypes.string,
  image: PropTypes.any,
};

export default AuthIllustration;