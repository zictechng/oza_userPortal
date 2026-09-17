import {
  Flex, Text, useColorModeValue, Icon,
  VStack, Image, HStack, Box, Input,
  Button, Alert, AlertIcon, Spinner,
  Select, Badge, SimpleGrid, Divider,
} from "@chakra-ui/react";
import client from "components/client";
import React, { useCallback, useState } from "react";
import { useDropzone } from 'react-dropzone';
import { MdUpload, MdCheckCircle, MdAssignment } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserDetails } from "storeMtg/authSlice";
import { useToast } from "@chakra-ui/react";

// Document types — which ones need front AND back
const DOC_TYPES = [
  { value: 'Bank Statement',          label: 'Bank Statement',            needsBack: false },
  { value: "Driver's Licence",        label: "Driver's Licence",          needsBack: true  },
  { value: 'Government ID',           label: 'Government ID (NIN)',        needsBack: true  },
  { value: 'International Passport',  label: 'International Passport',     needsBack: false },
];

// Single dropzone component
function DocDropzone({ label, file, onDrop, onRemove, colors }) {
  const dropBg      = useColorModeValue('gray.50', 'navy.700');
  const dropActiveBg= useColorModeValue('brand.50', 'navy.700');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const textColor   = useColorModeValue('navy.700', 'white');
  const subColor    = useColorModeValue('gray.500', 'gray.400');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted, rejected) => {
      if (rejected.length > 0) return;
      if (accepted[0]) onDrop(Object.assign(accepted[0], { preview: URL.createObjectURL(accepted[0]) }));
    },
    accept: ['image/jpeg', 'image/png'],
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  return (
    <Box
      {...getRootProps()}
      bg={isDragActive ? dropActiveBg : dropBg}
      border='2px dashed'
      borderColor={isDragActive ? 'brand.500' : file ? 'brand.500' : borderColor}
      borderRadius='16px'
      p={file ? '12px' : '24px'}
      textAlign='center'
      cursor='pointer'
      transition='all 0.2s'
      _hover={{ borderColor: 'brand.500', bg: dropActiveBg }}>
      <Input variant='main' {...getInputProps()} />
      <Text color={textColor} fontSize='xs' fontWeight='700' mb='8px'>{label}</Text>
      {file ? (
        <Flex direction='column' align='center' gap='8px'>
          <Image src={file.preview} alt={file.name} maxH='120px' borderRadius='8px' objectFit='contain' />
          <Flex align='center' gap='8px'>
            <Text color={textColor} fontSize='xs' fontWeight='600' noOfLines={1}>{file.name}</Text>
            <Button size='xs' colorScheme='red' variant='ghost'
              onClick={e => { e.stopPropagation(); onRemove(); }}>Remove</Button>
          </Flex>
        </Flex>
      ) : (
        <Flex direction='column' align='center' gap='8px'>
          <Box w='40px' h='40px' borderRadius='12px' bg='brand.100'
            display='flex' alignItems='center' justifyContent='center'>
            <Icon as={isDragActive ? MdAssignment : MdUpload} color='brand.500' w='20px' h='20px' />
          </Box>
          <Text color={textColor} fontSize='xs' fontWeight='600'>
            {isDragActive ? 'Drop here' : 'Click or drag'}
          </Text>
          <Text color={subColor} fontSize='xs'>PNG, JPG — max 5MB</Text>
        </Flex>
      )}
    </Box>
  );
}

export default function DocumentIDUpload(props) {
  const dispatch = useDispatch();
  const toast    = useToast();
  const { user, userToken } = useSelector(state => state.authUser);
  const cloudName       = process.env.REACT_APP_CLOUDINARY_ACCOUNT_NAME;
  const cloudPresetName = process.env.REACT_APP_CLOUDINARY_PRESET_NAME;

  const dropBg      = useColorModeValue('gray.50', 'navy.700');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const textColor   = useColorModeValue('navy.700', 'white');
  const subColor    = useColorModeValue('gray.500', 'gray.400');
  const successBg   = useColorModeValue('green.50', 'navy.700');

  const [error,      setError]      = useState(null);
  const [docType,    setDocType]    = useState('');
  const [frontFile,  setFrontFile]  = useState(null);
  const [backFile,   setBackFile]   = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const selectedDoc = DOC_TYPES.find(d => d.value === docType);
  const needsBack   = selectedDoc?.needsBack || false;

  const canSubmit = docType && frontFile && (!needsBack || backFile);

  // ── Upload one side to Cloudinary then backend ────
  const uploadSide = async (file, side) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', cloudPresetName);
    data.append('upload_name', cloudName);
    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/ddm1owlon/image/upload`,
      { method: 'POST', body: data }
    );
    const cloudData = await cloudRes.json();
    if (!cloudData.secure_url) throw new Error('Cloudinary upload failed');

    // Save to backend
    const res = await client.post('/api/user_uploadDocument_mobile', {
      userId:        user.userData._id,
      image_url:     cloudData.secure_url,
      document_name: docType,
      document_side: side,
      public_id:     cloudData.public_id,
    }, { headers: { Authorization: `Bearer ${userToken}` } });

    if (res.data.msg !== '201') {
      // Delete from Cloudinary if backend fails
      await client.post('/api/deleteUploaded_image', {
        userId: user.userData._id, delete_url: cloudData.public_id,
      }, { headers: { Authorization: `Bearer ${userToken}` } }).catch(() => {});
      throw new Error(res.data.message || 'Backend save failed');
    }
    return res.data;
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsUploading(true);
    setError(null);
    try {
      // Upload front
      const frontResult = await uploadSide(frontFile, 'front');

      // Upload back if needed
      if (needsBack && backFile) {
        await uploadSide(backFile, 'back');
      }

      toast({
        title: 'Documents Uploaded!',
        description: 'Your documents have been submitted for review.',
        status: 'success', duration: 5000, isClosable: true, position: 'bottom',
      });

      // Update user state
      if (frontResult?.userData) {
        dispatch(updateUserDetails(frontResult));
      }

      setFrontFile(null);
      setBackFile(null);
      setDocType('');
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // ── Already uploaded ──────────────────────────────
  if (user.userData?.reg_stage4 === 'Yes') {
    return (
      <Flex align='center' gap='16px' p='20px'
        bg={successBg} borderRadius='16px'
        border='1px solid' borderColor='green.200'>
        <Icon as={MdCheckCircle} color='green.500' w='32px' h='32px' />
        <Box>
          <Text color='green.700' fontSize='sm' fontWeight='700'>
            KYC document already uploaded
          </Text>
          <Text color='green.600' fontSize='sm'>
            Waiting for review. Contact support if you need to update it.
          </Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Box>
      {/* Accepted docs info */}
      <Box mb='16px' p='16px' bg={dropBg} borderRadius='12px'
        border='1px solid' borderColor={borderColor}>
        <Text color={textColor} fontSize='sm' fontWeight='700' mb='8px'>
          📋 Accepted Documents
        </Text>
        {DOC_TYPES.map((doc, i) => (
          <Flex key={i} align='center' gap='8px' mb='6px'>
            <Box w='6px' h='6px' borderRadius='full' bg='brand.500' flexShrink='0' />
            <Text color={subColor} fontSize='sm'>{doc.label}</Text>
            {doc.needsBack && (
              <Badge colorScheme='blue' fontSize='10px'>Front & Back</Badge>
            )}
          </Flex>
        ))}
      </Box>

      {/* Document type */}
      <Box mb='16px'>
        <Text color={textColor} fontSize='sm' fontWeight='600' mb='8px'>
          Document Type *
        </Text>
        <Select placeholder='Select document type' value={docType}
          onChange={e => { setDocType(e.target.value); setFrontFile(null); setBackFile(null); }}
          borderRadius='12px' fontSize='sm' borderColor={borderColor}
          _hover={{ borderColor: 'brand.500' }}
          _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #4C5FD5' }}>
          {DOC_TYPES.map(d => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </Select>
        {selectedDoc && (
          <Text color='brand.500' fontSize='xs' mt='6px' fontWeight='600'>
            {needsBack
              ? '⚠️ This document requires both front and back upload'
              : '✅ Front side only required'}
          </Text>
        )}
      </Box>

      {/* Upload zones */}
      {docType && (
        <SimpleGrid columns={needsBack ? 2 : 1} gap='16px' mb='16px'>
          <DocDropzone
            label={needsBack ? 'Front Side *' : 'Document *'}
            file={frontFile}
            onDrop={setFrontFile}
            onRemove={() => setFrontFile(null)}
          />
          {needsBack && (
            <DocDropzone
              label='Back Side *'
              file={backFile}
              onDrop={setBackFile}
              onRemove={() => setBackFile(null)}
            />
          )}
        </SimpleGrid>
      )}

      {error && (
        <Alert status='error' mb='12px' borderRadius='10px' fontSize='sm'>
          <AlertIcon />{error}
        </Alert>
      )}

      <Button
        w='100%' h='50px' bg='brand.500' color='white'
        borderRadius='12px' fontWeight='700'
        _hover={{ bg: 'brand.600', transform: 'translateY(-1px)' }}
        transition='all 0.2s'
        isDisabled={!canSubmit || isUploading}
        onClick={handleSubmit}>
        {isUploading
          ? <Flex align='center' gap='8px'><Spinner size='sm' color='white' />Uploading...</Flex>
          : `Upload ${needsBack ? 'Documents (Front & Back)' : 'Document'}`}
      </Button>
    </Box>
  );
}