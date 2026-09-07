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

export default function Notifications() {
  const dispatch = useDispatch();
  const { user, userToken } = useSelector(state => state.authUser);
  const {
    notificationData, currentPage, totalPages,
    initialLoading, paginationLoading,
  } = useSelector(state => state.notifications);

  const userData = user?.userData;

  const bg = useColorModeValue('gray.50', 'navy.900');
  const cardBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const unreadBg = useColorModeValue('brand.50', 'navy.700');
  const headerBg = useColorModeValue('gray.50', 'navy.700');

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
    <Box
      pt={{ base: '100px', md: '80px' }}
      px={{ base: '16px', md: '24px' }}
      pb='40px'
      bg={bg}
      minH='100vh'>

      {/* Header */}
      <Flex justify='space-between' align='center' mb='24px'>
        <Box>
          <Text color={useColorModeValue('gray.500', 'gray.400')} fontSize='sm'>
            My Account
          </Text>
          <Flex align='center' gap='10px'>
            <Text color={textColor} fontSize='xl' fontWeight='800'>
              Notifications
            </Text>
            {unreadCount > 0 && (
              <Badge colorScheme='brand' borderRadius='full' px='10px'>
                {unreadCount} new
              </Badge>
            )}
          </Flex>
        </Box>
      </Flex>

      <Box
        bg={cardBg}
        borderRadius='20px'
        border='1px solid'
        borderColor={borderColor}
        overflow='hidden'>

        {/* Header */}
        <Flex
          px='20px' py='14px'
          bg={headerBg}
          borderBottom='1px solid'
          borderColor={borderColor}
          justify='space-between' align='center'>
          <Text color={subColor} fontSize='xs' fontWeight='700'
            textTransform='uppercase' letterSpacing='0.5px'>
            {notifications.length} Notifications
          </Text>
        </Flex>

        {initialLoading ? (
          <Flex justify='center' py='48px'>
            <Spinner color='brand.500' size='lg' />
          </Flex>
        ) : notifications.length === 0 ? (
          <Flex direction='column' align='center' py='48px' color={subColor}>
            <Icon as={MdNotifications} w='48px' h='48px' mb='12px' opacity={0.4} />
            <Text fontSize='sm' fontWeight='500'>No notifications yet</Text>
            <Text fontSize='xs' mt='4px'>
              You will see account alerts and updates here
            </Text>
          </Flex>
        ) : (
          <Box opacity={paginationLoading ? 0.6 : 1} transition='opacity 0.2s'>
            {notifications.map((notif, i) => (
              <Box key={notif._id || i}>
                <Flex
                  align='flex-start'
                  px='20px' py='16px'
                  bg={notif.alert_status === 1 ? unreadBg : 'transparent'}
                  gap='14px'>
                  {/* Icon */}
                  <Box
                    w='40px' h='40px' borderRadius='12px'
                    bg='brand.100'
                    display='flex' alignItems='center' justifyContent='center'
                    flexShrink='0' mt='2px'>
                    <Icon as={MdNotifications} color='brand.500' w='20px' h='20px' />
                  </Box>

                  {/* Content */}
                  <Box flex='1'>
                    <Flex justify='space-between' align='flex-start' mb='4px'>
                      <Text color={textColor} fontSize='sm' fontWeight='600'>
                        {notif.alert_name || 'Notification'}
                      </Text>
                      <Flex align='center' gap='6px' flexShrink='0' ml='8px'>
                        {notif.alert_status === 1 && (
                          <Icon as={MdCircle} color='brand.500' w='8px' h='8px' />
                        )}
                        <Text color={subColor} fontSize='xs'>
                          {notif.alert_date
                            ? moment(notif.alert_date).fromNow()
                            : '—'}
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
          <Flex
            justify='space-between' align='center'
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
      </Box>
    </Box>
  );
}