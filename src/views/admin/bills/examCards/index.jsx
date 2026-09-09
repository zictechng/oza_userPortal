import React, { useState, useEffect } from 'react';
import {
  Button, Flex, FormControl, FormLabel,
  Input, Text, useColorModeValue,
  SimpleGrid, Select, Box, Spinner, useToast,
} from '@chakra-ui/react';
import { FiFileText } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { BillsLayout, BillsSuccess } from 'components/bills/BillsLayout';
import { useBills } from 'hooks/useBills';
import { AuthAlert } from 'components/auth/AuthCard';
import { useFormValidation } from 'hooks/useFormValidation';

export default function BuyExamCards() {
  const navigate = useNavigate();
  const toast = useToast();
  const { fetchNetworks, buyExamCards, networks, networksLoading, userBalance } = useBills();
  const { error, setError, clearError } = useFormValidation();

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const quickBg = useColorModeValue('gray.50', 'navy.700');

  const [selectedExam, setSelectedExam] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchNetworks('exam_cards');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Standard exam card prices as fallback if not from API
  const EXAM_PRICES = {
    waec: 3500, neco: 1000, jamb: 3500, nabteb: 1000,
    waec_gce: 3500, bece: 1000,
    };
  const examPrice = Number(
    selectedExam?.price ||
    selectedExam?.extra?.unit_price ||
    EXAM_PRICES[selectedExam?.id?.toLowerCase()] ||
    EXAM_PRICES[selectedExam?.name?.toLowerCase()] ||
    0
    );
  const totalAmount = selectedExam ? examPrice * Number(quantity) : 0;

  const handleSubmit = async () => {
    clearError();
    if (!selectedExam) { setError('Please select an exam type'); 
      toast({
          title: 'Failed',
          description: 'Please select an exam type',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-right',
        });
      return; }
    if (!quantity || Number(quantity) < 1) { setError('Please select quantity'); 
      toast({
          title: 'Failed',
          description: 'Please select quantity',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-right',
        });
      return; }
    if (!phone || phone.length < 10) { setError('Please enter a valid phone number'); 
       toast({
          title: 'Failed',
          description: 'Please enter a valid phone number',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-right',
        });
      return; }
    if (totalAmount > userBalance) { setError('Insufficient wallet balance'); 
      toast({
          title: 'Failed',
          description: 'Insufficient wallet balance',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-right',
        });
      return; }

    setLoading(true);
    try {
      const res = await buyExamCards({
        service_id: selectedExam.service_id,
        exam_type: selectedExam.id,
        exam_label: selectedExam.name,
        quantity,
        phone,
        amount: examPrice * Number(quantity),
      });

      if (res.msg === '200') {
        const pins = res.pins || [];
        toast({
          title: 'Exam Card Purchased! ✅',
          description: `${quantity} ${selectedExam.name} card(s) purchased`,
          status: 'success', duration: 5000,
          isClosable: true, position: 'bottom-right',
        });
        setSuccess({
          items: [
            { label: 'Exam Type', value: selectedExam.name },
            { label: 'Quantity', value: quantity },
            { label: 'Total Amount', value: `₦${totalAmount.toLocaleString()}` },
            { label: 'Reference', value: res.reference || '—' },
            { label: 'New Balance', value: `₦${Number(res.balance || 0).toLocaleString()}` },
            { label: 'Pins', value: pins.length > 0 ? pins.join(' | ') : 'Check your email' },
          ]
        });
      } else {
        const msg = res.message || 'Transaction failed. Please try again.';
        setError(msg);
        toast({
          title: 'Transaction Failed',
          description: msg,
          status: 'error', duration: 5000,
          isClosable: true, position: 'bottom-right',
        });
      }
    } catch (e) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <BillsLayout title='Exam Cards' icon={FiFileText} iconBg='#EDE9FE' iconColor='#8B5CF6'>
        <BillsSuccess title='Exam Card(s) Purchased!'
          items={success.items} onDone={() => navigate('/user')} />
      </BillsLayout>
    );
  }

  return (
    <BillsLayout title='Buy Exam Cards'
      subtitle='Purchase scratch cards for WAEC, NECO, JAMB and more'
      icon={FiFileText} iconBg='#EDE9FE' iconColor='#8B5CF6'>

      <AuthAlert message={error} onClose={clearError} />

      {/* Select Exam Type */}
      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
          Select Exam Type *
        </FormLabel>
        {networksLoading ? (
          <Flex justify='center' py='16px'><Spinner size='sm' color='brand.500' /></Flex>
        ) : (
          <SimpleGrid columns={2} gap='10px'>
            {networks.map(exam => (
              <Button key={exam.id} h='64px' borderRadius='12px'
                border='2px solid'
                borderColor={selectedExam?.id === exam.id ? 'brand.500' : borderColor}
                bg={selectedExam?.id === exam.id ? 'brand.500' : quickBg}
                color={selectedExam?.id === exam.id ? 'white' : textColor}
                flexDirection='column' gap='4px'
                fontWeight='700' fontSize='sm'
                _hover={{ borderColor: 'brand.500' }}
                onClick={() => { setSelectedExam(exam); clearError(); }}>
                <Text fontWeight='800'>{exam.name}</Text>
                <Text fontSize='10px' opacity={0.8}>
                  ₦{Number(
                    exam.price ||
                    exam.extra?.unit_price ||
                    EXAM_PRICES[exam.id?.toLowerCase()] ||
                    EXAM_PRICES[exam.name?.toLowerCase()] ||
                    0
                  ).toLocaleString()}/card
                </Text>
              </Button>
            ))}
          </SimpleGrid>
        )}
      </FormControl>

      {/* Quantity */}
      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
          Quantity *
        </FormLabel>
          <Select size='lg' borderRadius='12px' fontSize='sm'
          value={quantity}
          onChange={e => { setQuantity(e.target.value); clearError(); }}
          _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' }}>
          <option value='1'>1 card</option>
          <option value='2'>2 cards</option>
          <option value='3'>3 cards</option>
          <option value='4'>4 cards</option>
          <option value='5'>5 cards</option>
        </Select>
      </FormControl>

      {/* Phone */}
      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
          Phone Number *
        </FormLabel>
        <Input placeholder='08012345678' size='lg' borderRadius='12px'
          fontSize='sm' type='tel' value={phone}
          onChange={e => { setPhone(e.target.value); clearError(); }}
          _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' }}
        />
      </FormControl>

      {/* Total summary */}
      {selectedExam && (
        <Flex justify='space-between' align='center'
          bg='brand.50' borderRadius='12px'
          px='16px' py='12px' mb='16px'
          border='1px solid' borderColor='brand.100'>
          <Text color='brand.700' fontSize='sm' fontWeight='600'>
            {quantity} × {selectedExam.name}
          </Text>
          <Text color='brand.500' fontSize='lg' fontWeight='800'>
           ₦{(examPrice * Number(quantity)).toLocaleString()}
          </Text>
        </Flex>
      )}

      {/* Wallet Balance */}
      <Flex justify='space-between' align='center'
        bg={quickBg} borderRadius='12px'
        px='16px' py='12px' mb='24px'>
        <Text color={subColor} fontSize='sm'>Wallet Balance</Text>
        <Text color={totalAmount > userBalance ? 'red.500' : textColor}
          fontSize='sm' fontWeight='700'>
          ₦{Number(userBalance).toLocaleString()}
        </Text>
      </Flex>

      <Button w='100%' h='52px' bg='brand.500' color='white'
        borderRadius='12px' fontWeight='700' fontSize='sm'
        _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'lg' }}
        transition='all 0.2s'
        isLoading={loading} loadingText='Processing...'
        onClick={handleSubmit}>
        Purchase {quantity} {selectedExam?.name || 'Exam'} Card{Number(quantity) > 1 ? 's' : ''}
      </Button>
    </BillsLayout>
  );
}