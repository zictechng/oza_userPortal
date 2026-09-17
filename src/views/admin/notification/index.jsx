import React, { useEffect, useState } from 'react';
import {
  Box, Flex, Text, Icon, Button, Badge,
  useColorModeValue, Spinner, Divider,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import {
  MdNotifications, MdCircle, MdCheckCircle,
  MdSwapHoriz, MdReceipt, MdCardGiftcard,
  MdPeople, MdSecurity, MdSettings, MdAttachMoney,
  MdAccountBalanceWallet, MdClose, MdPublic,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  getNotificationHistory, clearNotifications,
  setPage, resetPage,
} from 'storeMtg/notificationSlice';
import { PageLayout, PageCard } from 'layouts/PageLayout';
import client from 'components/client';

// ── Message type config — matches mobile ALERT_TYPES ─
const ALERT_TYPES = [
  { keys: ['withdrawal', 'withdraw'],                    label: 'Withdrawal',         icon: MdAccountBalanceWallet, color: '#EF4444', bg: '#FEE2E2' },
  { keys: ['funded', 'funding', 'credited', 'account fund'], label: 'Account Funded', icon: MdAccountBalanceWallet, color: '#10B981', bg: '#D1FAE5' },
  { keys: ['transfer', 'sent', 'debit'],                 label: 'Transfer',           icon: MdSwapHoriz,            color: '#4C5FD5', bg: '#EEF2FF' },
  { keys: ['received', 'credit'],                        label: 'Payment Received',   icon: MdAttachMoney,          color: '#10B981', bg: '#D1FAE5' },
  { keys: ['payment'],                                   label: 'Payment',            icon: MdAttachMoney,          color: '#3B82F6', bg: '#DBEAFE' },
  { keys: ['bonus', 'coins', 'reward'],                  label: 'Bonus & Rewards',    icon: MdCardGiftcard,         color: '#F0A500', bg: '#FFF3CD' },
  { keys: ['referral', 'refer'],                         label: 'Referral',           icon: MdPeople,               color: '#EC4899', bg: '#FCE7F3' },
  { keys: ['document rejected', 'rejected', 'decline'],  label: 'Document Rejected',  icon: MdClose,                color: '#EF4444', bg: '#FEE2E2' },
  { keys: ['document approved', 'approved', 'approval'], label: 'Document Approved',  icon: MdCheckCircle,          color: '#10B981', bg: '#D1FAE5' },
  { keys: ['document', 'kyc', 'identity'],               label: 'Document',           icon: MdReceipt,              color: '#8B5CF6', bg: '#EDE9FE' },
  { keys: ['exchange', 'sell', 'purchase', 'buy'],       label: 'Exchange',           icon: MdSwapHoriz,            color: '#F59E0B', bg: '#FEF3C7' },
  { keys: ['airtime', 'data', 'bill', 'electricity', 'tv', 'exam'], label: 'Bills Payment', icon: MdReceipt,       color: '#4C5FD5', bg: '#EEF2FF' },
  { keys: ['usd', 'dollar'],                             label: 'USD Wallet',         icon: MdPublic,               color: '#10B981', bg: '#D1FAE5' },
  { keys: ['security', 'login', 'password'],             label: 'Security',           icon: MdSecurity,             color: '#10B981', bg: '#D1FAE5' },
  { keys: ['system', 'update', 'notice'],                label: 'System Notice',      icon: MdSettings,             color: '#6B7280', bg: '#F3F4F6' },
];

const getAlertConfig = (nature = '') => {
  const text = (nature || '').toLowerCase();
  const match = ALERT_TYPES.find(t => t.keys.some(k => text.includes(k)));
  return match || { label: 'Notification', icon: MdNotifications, color: '#4C5FD5', bg: '#EEF2FF' };
};

export default function Notifications() {
  const dispatch = useDispatch();
  const { user, userToken } = useSelector(state => state.authUser);
  const {
    notificationData, currentPage, totalPages,
    initialLoading, paginationLoading,
  } = useSelector(state => state.notifications);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedNotif, setSelectedNotif] = useState(null);

  const userData = user?.userData;

  const textColor   = useColorModeValue('navy.700', 'white');
  const subColor    = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const unreadBg    = useColorModeValue('brand.50', 'navy.700');
  const headerBg    = useColorModeValue('gray.50', 'navy.700');
  const rowHoverBg  = useColorModeValue('gray.50', 'navy.700');
  const cardBg      = useColorModeValue('white', 'navy.800');
  const statBg      = useColorModeValue('white', 'navy.800');

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

  // ── Open message detail and mark as read ──────
  const handleOpen = async (notif) => {
    setSelectedNotif(notif);
    onOpen();
    // Mark as read if unread
    if (notif.alert_status === 1) {
      try {
        await client.get(`/api/notification_read_single/${notif._id}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        // Update local state
        dispatch({ type: 'notifications/markRead', payload: notif._id });
      } catch {}
    }
  };

  const notifications = Array.isArray(notificationData) ? notificationData : [];
  const unreadCount   = notifications.filter(n => n.alert_status === 1).length;
  const readCount     = notifications.filter(n => n.alert_status === 0).length;

  return (
    <PageLayout>
      {/* ── Stats Bar ──────────────────────────── */}
      <Flex gap='12px' mb='20px' flexWrap='wrap'>
        <Box bg={statBg} borderRadius='16px' px='20px' py='14px'
          border='1px solid' borderColor={borderColor} shadow='sm'>
          <Text color={subColor} fontSize='xs' fontWeight='600'
            textTransform='uppercase' letterSpacing='0.5px' mb='2px'>
            Total
          </Text>
          <Text color={textColor} fontSize='lg' fontWeight='800'>
            {notifications.length}
          </Text>
        </Box>
        <Box bg='brand.50' borderRadius='16px' px='20px' py='14px'
          border='1px solid' borderColor='brand.200'>
          <Text color='brand.500' fontSize='xs' fontWeight='600'
            textTransform='uppercase' letterSpacing='0.5px' mb='2px'>
            Unread
          </Text>
          <Text color='brand.500' fontSize='lg' fontWeight='800'>
            {unreadCount}
          </Text>
        </Box>
        <Box bg={statBg} borderRadius='16px' px='20px' py='14px'
          border='1px solid' borderColor={borderColor} shadow='sm'>
          <Text color='green.500' fontSize='xs' fontWeight='600'
            textTransform='uppercase' letterSpacing='0.5px' mb='2px'>
            Read
          </Text>
          <Text color='green.500' fontSize='lg' fontWeight='800'>
            {readCount}
          </Text>
        </Box>
      </Flex>

      <PageCard p='0' overflow='hidden'>
        {/* Header */}
        <Flex px='20px' py='14px' bg={headerBg}
          borderBottom='1px solid' borderColor={borderColor}
          justify='space-between' align='center'>
          <Text color={textColor} fontSize='sm' fontWeight='700'>
            All Notifications
          </Text>
          <Text color={subColor} fontSize='xs'>
            Tap a message to read
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
            <Text fontSize='xs' mt='4px'>Account alerts and updates will appear here</Text>
          </Flex>
        ) : (
          <Box>
            {notifications.map((notif, i) => {
              const cfg      = getAlertConfig(notif.alert_nature);
              const isUnread = notif.alert_status === 1;
              return (
                <Box key={notif._id || i}>
                  <Flex
                    align='flex-start'
                    px='20px' py='16px'
                    bg={isUnread ? unreadBg : 'transparent'}
                    borderLeft={isUnread ? '3px solid' : '3px solid transparent'}
                    borderLeftColor={isUnread ? 'brand.500' : 'transparent'}
                    gap='14px'
                    cursor='pointer'
                    _hover={{ bg: rowHoverBg }}
                    transition='all 0.15s'
                    onClick={() => handleOpen(notif)}>

                    {/* Type Icon */}
                    <Box
                      w='42px' h='42px' borderRadius='12px'
                      bg={cfg.bg} flexShrink='0' mt='2px'
                      display='flex' alignItems='center' justifyContent='center'>
                      <Icon as={cfg.icon} color={cfg.color} w='22px' h='22px' />
                    </Box>

                    {/* Content */}
                    <Box flex='1' minW='0'>
                      <Flex justify='space-between' align='flex-start' mb='4px'>
                        {/* Message type label — not person name */}
                        <Flex align='center' gap='8px'>
                          <Text color={textColor} fontSize='sm'
                            fontWeight={isUnread ? '700' : '600'}>
                            {cfg.label}
                          </Text>
                          {isUnread && (
                            <Icon as={MdCircle} color='brand.500' w='8px' h='8px' />
                          )}
                        </Flex>
                        <Text color={subColor} fontSize='xs' flexShrink='0' ml='12px'>
                          {notif.alert_date ? moment(notif.alert_date).fromNow() : '—'}
                        </Text>
                      </Flex>

                      {/* Preview — 2 lines only */}
                      <Text color={subColor} fontSize='xs' lineHeight='1.6'
                        noOfLines={2}>
                        {notif.alert_nature}
                      </Text>

                      {/* Tap to read prompt */}
                      <Text color='brand.500' fontSize='xs' fontWeight='600' mt='4px'>
                        {isUnread ? 'Tap to read →' : 'View message →'}
                      </Text>
                    </Box>
                  </Flex>
                  {i < notifications.length - 1 && (
                    <Divider borderColor={borderColor} />
                  )}
                </Box>
              );
            })}
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

      {/* ── Message Detail Modal ─────────────────── */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size='md'>
        <ModalOverlay bg='blackAlpha.600' backdropFilter='blur(4px)' />
        <ModalContent borderRadius='20px' bg={cardBg}>
          <ModalHeader pb='0'>
            {selectedNotif && (() => {
              const cfg = getAlertConfig(selectedNotif.alert_nature);
              return (
                <Flex align='center' gap='12px'>
                  <Box w='40px' h='40px' borderRadius='12px'
                    bg={cfg.bg} display='flex'
                    alignItems='center' justifyContent='center'>
                    <Icon as={cfg.icon} color={cfg.color} w='20px' h='20px' />
                  </Box>
                  <Box>
                    <Text color={textColor} fontSize='md' fontWeight='700'>
                      {cfg.label}
                    </Text>
                    <Text color={subColor} fontSize='xs'>
                      {selectedNotif.alert_date
                        ? moment(selectedNotif.alert_date).format('DD MMM YYYY • hh:mm A')
                        : '—'}
                    </Text>
                  </Box>
                </Flex>
              );
            })()}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py='20px'>
            <Divider mb='16px' />
            <Text color={textColor} fontSize='sm' lineHeight='1.8'
              whiteSpace='pre-line'>
              {selectedNotif?.alert_nature || 'No content'}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button w='100%' bg='brand.500' color='white'
              borderRadius='12px' fontWeight='700'
              _hover={{ bg: 'brand.600' }}
              onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageLayout>
  );
}
