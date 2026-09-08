import React, { useCallback, useState } from 'react';
import {
  Box, Flex, Text, Button, Icon,
  useColorModeValue, Image,
  useToast, SimpleGrid,
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

  // Exact same variables as original working code
  const cloudName = process.env.REACT_APP_CLOUDINARY_ACCOUNT_NAME;
  const cloudPresetName = process.env.REACT_APP_CLOUDINARY_PRESET_NAME;

  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const dropBg = useColorModeValue('gray.50', 'navy.700');
  const dropActiveBg = useColorModeValue('brand.50', 'navy.700');

  const [files, setFiles] = useState([]);
  const [imageValue, setImageValue] = useState('');
  const [docLoading, setDocLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [preview, setPreview] = useState(null);

  // Get state from navigation — same fields as original
  const track_id = location.state?.track_id;
  const payment = location.state?.payment;
  const serviceType = location.state?.type;
  const serviceCategory = location.state?.serviceCategory;
  const fileUploadType = location.state?.fileType || 'image/jpeg';

  // ── EXACT ORIGINAL WORKING FUNCTIONS

  const deleteImageId = async (data) => {
    const sendData = {
      'userId': user.userData?._id,
      'delete_url': data
    };
    try {
      const res = await client.post('/api/deleteUploaded_image', sendData, {
        headers: { 'Authorization': 'Bearer ' + userToken }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const uploadPhotoURL = async (data) => {
    setDocLoading(true);
    const sendData = {
      'userId': user.userData._id,
      'image_url': data.dataUrl,
      'trackId': track_id,
      'fileType': fileUploadType,
      'public_id': data.publicId
    };
    try {
      const res = await client.post('/api/user_uploadPaymentProof', sendData, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      if (res.data.msg === '201') {
        setUploaded(true);
        toast({
          title: 'Success!',
          description: 'Payment proof uploaded successfully and is now being reviewed.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        setFiles([]);
      } else if (res.data.status === '401') {
        toast({ title: 'Error!', description: 'Authorization required.', status: 'error', duration: 5000 });
        return deleteImageId(imageValue);
      } else if (res.data.status === '402') {
        toast({ title: 'Error!', description: 'You need to login and try again.', status: 'error', duration: 5000 });
        deleteImageId(imageValue);
      } else if (res.data.status === '500') {
        toast({ title: 'Error!', description: res.data.message, status: 'error', duration: 5000 });
        return deleteImageId(imageValue);
      } else {
        toast({ title: 'Error!', description: res.data.message || 'Upload failed.', status: 'error', duration: 5000 });
        return deleteImageId(imageValue);
      }
    } catch (error) {
      deleteImageId(imageValue);
      console.log(error.message);
    } finally {
      setDocLoading(false);
    }
  };

  const uploadPhoto = async () => {
    if (!files || files.length === 0) {
      toast({
        title: 'Error!',
        description: 'Please select a file first.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return false;
    }

  const file = files[0];
    try {
      setDocLoading(true);
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', cloudPresetName);
      data.append('upload_name', cloudName);

      console.log('Cloudinary upload — cloudName:', cloudName, 'preset:', cloudPresetName);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: data }
      );

      const data_res = await response.json();
      console.log('Cloudinary response:', data_res);
      const secureUrl = data_res.secure_url;
      const publicId = data_res.public_id;

      setImageValue(publicId);

      if (secureUrl) {
        console.log("pp ", data_res.public_id)
        const responseData = {
          dataUrl: secureUrl,
          publicId: data_res.public_id
        };
        uploadPhotoURL(responseData);
        setDocLoading(false);
      } else {
        throw new Error('Failed to upload photo');
      }
    } catch (error) {
      deleteImageId(imageValue);
      console.error('Upload error:', error.message);
      setDocLoading(false);
    }
  };

  // ── DROPZONE

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
    if (acceptedFiles[0]) {
      setPreview(URL.createObjectURL(acceptedFiles[0]));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  // ── SUCCESS STATE

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
            <Text color={subColor} fontSize='sm' mb='8px'>
              Reference: <strong>{track_id}</strong>
            </Text>
            <Text color={subColor} fontSize='base' mb='32px' lineHeight='1.6'>
              Our team will verify your payment within 1-24 hours.
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

  // ── MAIN UI ───────────────────────────────────────────

  return (
    <PageLayout>
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap='20px'>

        {/* Upload Card */}
        <PageCard p='28px'>
          <Text color={textColor} fontSize='md' fontWeight='800' mb='4px'>
            Upload Payment Proof
          </Text>
          <Text color={subColor} fontSize='sm' mb='24px'>
            Upload a clear screenshot of your bank transfer receipt
          </Text>

          {/* Dropzone */}
          <Box
            {...getRootProps()}
            bg={isDragActive ? dropActiveBg : dropBg}
            border='2px dashed'
            borderColor={isDragActive ? 'brand.500' : borderColor}
            borderRadius='16px' p='32px' textAlign='center'
            cursor='pointer' mb='20px' transition='all 0.2s'
            _hover={{ borderColor: 'brand.500', bg: dropActiveBg }}>
            <input {...getInputProps()} />
            {preview ? (
              <Image src={preview} maxH='200px' mx='auto'
                borderRadius='12px' objectFit='contain' />
            ) : (
              <Flex direction='column' align='center' gap='12px'>
                <Box w='56px' h='56px' borderRadius='16px'
                  bg='brand.100' display='flex' alignItems='center' justifyContent='center'>
                  <Icon as={isDragActive ? MdImage : MdUpload}
                    color='brand.500' w='28px' h='28px' />
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
            <Button size='sm' variant='ghost' color={subColor} mb='16px'
              onClick={() => { setFiles([]); setPreview(null); }}>
              Remove file
            </Button>
          )}

          <Button
            w='100%' h='52px'
            bg='brand.500' color='white'
            borderRadius='12px' fontWeight='700'
            leftIcon={docLoading ? undefined : <Icon as={MdUpload} />}
            _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'lg' }}
            transition='all 0.2s'
            isLoading={docLoading}
            loadingText='Uploading...'
            isDisabled={!files || files.length === 0}
            onClick={uploadPhoto}>
            Upload Payment Proof
          </Button>
        </PageCard>

        {/* Info Panel */}
        <Flex direction='column' gap='16px'>
          <PageCard p='24px'>
            <Text color={textColor} fontWeight='700' fontSize='sm' mb='16px'>
              Transaction Details
            </Text>
            {[
              { label: 'Reference', value: track_id || '—' },
              { label: 'Type', value: serviceType || 'Account Funding' },
              { label: 'Amount', value: payment ? `₦${Number(payment).toLocaleString()}` : '—' },
              { label: 'Status', value: 'Awaiting Proof Upload' },
            ].map((item, i, arr) => (
              <Flex key={i} justify='space-between' py='10px'
                borderBottom={i < arr.length - 1 ? '1px solid' : 'none'}
                borderColor={borderColor}>
                <Text color={subColor} fontSize='sm'>{item.label}</Text>
                <Text color={textColor} fontSize='sm' fontWeight='600'>{item.value}</Text>
              </Flex>
            ))}
          </PageCard>

          <PageCard p='24px'>
            <Text color={textColor} fontWeight='700' fontSize='sm' mb='12px'>
              📋 Requirements
            </Text>
            {[
              'Must be a clear, readable screenshot',
              'Show the full transfer details and amount',
              'Reference ID must be visible if possible',
              'File size must be under 5MB',
              'PNG or JPG format only',
            ].map((item, i) => (
              <Flex key={i} align='flex-start' gap='8px' mb='10px'>
                <Icon as={MdCheckCircle} color='green.400'
                  w='16px' h='16px' mt='2px' flexShrink='0' />
                <Text color={subColor} fontSize='sm'>{item}</Text>
              </Flex>
            ))}
          </PageCard>
        </Flex>
      </SimpleGrid>
    </PageLayout>
  );
}