import { Box, Flex, Icon, Text, Image } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import Footer from 'components/footer/FooterAuth';
import { useAppContext } from 'contexts/AppContext';

function AuthIllustration(props) {
  const { children, illustrationBackground } = props;
  const { appName, appLogo } = useAppContext();

  return (
    <Flex position='relative' h='max-content'>
      <Flex
        h={{ sm: 'initial', md: 'unset', lg: '100vh', xl: '97vh' }}
        w='100%'
        maxW={{ md: '66%', lg: '1313px' }}
        mx='auto'
        pt={{ sm: '10px', md: '0px' }}
        px={{ lg: '30px', xl: '0px' }}
        ps={{ xl: '70px' }}
        justifyContent='start'
        direction='column'>

        {/* Top Logo */}
        <Flex
          align='center'
          gap='10px'
          ps={{ base: '25px', lg: '0px' }}
          pt={{ lg: '30px', xl: '30px', sm: '20px' }}
          w='fit-content'
          mb='10px'>
          {appLogo ? (
            <Image src={appLogo} alt={appName} h='32px' objectFit='contain' />
          ) : (
            <Box
              w='32px' h='32px' borderRadius='8px'
              bg='brand.500'
              display='flex' alignItems='center' justifyContent='center'>
              <Text color='white' fontWeight='800' fontSize='16px'>
                {appName?.charAt(0) || 'A'}
              </Text>
            </Box>
          )}
          <Text fontSize='20px' fontWeight='800' color='brand.500' letterSpacing='-0.5px'>
            {appName || ''}
          </Text>
        </Flex>

        {children}

        {/* Right illustration panel */}
        <Box
          display={{ base: 'none', md: 'block' }}
          h='100%'
          minH='100vh'
          w={{ lg: '50vw', '2xl': '44vw' }}
          position='absolute'
          right='0px'>
          <Flex
            bg={`url(${illustrationBackground})`}
            justify='center'
            align='end'
            w='100%'
            h='100%'
            bgSize='cover'
            bgPosition='50%'
            position='absolute'
            borderBottomLeftRadius={{ lg: '120px', xl: '200px' }}>
          </Flex>
        </Box>
        <Footer />
      </Flex>
    </Flex>
  );
}

AuthIllustration.propTypes = {
  illustrationBackground: PropTypes.string,
  image: PropTypes.any,
};

export default AuthIllustration;