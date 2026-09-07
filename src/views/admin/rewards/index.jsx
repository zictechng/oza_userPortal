
import React, { useEffect } from 'react';
import {
  Box, Flex, Text, Icon, Button,
  useColorModeValue, Badge, Divider,
  Spinner, SimpleGrid, Progress,
} from '@chakra-ui/react';
import {
  MdStars, MdEmojiEvents, MdTrendingUp,
  MdCardGiftcard, MdInfo,
} from 'react-icons/md';
import { useSelector } from 'react-redux';
import { PageLayout, PageCard } from 'layouts/PageLayout';

export default function Rewards() {
  const { user } = useSelector(state => state.authUser);
  const userData = user?.userData;

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    'linear-gradient(135deg, #3D2A00 0%, #2D1E00 100%)'
  );

  const coinsBalance = Number(userData?.coins_balance || 0);
  const bonusBalance = Number(userData?.all_bonus_acct || 0);

  // Tier system
  const tiers = [
    { name: 'Bronze', min: 0, max: 999, color: '#CD7F32', icon: '🥉' },
    { name: 'Silver', min: 1000, max: 4999, color: '#C0C0C0', icon: '🥈' },
    { name: 'Gold', min: 5000, max: 19999, color: '#FFD700', icon: '🥇' },
    { name: 'Platinum', min: 20000, max: 99999, color: '#E5E4E2', icon: '💎' },
    { name: 'Diamond', min: 100000, max: Infinity, color: '#B9F2FF', icon: '💫' },
  ];

  const currentTier = tiers.find(t => coinsBalance >= t.min && coinsBalance <= t.max) || tiers[0];
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];
  const tierProgress = nextTier
    ? Math.min(((coinsBalance - currentTier.min) / (nextTier.min - currentTier.min)) * 100, 100)
    : 100;

  return (
    <PageLayout>
      {/* Banner */}
      <Box bg={bannerGrad} borderRadius='20px' p='28px' mb='24px'
        position='relative' overflow='hidden'>
        <Box position='absolute' top='-40px' right='-40px'
          w='150px' h='150px' borderRadius='full' bg='whiteAlpha.100' />
        <Flex justify='space-between' align='center' flexWrap='wrap'
          gap='16px' position='relative' zIndex='1'>
          <Box>
            <Text color='whiteAlpha.700' fontSize='sm' mb='4px'>Your Coins Balance</Text>
            <Text color='white' fontSize='3xl' fontWeight='800'>
              {coinsBalance.toLocaleString()} coins
            </Text>
            <Flex align='center' gap='8px' mt='8px'>
              <Text fontSize='20px'>{currentTier.icon}</Text>
              <Text color='whiteAlpha.800' fontSize='sm' fontWeight='600'>
                {currentTier.name} Member
              </Text>
            </Flex>
          </Box>
          <Box
            bg='whiteAlpha.200' borderRadius='16px' p='16px'
            textAlign='center' minW='120px'>
            <Text color='whiteAlpha.700' fontSize='sm' mb='4px'>Bonus Wallet</Text>
            <Text color='white' fontSize='lg' fontWeight='800'>
              ₦{bonusBalance.toLocaleString()}
            </Text>
          </Box>
        </Flex>

        {/* Tier Progress */}
        {nextTier && (
          <Box mt='20px' position='relative' zIndex='1'>
            <Flex justify='space-between' mb='6px'>
              <Text color='whiteAlpha.700' fontSize='sm'>
                {coinsBalance.toLocaleString()} coins
              </Text>
              <Text color='whiteAlpha.700' fontSize='sm'>
                {nextTier.min.toLocaleString()} to {nextTier.name}
              </Text>
            </Flex>
            <Progress
              value={tierProgress}
              size='sm'
              borderRadius='full'
              bg='whiteAlpha.300'
              colorScheme='yellow'
            />
          </Box>
        )}
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap='20px' mb='24px'>
        {/* Tiers Card */}
        <PageCard p='24px'>
          <Text color={textColor} fontWeight='700' fontSize='md' mb='16px'>
            Membership Tiers
          </Text>
          {tiers.map((tier, i) => (
            <Box key={i}>
              <Flex align='center' justify='space-between' py='12px'>
                <Flex align='center' gap='12px'>
                  <Text fontSize='20px'>{tier.icon}</Text>
                  <Box>
                    <Text color={textColor} fontSize='sm' fontWeight='600'>
                      {tier.name}
                      {currentTier.name === tier.name && (
                        <Badge ml='8px' colorScheme='yellow' borderRadius='full' fontSize='9px'>
                          Current
                        </Badge>
                      )}
                    </Text>
                    <Text color={subColor} fontSize='sm'>
                      {tier.max === Infinity
                        ? `${tier.min.toLocaleString()}+ coins`
                        : `${tier.min.toLocaleString()} - ${tier.max.toLocaleString()} coins`}
                    </Text>
                  </Box>
                </Flex>
                {currentTier.name === tier.name && (
                  <Icon as={MdEmojiEvents} color='yellow.500' w='20px' h='20px' />
                )}
              </Flex>
              {i < tiers.length - 1 && <Divider borderColor={borderColor} />}
            </Box>
          ))}
        </PageCard>

        {/* How to Earn Card */}
        <Flex direction='column' gap='16px'>
          <PageCard p='24px'>
            <Text color={textColor} fontWeight='700' fontSize='md' mb='16px'>
              How to Earn Coins
            </Text>
            {[
              { icon: MdTrendingUp, label: 'Buy Virtual Funds', desc: 'Earn coins on every purchase', color: '#4C5FD5' },
              { icon: MdCardGiftcard, label: 'Bills Payment', desc: 'Earn coins on airtime, data and more', color: '#10B981' },
              { icon: MdStars, label: 'Referrals', desc: 'Bonus coins when referrals transact', color: '#F59E0B' },
            ].map((item, i) => (
              <Flex key={i} align='center' gap='12px' mb='16px'>
                <Box w='40px' h='40px' borderRadius='12px'
                  bg={`${item.color}15`}
                  display='flex' alignItems='center' justifyContent='center' flexShrink='0'>
                  <Icon as={item.icon} color={item.color} w='20px' h='20px' />
                </Box>
                <Box>
                  <Text color={textColor} fontSize='sm' fontWeight='600'>{item.label}</Text>
                  <Text color={subColor} fontSize='sm'>{item.desc}</Text>
                </Box>
              </Flex>
            ))}
          </PageCard>

          <PageCard p='24px'>
            <Flex align='center' gap='8px' mb='12px'>
              <Icon as={MdInfo} color='blue.400' w='18px' h='18px' />
              <Text color={textColor} fontWeight='700' fontSize='sm'>
                Coins Information
              </Text>
            </Flex>
            {[
              'Coins are earned automatically on every transaction',
              'Higher tier members earn coins at a faster rate',
              'Coins can be redeemed for transaction discounts',
              'Contact support to redeem your coins',
            ].map((note, i) => (
              <Flex key={i} align='flex-start' gap='8px' mb='8px'>
                <Box w='6px' h='6px' borderRadius='full'
                  bg='brand.500' mt='6px' flexShrink='0' />
                <Text color={subColor} fontSize='sm'>{note}</Text>
              </Flex>
            ))}
          </PageCard>
        </Flex>
      </SimpleGrid>
    </PageLayout>
  );
}