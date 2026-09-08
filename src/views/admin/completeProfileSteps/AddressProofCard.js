import {
  Flex, Text, useColorModeValue, Icon,
  Image, Box, Input, Button,
  Alert, AlertIcon, Spinner,
} from "@chakra-ui/react";
import client from "components/client";
import React, { useCallback, useState } from "react";
import { useDropzone } from 'react-dropzone';
import { MdUpload, MdCheckCircle, MdHome } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserDetails } from "storeMtg/authSlice";
import { useToast } from "@chakra-ui/react";

export default function AddressProof(props) {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user, userToken } = useSelector((state) => state.authUser);
  const cloudName = process.env.REACT_APP_CLOUDINARY_ACCOUNT_NAME;
  const cloudPresetName = process.env.REACT_APP_CLOUDINARY_PRESET_NAME;

  const dropBg = useColorModeValue('gray.50', 'navy.700');
  const dropActiveBg = useColorModeValue('brand.50', 'navy.700');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  const successBg = useColorModeValue('green.50', 'navy.700');

  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [DocLoading, setDocLoading] = useState(false);
  const [imageValue, setImageValue] = useState('');

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      setError("Invalid file type. Only JPEG and PNG files under 5MB are allowed.");
    } else {
      setError(null);
      setFiles(acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      ));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ["image/jpeg", "image/png"],
    maxSize: 5 * 1024 * 1024,
  });

  const removeFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  // ── ORIGINAL WORKING FUNCTIONS — NOT CHANGED ──────────

  const deleteImageId = async (data) => {
    const sendData = { 'userId': user.userData?._id, 'delete_url': data };
    try {
      await client.post('/api/deleteUploaded_image', sendData, {
        headers: { 'Authorization': 'Bearer ' + userToken }
      });
    } catch (error) { console.log(error.message); }
  };

  const uploadPhoto = async () => {
    if (!files || files.length === 0) {
      toast({ title: "Error!", description: "Please select a file.", status: "error", duration: 5000, isClosable: true, position: "bottom" });
      return false;
    }
    const file = files[0];
    try {
      setDocLoading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", cloudPresetName);
      data.append("upload_name", cloudName);
      const response = await fetch("https://api.cloudinary.com/v1_1/ddm1owlon/image/upload", {
        method: "POST", body: data,
      });
      const data_res = await response.json();
      const secureUrl = data_res.secure_url;
      if (secureUrl) {
        setImageValue(data_res.public_id);
        uploadPhotoURL(secureUrl);
        setDocLoading(false);
        removeFile(file.name);
      } else {
        throw new Error("Failed to upload photo");
      }
    } catch (error) {
      deleteImageId(imageValue);
      console.error("Upload error:", error.message);
      setDocLoading(false);
    }
  };

  const uploadPhotoURL = async (data) => {
    console.log("Backend Gotten Data ", data.public_id);
    setDocLoading(true);
    const sendData = { 'userId': user.userData._id, 'image_url': data };
    try {
      const res = await client.post('/api/user_uploadProof_address', sendData, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (res.data.msg === '201') {
        toast({ title: "Success!", description: "Address proof uploaded successfully.", status: "success", duration: 5000, isClosable: true, position: "bottom" });
        setFiles(null); setFiles([]);
        dispatch(updateUserDetails(res.data));
      } else if (res.data.status === '401') {
        toast({ title: "Error!", description: "Authorization required.", status: "error", duration: 5000 });
        return deleteImageId(imageValue);
      } else if (res.data.status === '400') {
        toast({ title: "Error!", description: "Profile not found, try again.", status: "error", duration: 5000 });
        return deleteImageId(imageValue);
      } else if (res.data.status === '402') {
        toast({ title: "Error!", description: "You need to login and try again.", status: "error", duration: 5000 });
        deleteImageId(imageValue); return;
      } else if (res.data.status === '500') {
        toast({ title: "Error!", description: res.data.message, status: "error", duration: 5000 });
        return deleteImageId(imageValue);
      }
    } catch (error) {
      deleteImageId(imageValue); console.log(error.message);
    } finally { setDocLoading(false); }
  };

  // ── UI ────────────────────────────────────────────────

  if (user.userData?.reg_stage6 === 'Yes') {
    return (
      <Flex align='center' gap='12px' p='20px'
        bg={successBg} borderRadius='16px'
        border='1px solid' borderColor='green.200'>
        <Icon as={MdCheckCircle} color='green.500' w='28px' h='28px' flexShrink='0' />
        <Box>
          <Text color='green.700' fontSize='sm' fontWeight='700'>
            Address proof already uploaded
          </Text>
          <Text color='green.600' fontSize='xs' mt='4px'>
            Waiting for review. You cannot replace your document at the moment.
            Contact support if you need to update it.
          </Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Box>
      {/* Accepted documents info */}
      <Box mb='16px' p='16px' bg={dropBg}
        borderRadius='12px' border='1px solid' borderColor={borderColor}>
        <Text color={textColor} fontSize='sm' fontWeight='700' mb='8px'>
          📋 Accepted Documents
        </Text>
        {[
          'Utility Bill (electricity, water — not older than 3 months)',
          'Bank Statement (showing your address)',
          'Government letter or official mail',
          'Tenancy or lease agreement',
        ].map((doc, i) => (
          <Flex key={i} align='center' gap='8px' mb='6px'>
            <Box w='6px' h='6px' borderRadius='full' bg='brand.500' flexShrink='0' />
            <Text color={subColor} fontSize='sm'>{doc}</Text>
          </Flex>
        ))}
      </Box>

      {/* Dropzone */}
      <Box
        {...getRootProps()}
        bg={isDragActive ? dropActiveBg : dropBg}
        border='2px dashed'
        borderColor={isDragActive ? 'brand.500' : files.length ? 'brand.500' : borderColor}
        borderRadius='16px'
        p={files.length ? '16px' : '32px'}
        textAlign='center'
        cursor='pointer' mb='16px' transition='all 0.2s'
        _hover={{ borderColor: 'brand.500', bg: dropActiveBg }}>
        <Input variant='main' {...getInputProps()} />

        {files.length > 0 ? (
          <Flex direction='column' align='center' gap='12px'>
            <Image
              src={files[0].preview}
              alt={files[0].name}
              maxH='200px'
              borderRadius='12px'
              objectFit='contain'
            />
            <Flex align='center' gap='8px'>
              <Text color={textColor} fontSize='xs' fontWeight='600' noOfLines={1}>
                {files[0].name}
              </Text>
              <Button size='xs' colorScheme='red' variant='ghost'
                onClick={(e) => { e.stopPropagation(); removeFile(files[0].name); }}>
                Remove
              </Button>
            </Flex>
            <Text color={subColor} fontSize='xs'>Click to change document</Text>
          </Flex>
        ) : (
          <Flex direction='column' align='center' gap='10px'>
            <Box w='56px' h='56px' borderRadius='16px'
              bg='brand.100' display='flex' alignItems='center' justifyContent='center'>
              <Icon as={isDragActive ? MdHome : MdUpload}
                color='brand.500' w='28px' h='28px' />
            </Box>
            <Box>
              <Text color={textColor} fontSize='sm' fontWeight='700'>
                {isDragActive ? 'Drop document here' : 'Click or drag document here'}
              </Text>
              <Text color={subColor} fontSize='xs' mt='4px'>
                PNG, JPG files only — max 5MB
              </Text>
            </Box>
          </Flex>
        )}
      </Box>

      {error && (
        <Alert status='error' mb='12px' borderRadius='10px' fontSize='sm'>
          <AlertIcon />{error}
        </Alert>
      )}

      <Button
        w='100%' h='50px'
        bg='brand.500' color='white'
        borderRadius='12px' fontWeight='700'
        _hover={{ bg: 'brand.600', transform: 'translateY(-1px)' }}
        transition='all 0.2s'
        isDisabled={files.length === 0}
        onClick={() => uploadPhoto()}>
        {DocLoading
          ? <Flex align='center' gap='8px'><Spinner size='sm' color='white' /> Processing...</Flex>
          : 'Upload Address Proof'}
      </Button>
    </Box>
  );
}