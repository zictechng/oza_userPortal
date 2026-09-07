import React, { useCallback, useState } from 'react';
import {
  Box, Flex, Text, Button, Icon,
  useColorModeValue, Image, Input,
  Alert, AlertIcon, Spinner, useToast,
  SimpleGrid,
} from '@chakra-ui/react';
import { MdUpload, MdCheckCircle, MdImage } from 'react-icons/md';
import { useDropzone } from 'react-dropzone';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import client from 'components/client';
import { PageLayout, PageCard } from 'layouts/PageLayout';

export default function PaymentProof() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, userToken } = useSelector(state => state.authUser);
  const headers = { Authorization: `Bearer ${userToken}` };

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const dropBg = useColorModeValue('gray.50', 'navy.700');
  const dropBorderColor = useColorModeValue('brand.200', 'brand.600');

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const { amount, serviceCategory, reference } = location.state || {};

  const onDrop = useCallback(acceptedFiles => {
    const f = acceptedFiles[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) {
      toast({ title: 'Please select a file', status: 'warning', duration: 3000 });
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', user?.userData?._id);
      formData.append('amount', amount);
      formData.append('service', serviceCategory);
      formData.append('reference', reference);

      const res = await client.post('/api/user_uploadPaymentProof', formData, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.msg === '201' || res.data.msg === '200') {
        setUploaded(true);
        toast({
          title: 'Payment proof uploaded!',
          description: 'Admin will verify your payment shortly.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      } else {
        toast({
          title: 'Upload failed',
          description: res.data.message || 'Please try again.',
          status: 'error',
          duration: 5000,
        });
      }
    } catch (e) {
      toast({ title: 'Upload failed', description: 'Connection error.', status: 'error', duration: 5000 });
    } finally {
      setUploading(false);
    }
  };

  if (uploaded) {
    return (
      <PageLayout>
        <Flex justify='center' align='center' minH='60vh'>
          <PageCard p='40px' maxW='440px' w='100%' textAlign='center'>
            <Box w='80px' h='80px' borderRadius='full'
              bg='green.50' display='flex' alignItems='center'
              justifyContent='center' mx='auto' mb='24px'>
              <Icon as={MdCheckCircle} color='green.500' w='48px' h='48px' />
            </Box>
            <Text color={textColor} fontSize='xl' fontWeight='800' mb='8px'>
              Proof Uploaded Successfully!
            </Text>
            <Text color={subColor} fontSize='sm' mb='32px'>
              Our team will verify your payment and credit your account within 1-24 hours.
            </Text>
            <SimpleGrid columns={2} gap='12px'>
              <Button variant='outline' borderColor='brand.500' color='brand.500'
                borderRadius='12px' h='48px' fontWeight='700'
                onClick={() => navigate('/user/history')}>
                View History
              </Button>
              <Button bg='brand.500' color='white'
                borderRadius='12px' h='48px' fontWeight='700'
                onClick={() => navigate('/user')}>
                Dashboard
              </Button>
            </SimpleGrid>
          </PageCard>
        </Flex>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap='20px'>
        {/* Upload */}
        <PageCard p='28px'>
          <Text color={textColor} fontSize='md' fontWeight='800' mb='4px'>
            Upload Payment Proof
          </Text>
          <Text color={subColor} fontSize='sm' mb='24px'>
            Upload a screenshot or photo of your bank transfer receipt
          </Text>

          {/* Dropzone */}
          <Box
            {...getRootProps()}
            bg={dropBg}
            border='2px dashed'
            borderColor={isDragActive ? 'brand.500' : dropBorderColor}
            borderRadius='16px'
            p='32px'
            textAlign='center'
            cursor='pointer'
            mb='20px'
            transition='all 0.2s'
            _hover={{ borderColor: 'brand.500', bg: 'brand.50' }}>
            <input {...getInputProps()} />
            {preview ? (
              <Image src={preview} maxH='200px' mx='auto' borderRadius='12px' objectFit='contain' />
            ) : (
              <Flex direction='column' align='center' gap='12px'>
                <Box w='56px' h='56px' borderRadius='16px'
                  bg='brand.100' display='flex' alignItems='center' justifyContent='center'>
                  <Icon as={isDragActive ? MdImage : MdUpload} color='brand.500' w='28px' h='28px' />
                </Box>
                <Box>
                  <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {isDragActive ? 'Drop file here' : 'Click or drag file here'}
                  </Text>
                  <Text color={subColor} fontSize='xs' mt='4px'>
                    PNG, JPG up to 5MB
                  </Text>
                </Box>
              </Flex>
            )}
          </Box>

          {preview && (
            <Button
              size='sm' variant='ghost' color={subColor}
              mb='16px' onClick={() => { setFile(null); setPreview(null); }}>
              Remove file
            </Button>
          )}

          <Button
            w='100%' h='52px'
            bg='brand.500' color='white'
            borderRadius='12px' fontWeight='700'
            leftIcon={<Icon as={MdUpload} />}
            _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'lg' }}
            transition='all 0.2s'
            isLoading={uploading}
            loadingText='Uploading...'
            isDisabled={!file}
            onClick={handleUpload}>
            Upload Payment Proof
          </Button>
        </PageCard>

        {/* Summary */}
        <Flex direction='column' gap='16px'>
          {amount && (
            <PageCard p='24px'>
              <Text color={textColor} fontWeight='700' fontSize='sm' mb='16px'>
                Transaction Summary
              </Text>
              {[
                { label: 'Service', value: serviceCategory || '—' },
                { label: 'Amount', value: amount ? `$${Number(amount).toLocaleString()}` : '—' },
                { label: 'Reference', value: reference || '—' },
                { label: 'Status', value: 'Awaiting Proof' },
              ].map((item, i) => (
                <Flex key={i} justify='space-between' py='10px'
                  borderBottom={i < 3 ? '1px solid' : 'none'} borderColor={borderColor}>
                  <Text color={subColor} fontSize='sm'>{item.label}</Text>
                  <Text color={textColor} fontSize='sm' fontWeight='600'>{item.value}</Text>
                </Flex>
              ))}
            </PageCard>
          )}

          <PageCard p='24px'>
            <Text color={textColor} fontWeight='700' fontSize='sm' mb='12px'>
              📋 Requirements
            </Text>
            {[
              'Must be a clear, readable screenshot',
              'Show the full transfer details',
              'Amount must match your order',
              'File size must be under 5MB',
            ].map((item, i) => (
              <Flex key={i} align='flex-start' gap='8px' mb='10px'>
                <Icon as={MdCheckCircle} color='green.400' w='16px' h='16px' mt='2px' flexShrink='0' />
                <Text color={subColor} fontSize='sm'>{item}</Text>
              </Flex>
            ))}
          </PageCard>
        </Flex>
      </SimpleGrid>
    </PageLayout>
  );
}