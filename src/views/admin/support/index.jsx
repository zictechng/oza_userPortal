import React, { useState, useEffect } from 'react';
import {
  Box, Flex, Text, Button, Icon,
  useColorModeValue, FormControl, FormLabel,
  Textarea, Select, SimpleGrid,
  Divider, Spinner, Badge, useToast,
} from '@chakra-ui/react';
import {
  MdHelpOutline, MdSend, MdCheckCircle,
  MdHistory, MdAdd, MdSearch,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { postSupport } from 'storeMtg/supportSlice';
import client from 'components/client';
import { PageLayout, PageCard, PageSection } from 'layouts/PageLayout';
import { AuthAlert } from 'components/auth/AuthCard';

const TICKET_SUBJECTS = [
  'Account Funding',
  'Account Profile Update',
  'Account Approval',
  'Bounces Issues',
  'Closing Account',
  'Document Upload',
  'Funds Sending',
  'Funds Withdrawal',
  'Payment Issues',
  'Paypal Account Opening',
  'Transactions Issues',
  '2FA Issues',
  'Others',
];

const statusColor = (status) => {
  if (status === 'Open') return 'green';
  if (status === 'Closed') return 'red';
  return 'orange';
};

export default function Support() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user, userToken } = useSelector(state => state.authUser);
  const { dataLoading } = useSelector(state => state.support);
  const userData = user?.userData;
  const headers = { Authorization: `Bearer ${userToken}` };

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputBg = useColorModeValue('white', 'navy.800');
  const iconBg = useColorModeValue('brand.50', 'navy.700');
  const tabActiveBg = 'brand.500';
  const tabInactiveBg = useColorModeValue('white', 'navy.800');
  const tabHoverBg = useColorModeValue('gray.50', 'navy.700');
  const ticketBg = useColorModeValue('gray.50', 'navy.700');

  const [tab, setTab] = useState('new');
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [error, setError] = useState('');

  // Ticket history
    // Ticket history
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketPage, setTicketPage] = useState(1);
  const [ticketTotalPages, setTicketTotalPages] = useState(1);
  const [ticketTotal, setTicketTotal] = useState(0);
  const PAGE_SIZE = 10;

  const fetchTickets = async (page = 1) => {
    if (!userData?._id) return;
    setTicketsLoading(true);
    try {
      const res = await client.get(
        `/api/user_tickets/${userData._id}?page=${page}&pageSize=${PAGE_SIZE}`,
        { headers }
      );
      if (res.data?.msg === '201') {
        setTickets(res.data.feedAll || []);
        setTicketTotalPages(res.data.totalPage || 1);
        setTicketTotal(res.data.totalRecord || 0);
        setTicketPage(page);
      } else {
        setTickets([]);
      }
    } catch (e) {
      setTickets([]);
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'history') fetchTickets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleSubmit = () => {
    setError('');
    if (!supportSubject) { setError('Please select a subject'); return; }
    if (!supportMessage || supportMessage.length < 10) {
      setError('Please enter a message (at least 10 characters)');
      return;
    }

    const postData = {
      ticket_message: supportMessage,
      ticket_type: supportSubject,
      createdBy: userData?._id,
    };

    dispatch(postSupport(postData)).then(response => {
      if (response.payload?.status === 401) {
        setError('Access denied. Please log in again.');
      } else if (response.payload?.msg === '200') {
        setSupportSubject('');
        setSupportMessage('');
        toast({
          title: 'Ticket submitted!',
          description: 'Our support team will respond within 24 hours.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      } else {
        setError(response.payload?.message || 'Failed to submit. Please try again.');
        toast({
          title: 'Submission failed',
          description: response.payload?.message || 'Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    });
  };

  const inputProps = {
    fontSize: 'sm', borderRadius: '12px',
    bg: inputBg, borderColor,
    _hover: { borderColor: 'brand.500' },
    _focus: { borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' },
  };

  return (
    <PageLayout>
      {/* Tab Toggle */}
      <Flex gap='8px' mb='24px'>
        {['new', 'history'].map(t => (
          <Button
            key={t}
            size='sm'
            borderRadius='12px'
            fontWeight='600'
            fontSize='sm'
            px='20px'
            bg={tab === t ? tabActiveBg : tabInactiveBg}
            color={tab === t ? 'white' : subColor}
            boxShadow={tab === t ? 'none' : '0 1px 4px rgba(0,0,0,0.08)'}
            border='1px solid'
            borderColor={tab === t ? 'brand.500' : borderColor}
            _hover={{ bg: tab === t ? 'brand.600' : tabHoverBg }}
            leftIcon={<Icon as={t === 'new' ? MdAdd : MdHistory} />}
            onClick={() => setTab(t)}>
            {t === 'new' ? 'New Ticket' : 'My Tickets'}
          </Button>
        ))}
      </Flex>

      {tab === 'new' ? (
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap='20px'>
          {/* Form */}
          <PageCard p='28px'>
            <PageSection
              title='Submit a Support Ticket'
              subtitle='We typically respond within 24 hours'
            />

            {error && (
              <AuthAlert message={error} onClose={() => setError('')} />
            )}

            <FormControl mb='16px'>
              <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
                Subject *
              </FormLabel>
              <Select
                {...inputProps}
                size='lg'
                placeholder='Select subject'
                value={supportSubject}
                onChange={e => { setSupportSubject(e.target.value); setError(''); }}>
                {TICKET_SUBJECTS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl mb='24px'>
              <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='6px'>
                Message *
              </FormLabel>
              <Textarea
                placeholder='Describe your issue in detail (max 350 characters)...'
                rows={7}
                maxLength={350}
                fontSize='sm'
                borderRadius='12px'
                bg={inputBg}
                borderColor={borderColor}
                _hover={{ borderColor: 'brand.500' }}
                _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' }}
                value={supportMessage}
                onChange={e => { setSupportMessage(e.target.value); setError(''); }}
              />
              <Text color={subColor} fontSize='xs' mt='4px' textAlign='right'>
                {supportMessage.length}/350
              </Text>
            </FormControl>

            <Button
              w='100%' h='52px'
              bg='brand.500' color='white'
              borderRadius='12px' fontWeight='700' fontSize='sm'
              leftIcon={<Icon as={MdSend} />}
              _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'lg' }}
              transition='all 0.2s'
              isLoading={dataLoading}
              loadingText='Submitting...'
              onClick={handleSubmit}>
              Submit Ticket
            </Button>
          </PageCard>

          {/* Info */}
          <Flex direction='column' gap='16px'>
            <PageCard p='24px'>
              <Flex align='center' gap='12px' mb='16px'>
                <Box w='44px' h='44px' borderRadius='12px'
                  bg={iconBg} display='flex' alignItems='center' justifyContent='center'>
                  <Icon as={MdHelpOutline} color='brand.500' w='22px' h='22px' />
                </Box>
                <Box>
                  <Text color={textColor} fontSize='sm' fontWeight='700'>Your Account</Text>
                  <Text color={subColor} fontSize='xs'>{userData?.email}</Text>
                </Box>
              </Flex>
              <Divider borderColor={borderColor} mb='16px' />
              {[
                { label: 'Name', value: userData?.display_name },
                { label: 'Tag ID', value: userData?.tag_id },
                { label: 'Status', value: userData?.acct_status },
              ].map((item, i) => (
                <Flex key={i} justify='space-between' py='8px'
                  borderBottom='1px solid' borderColor={borderColor}>
                  <Text color={subColor} fontSize='sm'>{item.label}</Text>
                  <Text color={textColor} fontSize='sm' fontWeight='600'>{item.value || '—'}</Text>
                </Flex>
              ))}
            </PageCard>

            <PageCard p='24px'>
              <Text color={textColor} fontSize='sm' fontWeight='700' mb='12px'>
                💡 Tips for faster support
              </Text>
              {[
                'Include your Transaction ID for payment issues',
                'Provide as much detail as possible',
                'Check notifications for our response',
                'Response time: within 24 business hours',
              ].map((tip, i) => (
                <Flex key={i} align='flex-start' gap='8px' mb='10px'>
                  <Icon as={MdCheckCircle} color='green.400' w='16px' h='16px' mt='2px' flexShrink='0' />
                  <Text color={subColor} fontSize='sm'>{tip}</Text>
                </Flex>
              ))}
            </PageCard>
          </Flex>
        </SimpleGrid>
      ) : (
        <PageCard p='0' overflow='hidden'>
          <Box px='20px' py='16px' borderBottom='1px solid' borderColor={borderColor}>
            <Text color={textColor} fontSize='sm' fontWeight='700'>My Support Tickets</Text>
            <Text color={subColor} fontSize='xs'>Your submitted support requests</Text>
          </Box>

          {/* Total count */}
          {!ticketsLoading && tickets.length > 0 && (
            <Box px='20px' py='10px' borderBottom='1px solid' borderColor={borderColor}>
              <Text color={subColor} fontSize='xs'>
                {ticketTotal} ticket{ticketTotal !== 1 ? 's' : ''} found
              </Text>
            </Box>
          )}

          {ticketsLoading ? (
            <Flex justify='center' py='40px'>
              <Spinner color='brand.500' />
            </Flex>
          ) : tickets.length === 0 ? (
            <Flex direction='column' align='center' py='48px' color={subColor}>
              <Icon as={MdHistory} w='48px' h='48px' mb='12px' opacity={0.4} />
              <Text fontSize='sm' fontWeight='500'>No tickets found</Text>
              <Text fontSize='xs' mt='4px'>Your submitted tickets will appear here</Text>
              <Button mt='16px' size='sm' colorScheme='brand'
                borderRadius='10px' onClick={() => setTab('new')}>
                Submit a Ticket
              </Button>
            </Flex>
          ) : (
            tickets.map((ticket, i) => (
              <Box key={ticket._id || i}>
                <Flex p='16px' gap='12px' align='flex-start'
                  bg={i % 2 === 0 ? 'transparent' : ticketBg}>
                  <Box flex='1'>
                    <Flex justify='space-between' align='center' mb='4px'>
                      <Text color={textColor} fontSize='sm' fontWeight='600'>
                        {ticket.ticket_type || 'Support Ticket'}
                      </Text>
                      <Badge
                        colorScheme={statusColor(ticket.ticket_status)}
                        borderRadius='full' fontSize='10px' px='8px'>
                        {ticket.ticket_status || 'Open'}
                      </Badge>
                    </Flex>
                    <Text color={subColor} fontSize='sm' noOfLines={4} mb='4px'>
                      {ticket.ticket_message}
                    </Text>
                    <Text color={subColor} fontSize='xs'>
                      {ticket.createdOn
                        ? moment(ticket.createdOn).format('DD MMM YYYY, hh:mm A')
                        : '—'}
                    </Text>
                  </Box>
                </Flex>
                {i < tickets.length - 1 && <Divider borderColor={borderColor} />}
              </Box>
            ))
                    )}

          {/* Pagination */}
          {ticketTotalPages > 1 && !ticketsLoading && (
            <Flex
              justify='space-between' align='center'
              px='20px' py='16px'
              borderTop='1px solid' borderColor={borderColor}>
              <Text color={subColor} fontSize='sm'>
                Page <strong>{ticketPage}</strong> of <strong>{ticketTotalPages}</strong>
              </Text>
              <Flex gap='8px'>
                <Button size='sm' borderRadius='10px' variant='outline'
                  isDisabled={ticketPage === 1 || ticketsLoading}
                  onClick={() => fetchTickets(ticketPage - 1)}>
                  ← Prev
                </Button>
                <Button size='sm' borderRadius='10px' variant='outline'
                  isDisabled={ticketPage === ticketTotalPages || ticketsLoading}
                  onClick={() => fetchTickets(ticketPage + 1)}>
                  Next →
                </Button>
              </Flex>
            </Flex>
          )}
        </PageCard>
      )}
    </PageLayout>
  );
}