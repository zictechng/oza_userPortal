import {
  Button, Flex, Text, useColorModeValue, useClipboard,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppContext } from 'contexts/AppContext';
import { getExchangeRate } from 'storeMtg/exchangeRateSlice';

export default function SidebarDocs() {
  const dispatch = useDispatch();
  const { appName } = useAppContext();
  const { user, userToken } = useSelector(state => state.authUser);
  const [bonusAmount, setBonusAmount] = useState('');
  const [shareText, setShareText] = useState('');
  const { onCopy, hasCopied } = useClipboard(shareText);

  useEffect(() => {
    dispatch(getExchangeRate()).then(response => {
      const rate = response.payload?.bonus_rate || '';
      setBonusAmount(rate);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tagId = user?.userData?.tag_id || '';
    const name = appName || user?.appData?.app_name || '';
    const baseUrl = user?.appData?.app_baseurl || '';
    setShareText(
      `${name} is reliable for all virtual funds exchange. I use it to sell PayPal, Payoneer and Bitcoin funds at great rates. Use my ID ${tagId} to join and get free cash! Visit ${baseUrl || 'ota.com'}`
    );
  }, [user, appName]);

  const name = appName || user?.appData?.app_name || '';
  const tagId = user?.userData?.tag_id || '';

  return (
    <Flex
      justify='center'
      direction='column'
      align='center'
      bg='linear-gradient(135deg, #4C5FD5 0%, #3D4EAA 100%)'
      borderRadius='24px'
      p='20px'
      pt='40px'
      position='relative'>

      {/* Avatar */}
      <Flex
        w='64px' h='64px' borderRadius='50%'
        bg='whiteAlpha.300'
        border='3px solid'
        borderColor='whiteAlpha.500'
        align='center' justify='center'
        position='absolute'
        top='-32px'>
        <Text fontSize='28px'>🎁</Text>
      </Flex>

      <Text
        fontSize='16px' color='white'
        fontWeight='700' textAlign='center' mb='8px'>
        Invite a friend
      </Text>

      <Text
        fontSize='12px' color='whiteAlpha.800'
        textAlign='center' mb='8px' lineHeight='1.5'>
        Share your referral ID and both of you get
        {bonusAmount ? (
          <Text as='span' fontWeight='700' color='yellow.300'> ${bonusAmount} </Text>
        ) : ' a bonus '}
        credited instantly
      </Text>

      <Flex
        bg='whiteAlpha.200'
        borderRadius='10px'
        px='12px' py='6px'
        mb='12px' align='center' gap='8px'>
        <Text fontSize='xs' color='whiteAlpha.700'>Tag ID:</Text>
        <Text fontSize='sm' color='white' fontWeight='800' letterSpacing='1px'>
          {tagId}
        </Text>
      </Flex>

      <Button
        bg='white'
        color='brand.500'
        fontWeight='700'
        fontSize='sm'
        borderRadius='12px'
        w='100%'
        h='40px'
        _hover={{ bg: 'whiteAlpha.900' }}
        onClick={onCopy}>
        {hasCopied ? '✓ Copied!' : 'Copy & Share'}
      </Button>
    </Flex>
  );
}