import React, { useState, useEffect } from 'react';
import {
  Button, Flex, FormControl, FormLabel,
  Input, Text, useColorModeValue,
  SimpleGrid, Box, Spinner, useToast,
} from '@chakra-ui/react';
import { FiFileText } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { BillsLayout, BillsSuccess } from 'components/bills/BillsLayout';
import { useBills } from 'hooks/useBills';
import { AuthAlert } from 'components/auth/AuthCard';
import { useFormValidation } from 'hooks/useFormValidation';
import client from 'components/client';
import { useSelector } from 'react-redux';

// Standard price fallback — used only when API fails, never shown in UI
const EXAM_PRICES = {
  waec: 3500, neco: 1000, jamb: 3500, nabteb: 1000,
  waec_gce: 3500, bece: 1000,
};

export default function BuyExamCards() {
  const navigate = useNavigate();
  const toast = useToast();
  const { fetchNetworks, buyExamCards, networks, networksLoading, userBalance } = useBills();
  const { user, userToken } = useSelector(state => state.authUser);
  const { error, setError, clearError } = useFormValidation();

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const quickBg = useColorModeValue('gray.50', 'navy.700');

  const [selectedExam, setSelectedExam] = useState(null);
  const [examPrice, setExamPrice] = useState(0);
  const [priceLoading, setPriceLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchNetworks('exam_cards');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalAmount = examPrice * quantity;

  // Fetch price from API when exam type selected
  const handleExamSelect = async (exam) => {
    setSelectedExam(exam);
    setExamPrice(0);
    clearError();
    setPriceLoading(true);
    try {
      const res = await client.get(
        `/api/bills/exam_price/${exam.service_id}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (res.data.msg === '200' && res.data.price) {
        setExamPrice(Number(res.data.price));
      } else {
        // Fallback to standard prices
        const fallback = EXAM_PRICES[exam.id?.toLowerCase()] ||
          EXAM_PRICES[exam.name?.toLowerCase()] || 0;
        setExamPrice(fallback);
      }
    } catch (e) {
      const fallback = EXAM_PRICES[exam.id?.toLowerCase()] ||
        EXAM_PRICES[exam.name?.toLowerCase()] || 0;
      setExamPrice(fallback);
    } finally {
      setPriceLoading(false);
    }
  };

  const handleSubmit = async () => {
    clearError();
    if (!selectedExam) { setError('Please select an exam type'); 
      toast({
          title: 'Error!',
          description: 'Please select an exam type',
          status: 'error', duration: 5000,
          isClosable: true, position: 'bottom-right',
        });
      return; }
    if (quantity < 1) { setError('Please select quantity'); 
        toast({
          title: 'Error!',
          description: 'Please select quantity',
          status: 'error', duration: 5000,
          isClosable: true, position: 'bottom-right',
        });
      return; }
    if (!phone || phone.length < 10) { setError('Please enter a valid phone number'); 
      toast({
          title: 'Error!',
          description: 'Please enter a valid phone number',
          status: 'error', duration: 5000,
          isClosable: true, position: 'bottom-right',
        });
        return; }
    if (totalAmount > userBalance) { setError('Insufficient wallet balance'); 
      toast({
          title: 'Error!',
          description: 'Insufficient wallet balance',
          status: 'error', duration: 5000,
          isClosable: true, position: 'bottom-right',
        });
      return; }

    setLoading(true);
    try {
      const res = await buyExamCards({
        service_id: selectedExam.service_id,
        exam_type: selectedExam.id, // used as product_code in backend
        exam_label: selectedExam.name,
        quantity,
        phone,
        amount: totalAmount,
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
            { label: 'Quantity', value: String(quantity) },
            { label: 'Price per Card', value: `₦${examPrice.toLocaleString()}` },
            { label: 'Total Amount', value: `₦${totalAmount.toLocaleString()}` },
            { label: 'Reference', value: res.reference || '—' },
            { label: 'New Balance', value: `₦${Number(res.balance || 0).toLocaleString()}` },
            { label: 'PIN(s)', value: pins.length > 0 ? pins.join(' | ') : 'Check your email' },
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
        <FormLabel fontSize='15px' fontWeight='600' color={textColor} mb='8px'>
          Select Exam Type *
        </FormLabel>
        {networksLoading ? (
          <Flex justify='center' py='16px'><Spinner size='sm' color='brand.500' /></Flex>
        ) : (
          <SimpleGrid columns={2} gap='10px'>
            {networks.map(exam => (
              <Button key={exam.id} h='72px' borderRadius='12px'
                border='2px solid'
                borderColor={selectedExam?.id === exam.id ? 'brand.500' : borderColor}
                bg={selectedExam?.id === exam.id ? 'brand.500' : quickBg}
                color={selectedExam?.id === exam.id ? 'white' : textColor}
                flexDirection='column' gap='4px'
                fontWeight='700' fontSize='sm'
                _hover={{ borderColor: 'brand.500', transform: 'translateY(-2px)' }}
                transition='all 0.2s'
                onClick={() => handleExamSelect(exam)}>
                <Text fontWeight='800' textTransform='uppercase' letterSpacing='0.5px'>
                  {exam.name}
                </Text>
                <Text fontSize='13px' opacity={0.8}>
                  {selectedExam?.id === exam.id && priceLoading
                    ? '⏳ Loading...'
                    : selectedExam?.id === exam.id && examPrice > 0
                    ? `₦${examPrice.toLocaleString()}/card`
                    : '👆 Tap to view details'}
                </Text>
              </Button>
            ))}
          </SimpleGrid>
        )}
      </FormControl>

      {/* Price display after selection */}
      {selectedExam && (
        <Box bg={quickBg} borderRadius='12px' p='12px' mb='16px'>
          <Flex justify='space-between' align='center'>
            <Text color={subColor} fontSize='sm'  textTransform='uppercase'>{selectedExam.name} Price</Text>
            {priceLoading ? (
              <Spinner size='xs' color='brand.500' />
            ) : (
              <Text color='brand.500' fontSize='sm' fontWeight='800'>
                ₦{examPrice.toLocaleString()}/card
              </Text>
            )}
          </Flex>
        </Box>
      )}

      {/* Quantity */}
      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
          Quantity *
        </FormLabel>
        <SimpleGrid columns={5} gap='8px'>
          {[1, 2, 3, 4, 5].map(q => (
            <Button key={q} h='48px' borderRadius='12px'
              border='2px solid'
              borderColor={quantity === q ? 'brand.500' : borderColor}
              bg={quantity === q ? 'brand.500' : quickBg}
              color={quantity === q ? 'white' : textColor}
              fontWeight='700' fontSize='sm'
              onClick={() => { setQuantity(q); clearError(); }}>
              {q}
            </Button>
          ))}
        </SimpleGrid>
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
      {selectedExam && examPrice > 0 && (
        <Flex justify='space-between' align='center'
          bg='brand.50' borderRadius='12px'
          px='16px' py='12px' mb='16px'
          border='1px solid' borderColor='brand.100'>
          <Text color='brand.700' fontSize='sm' fontWeight='600'>
            {quantity} × ₦{examPrice.toLocaleString()}
          </Text>
          <Text color='brand.500' fontSize='lg' fontWeight='800'>
            ₦{totalAmount.toLocaleString()}
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
        isDisabled={!selectedExam || examPrice === 0 || priceLoading}
        onClick={handleSubmit}>
        Buy {quantity} {selectedExam?.name || 'Exam'} Card{quantity > 1 ? 's' : ''} — ₦{totalAmount.toLocaleString()}
      </Button>
    </BillsLayout>
  );
}