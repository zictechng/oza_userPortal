
import React, { useEffect } from 'react';
import {
  Box, Flex, Text, Icon, Button,
  useColorModeValue, Badge, Divider,
  Spinner, SimpleGrid, useClipboard,
} from '@chakra-ui/react';
import {
  MdPeople, MdContentCopy, MdCheck,
  MdArrowDownward, MdArrowUpward,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  fetchReferral, clearProducts, setPage,
} from 'storeMtg/getReferralSlice';
import { PageLayout, PageCard } from 'layouts/PageLayout';

const statusColor = (status) => {
  if (status === 'Approved') return 'green';
  if (status === 'Pending') return 'orange';
  return 'gray';
};

export default function Referral() {
  const dispatch = useDispatch();
  const { user, userToken } = useSelector(state => state.authUser);
  const {
    referralData, currentPage, totalPages,
    initialLoading, paginationLoading,
  } = useSelector(state => state.referral);

  const userData = user?.userData;
  const shareText = `Join ${user?.appData?.app_name || ''} and earn rewards! Use my referral ID: ${userData?.tag_id}`;
  const { onCopy, hasCopied } = useClipboard(shareText);

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const tagBg = useColorModeValue('brand.50', 'navy.700');
  const bannerGrad = useColorModeValue(
    'linear-gradient(135deg, #4C5FD5 0%, #6C5CE7 100%)',
    'linear-gradient(135deg, #1E2C5A 0%, #2D3A6A 100%)'
  );

  useEffect(() => {
    if (!userData?._id || !userToken) return;
    dispatch(fetchReferral({
      userID: userData._id,
      user_token: userToken,
      page: 1,
      pageSize: 15,
    }));
    return () => dispatch(clearProducts());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userData?._id, userToken]);

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    dispatch(fetchReferral({
      userID: userData._id,
      user_token: userToken,
      page: newPage,
      pageSize: 15,
    }));
  };

  const referrals = Array.isArray(referralData) ? referralData : [];
  const approvedCount = referrals.filter(r => r.ref_status === 'Approved').length;
  const totalEarned = referrals
    .filter(r => r.ref_status === 'Approved')
    .reduce((sum, r) => sum + Number(r.ref_amt || 0), 0);

  return (
    <PageLayout>
      {/* Banner */}
      <Box bg={bannerGrad} borderRadius='20px' p='28px' mb='24px'
        position='relative' overflow='hidden'>
        <Box position='absolute' top='-40px' right='-40px'
          w='150px' h='150px' borderRadius='full' bg='whiteAlpha.100' />
        <Box position='absolute' bottom='-20px' right='80px'
          w='80px' h='80px' borderRadius='full' bg='whiteAlpha.100' />

        <Flex justify='space-between' align='center' flexWrap='wrap'
          gap='16px' position='relative' zIndex='1'>
          <Box>
            <Text color='whiteAlpha.700' fontSize='sm' mb='4px'>
              Your Referral ID
            </Text>
            <Text color='white' fontSize='3xl' fontWeight='800' letterSpacing='4px'>
              {userData?.tag_id || '—'}
            </Text>
            <Text color='whiteAlpha.600' fontSize='xs' mt='4px'>
              Share this ID to earn referral bonuses
            </Text>
          </Box>
          <Button
            bg='white' color='brand.500'
            borderRadius='12px' fontWeight='700'
            leftIcon={<Icon as={hasCopied ? MdCheck : MdContentCopy} />}
            _hover={{ bg: 'whiteAlpha.900' }}
            onClick={onCopy}>
            {hasCopied ? 'Copied!' : 'Copy & Share'}
          </Button>
        </Flex>
      </Box>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap='16px' mb='24px'>
        {[
          { label: 'Total Referrals', value: referrals.length, color: 'brand.500', bg: 'brand.50' },
          { label: 'Approved', value: approvedCount, color: 'green.500', bg: 'green.50' },
          { label: 'Pending', value: referrals.length - approvedCount, color: 'orange.500', bg: 'orange.50' },
          { label: 'Total Earned', value: `₦${totalEarned.toLocaleString()}`, color: 'purple.500', bg: 'purple.50' },
        ].map((stat, i) => (
          <Box key={i} bg={textColor}
            borderRadius='16px' p='20px'
            border='1px solid' borderColor={borderColor}
            boxShadow='0 2px 8px rgba(0,0,0,0.06)'>
            <Box w='36px' h='36px' borderRadius='10px'
              bg={stat.bg} display='flex' alignItems='center'
              justifyContent='center' mb='10px'>
              <Icon as={MdPeople} color={stat.color} w='18px' h='18px' />
            </Box>
            <Text color={subColor} fontSize='xs' fontWeight='600'
              textTransform='uppercase' letterSpacing='0.5px' mb='4px'>
              {stat.label}
            </Text>
            <Text color={textColor} fontSize='lg' fontWeight='800'>
              {stat.value}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* Referral List */}
      <PageCard p='0' overflow='hidden'>
        <Flex px='20px' py='16px' justify='space-between' align='center'
          borderBottom='1px solid' borderColor={borderColor}>
          <Text color={textColor} fontWeight='700' fontSize='sm'>
            Referral History
          </Text>
          <Text color={subColor} fontSize='xs'>
            {referrals.length} referrals
          </Text>
        </Flex>

        {initialLoading ? (
          <Flex justify='center' py='48px'><Spinner color='brand.500' size='lg' /></Flex>
        ) : referrals.length === 0 ? (
          <Flex direction='column' align='center' py='48px' color={subColor}>
            <Icon as={MdPeople} w='48px' h='48px' mb='12px' opacity={0.4} />
            <Text fontSize='sm' fontWeight='500'>No referrals yet</Text>
            <Text fontSize='xs' mt='4px'>
              Share your Tag ID to start earning referral bonuses
            </Text>
          </Flex>
        ) : (
          <Box opacity={paginationLoading ? 0.6 : 1} transition='opacity 0.2s'>
            {referrals.map((ref, i) => (
              <Box key={ref._id || i}>
                <Flex align='center' px='20px' py='16px' gap='12px'>
                  <Box
                    w='40px' h='40px' borderRadius='12px'
                    bg={ref.ref_status === 'Approved' ? '#D1FAE5' : '#FEF3C7'}
                    display='flex' alignItems='center'
                    justifyContent='center' flexShrink='0'>
                    <Icon
                      as={ref.ref_status === 'Approved' ? MdArrowDownward : MdPeople}
                      color={ref.ref_status === 'Approved' ? 'green.500' : 'orange.500'}
                      w='18px' h='18px'
                    />
                  </Box>
                  <Box flex='1' minW='0'>
                    <Text color={textColor} fontSize='sm' fontWeight='600' noOfLines={1}>
                      {ref.ref_userName || ref.ref_userEmail || 'Referred User'}
                    </Text>
                    <Text color={subColor} fontSize='xs'>
                      {ref.createdOn
                        ? moment(ref.createdOn).format('DD MMM YYYY')
                        : '—'}
                    </Text>
                  </Box>
                  <Box textAlign='right'>
                    <Badge colorScheme={statusColor(ref.ref_status)}
                      borderRadius='full' fontSize='10px' px='8px' mb='4px'>
                      {ref.ref_status || 'Pending'}
                    </Badge>
                    {ref.ref_amt > 0 && (
                      <Text color='green.500' fontSize='sm' fontWeight='700'>
                        +₦{Number(ref.ref_amt).toLocaleString()}
                      </Text>
                    )}
                  </Box>
                </Flex>
                {i < referrals.length - 1 && <Divider borderColor={borderColor} />}
              </Box>
            ))}
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && !initialLoading && (
          <Flex justify='space-between' align='center'
            px='20px' py='16px'
            borderTop='1px solid' borderColor={borderColor}>
            <Text color={subColor} fontSize='sm'>
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </Text>
            <Flex gap='8px'>
              <Button size='sm' borderRadius='10px' variant='outline'
                isDisabled={currentPage === 1 || paginationLoading}
                onClick={() => handlePageChange(currentPage - 1)}>
                ← Prev
              </Button>
              <Button size='sm' borderRadius='10px' variant='outline'
                isDisabled={currentPage === totalPages || paginationLoading}
                onClick={() => handlePageChange(currentPage + 1)}>
                Next →
              </Button>
            </Flex>
          </Flex>
        )}
      </PageCard>
    </PageLayout>
  );
}