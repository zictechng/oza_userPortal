
import React, { useState } from 'react';
import {
  Button, Flex, FormControl, FormLabel,
  Input, Text, useColorModeValue,
  SimpleGrid, Select,
} from '@chakra-ui/react';
import { FiFileText } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { BillsLayout, BillsSuccess } from 'components/bills/BillsLayout';
import { useBills } from 'hooks/useBills';
import { AuthAlert } from 'components/auth/AuthCard';
import { useFormValidation } from 'hooks/useFormValidation';

const EXAM_TYPES = [
  { id: 'waec', name: 'WAEC', price: 3500 },
  { id: 'neco', name: 'NECO', price: 1000 },
  { id: 'jamb', name: 'JAMB', price: 3500 },
  { id: 'nabteb', name: 'NABTEB', price: 1000 },
];

export default function BuyExamCards() {
  const navigate = useNavigate();
  const { buyExamCards, userBalance } = useBills();
  const { error, setError, clearError } = useFormValidation();

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const quickBg = useColorModeValue('gray.50', 'navy.700');

  const [examType, setExamType] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const selectedExam = EXAM_TYPES.find(e => e.id === examType);
  const totalAmount = selectedExam ? selectedExam.price * Number(quantity) : 0;

  const handleSubmit = async () => {
    clearError();
    if (!examType) { setError('Please select an exam type'); return; }
    if (!quantity || Number(quantity) < 1) { setError('Please select quantity'); return; }
    if (totalAmount > userBalance) { setError('Insufficient wallet balance'); return; }

    setLoading(true);
    try {
      const res = await buyExamCards({ exam_type: examType, quantity });
      if (res.msg === '200') {
        setSuccess({
          items: [
            { label: 'Exam Type', value: selectedExam?.name || examType.toUpperCase() },
            { label: 'Quantity', value: quantity },
            { label: 'Total Amount', value: `₦${totalAmount.toLocaleString()}` },
            { label: 'Reference', value: res.data?.reference || '—' },
            { label: 'New Balance', value: `₦${Number(res.data?.balance || 0).toLocaleString()}` },
            { label: 'Pins', value: res.data?.pins?.join(', ') || 'Check email' },
          ]
        });
      } else {
        setError(res.message || 'Transaction failed. Please try again.');
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
        <BillsSuccess
          title='Exam Card(s) Purchased!'
          items={success.items}
          onDone={() => navigate('/user')}
        />
      </BillsLayout>
    );
  }

  return (
    <BillsLayout
      title='Buy Exam Cards'
      subtitle='Purchase scratch cards for WAEC, NECO, JAMB and more'
      icon={FiFileText}
      iconBg='#EDE9FE'
      iconColor='#8B5CF6'>

      <AuthAlert message={error} onClose={clearError} />

      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
          Select Exam Type *
        </FormLabel>
        <SimpleGrid columns={2} gap='10px'>
          {EXAM_TYPES.map(exam => (
            <Button
              key={exam.id}
              h='64px'
              borderRadius='12px'
              border='2px solid'
              borderColor={examType === exam.id ? 'brand.500' : borderColor}
              bg={examType === exam.id ? 'brand.500' : quickBg}
              color={examType === exam.id ? 'white' : textColor}
              fontWeight='600'
              fontSize='sm'
              flexDirection='column'
              gap='4px'
              _hover={{ borderColor: 'brand.500' }}
              onClick={() => { setExamType(exam.id); clearError(); }}>
              <Text fontWeight='800'>{exam.name}</Text>
              <Text fontSize='xs' opacity={0.8}>
                ₦{exam.price.toLocaleString()}/card
              </Text>
            </Button>
          ))}
        </SimpleGrid>
      </FormControl>

      <FormControl mb='20px'>
        <FormLabel fontSize='sm' fontWeight='600' color={textColor} mb='8px'>
          Quantity *
        </FormLabel>
        <Select
          size='lg' borderRadius='12px' fontSize='sm'
          value={quantity}
          onChange={e => { setQuantity(e.target.value); clearError(); }}>
          {[1, 2, 3, 4, 5].map(q => (
            <option key={q} value={q}>{q} card{q > 1 ? 's' : ''}</option>
          ))}
        </Select>
      </FormControl>

      {selectedExam && (
        <Flex
          justify='space-between' align='center'
          bg='brand.50' borderRadius='12px'
          px='16px' py='12px' mb='20px'
          border='1px solid' borderColor='brand.100'>
          <Text color='brand.700' fontSize='sm' fontWeight='600'>
            {quantity} × {selectedExam.name} card{Number(quantity) > 1 ? 's' : ''}
          </Text>
          <Text color='brand.500' fontSize='lg' fontWeight='800'>
            ₦{totalAmount.toLocaleString()}
          </Text>
        </Flex>
      )}

      <Flex
        justify='space-between' align='center'
        bg={quickBg} borderRadius='12px'
        px='16px' py='12px' mb='24px'>
        <Text color={subColor} fontSize='sm'>Wallet Balance</Text>
        <Text color={textColor} fontSize='sm' fontWeight='700'>
          ₦{Number(userBalance).toLocaleString()}
        </Text>
      </Flex>

      <Button
        w='100%' h='52px'
        bg='brand.500' color='white'
        borderRadius='12px' fontWeight='700' fontSize='sm'
        _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'lg' }}
        _active={{ bg: 'brand.700', transform: 'translateY(0)' }}
        transition='all 0.2s'
        isLoading={loading}
        loadingText='Processing...'
        onClick={handleSubmit}>
        Purchase Exam Card{Number(quantity) > 1 ? 's' : ''}
      </Button>
    </BillsLayout>
  );
}