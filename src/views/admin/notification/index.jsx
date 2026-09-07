import React, { useEffect } from 'react';
import {
  Box, Flex, Text, Icon, Button, Badge,
  useColorModeValue, Spinner, Divider,
} from '@chakra-ui/react';
import { MdNotifications, MdCircle } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  getNotificationHistory, clearNotifications,
  setPage, resetPage,
} from 'storeMtg/notificationSlice';
import { PageLayout, PageCard } from 'layouts/PageLayout';

export default function Notifications() {
  const dispatch = useDispatch();
  const { user, userToken } = useSelector(state => state.authUser);
  const {
    notificationData, currentPage, totalPages,
    initialLoading, paginationLoading,
  } = useSelector(state => state.notifications);

  const userData = user?.userData;

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const unreadBg = useColorModeValue('brand.50', 'navy.700');
  const headerBg = useColorModeValue('gray.50', 'navy.700');
  const statBg = useColorModeValue('white', 'navy.800');
  const unreadStatBg = useColorModeValue('brand.50', 'navy.800');
  const rowHoverBg = useColorModeValue('gray.50', 'navy.700');

  useEffect(() => {
    dispatch(resetPage());
    return () => dispatch(clearNotifications());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userData?._id || !userToken) return;
    dispatch(getNotificationHistory({
      userID: userData._id,
      user_token: userToken,
      page: currentPage,
      pageSize: 20,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentPage, userData?._id, userToken]);

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const notifications = Array.isArray(notificationData) ? notificationData : [];
  const unreadCount = notifications.filter(n => n.alert_status === 1).length;

  return (
    <PageLayout>
      {/* Stats */}
      <Flex gap='12px' mb='20px' flexWrap='wrap'>
       
        {unreadCount > 0 && (
          <Box bg={unreadStatBg} borderRadius='16px' px='20px' py='14px'
            border='1px solid' borderColor='brand.200'>
            <Text color='brand.500' fontSize='xs' fontWeight='600'
              textTransform='uppercase' letterSpacing='0.5px' mb='2px'>
              Unread
            </Text>
            <Text color='brand.500' fontSize='lg' fontWeight='800'>
              {unreadCount}
            </Text>
          </Box>
        )}
      </Flex>

      <PageCard p='0' overflow='hidden'>
        {/* Header */}
        <Flex px='20px' py='14px' bg={headerBg}
          borderBottom='1px solid' borderColor={borderColor}
          justify='space-between' align='center'>
          <Text color={textColor} fontSize='sm' fontWeight='700'>
            All Notifications
          </Text>
          
        </Flex>

        {initialLoading ? (
          <Flex justify='center' py='48px'>
            <Spinner color='brand.500' size='lg' />
          </Flex>
        ) : paginationLoading ? (
          <Flex justify='center' py='48px'>
            <Spinner color='brand.500' size='md' />
          </Flex>
        ) : notifications.length === 0 ? (
          <Flex direction='column' align='center' py='48px' color={subColor}>
            <Icon as={MdNotifications} w='48px' h='48px' mb='12px' opacity={0.4} />
            <Text fontSize='sm' fontWeight='500'>No notifications yet</Text>
            <Text fontSize='xs' mt='4px'>
              Account alerts and updates will appear here
            </Text>
          </Flex>
        ) : (
          <Box>
            {notifications.map((notif, i) => (
              <Box key={notif._id || i}>
                <Flex
                  align='flex-start'
                  px='20px' py='16px'
                  bg={notif.alert_status === 1 ? unreadBg : 'transparent'}
                  gap='14px'
                  _hover={{ bg: rowHoverBg, borderRadius: '8px', px: '12px' }}
                  transition='all 0.15s'>

                  {/* Icon */}
                  <Box
                    w='40px' h='40px' borderRadius='12px'
                    bg='brand.100' flexShrink='0' mt='2px'
                    display='flex' alignItems='center' justifyContent='center'>
                    <Icon as={MdNotifications} color='brand.500' w='20px' h='20px' />
                  </Box>

                  {/* Content */}
                  <Box flex='1'>
                    <Flex justify='space-between' align='flex-start' mb='4px'>
                      <Text color={textColor} fontSize='sm' fontWeight='600'>
                        {notif.alert_name || 'Notification'}
                      </Text>
                      <Flex align='center' gap='6px' flexShrink='0' ml='16px'>
                        {notif.alert_status === 1 && (
                          <Icon as={MdCircle} color='brand.500' w='8px' h='8px' />
                        )}
                        <Text color={subColor} fontSize='xs'>
                          {notif.alert_date ? moment(notif.alert_date).fromNow() : '—'}
                        </Text>
                      </Flex>
                    </Flex>
                    <Text color={subColor} fontSize='xs' lineHeight='1.6' whiteSpace='pre-line'>
                      {notif.alert_nature}
                    </Text>
                  </Box>
                </Flex>
                {i < notifications.length - 1 && (
                  <Divider borderColor={borderColor} />
                )}
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
            <Flex gap='8px' align='center'>
              {paginationLoading && <Spinner size='sm' color='brand.500' />}
              <Button size='sm' borderRadius='10px' variant='outline'
                isDisabled={currentPage === 1 || paginationLoading}
                isLoading={paginationLoading}
                onClick={() => handlePageChange(currentPage - 1)}>
                ← Prev
              </Button>
              <Button size='sm' borderRadius='10px' variant='outline'
                isDisabled={currentPage === totalPages || paginationLoading}
                isLoading={paginationLoading}
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