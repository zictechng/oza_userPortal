/*eslint-disable*/
import React from 'react';
import {
  Flex, Link, List, ListItem, Text, useColorModeValue,
} from '@chakra-ui/react';
import { useAppContext } from 'contexts/AppContext';

export default function Footer() {
  const textColor = useColorModeValue('gray.400', 'white');
  const { appName } = useAppContext();
  const year = new Date().getFullYear();

  return (
    <Flex
      zIndex='3'
      flexDirection={{ base: 'column', xl: 'row' }}
      alignItems={{ base: 'center', xl: 'start' }}
      justifyContent='space-between'
      px={{ base: '30px', md: '50px' }}
      pb='30px'>
      <Text
        color={textColor}
        textAlign={{ base: 'center', xl: 'start' }}
        mb={{ base: '20px', xl: '0px' }}
        fontSize='sm'>
        &copy; {year}{' '}
        <Text as='span' fontWeight='500' ms='4px'>
          {appName || ''}. All Rights Reserved.
        </Text>
      </Text>
      <List display='flex'>
        <ListItem me={{ base: '20px', md: '44px' }}>
          <Link fontWeight='500' color={textColor} href='/user/support'>
            Support
          </Link>
        </ListItem>
        <ListItem me={{ base: '20px', md: '44px' }}>
          <Link fontWeight='500' color={textColor} href='/terms'>
            Terms and Conditions
          </Link>
        </ListItem>
        <ListItem me={{ base: '20px', md: '44px' }}>
          <Link fontWeight='500' color={textColor} href='/privacy'>
            Privacy Policy
          </Link>
        </ListItem>
        <ListItem>
          <Link fontWeight='500' color={textColor} href='/about'>
            About
          </Link>
        </ListItem>
      </List>
    </Flex>
  );
}