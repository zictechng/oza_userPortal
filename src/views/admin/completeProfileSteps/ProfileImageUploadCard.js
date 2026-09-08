/* eslint-disable no-undef */
import {
  Flex, Text, useColorModeValue, Icon,
  VStack, Image, HStack, Box, Input,
  Button, Alert, AlertIcon, Spinner, Badge,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { MdUpload, MdCheckCircle, MdPerson } from 'react-icons/md';
import client from "components/client";
import { updateUserDetails } from "storeMtg/authSlice";
import { useToast } from "@chakra-ui/react";

export default function ProfileImageUpload(props) {
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
  const [loading, setLoading] = useState(false);
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
      const res = await client.post('/api/deleteUploaded_image', sendData, {
        headers: { 'Authorization': 'Bearer ' + userToken }
      });
    } catch (error) { console.log(error.message); }
  };

  const uploadPhoto = async () => {
    if (!files || files.length === 0) {
      toast({ title: "Error!", description: "Please select a file.", status: "error", duration: 5000, isClosable: true, position: "top" });
      return false;
    }
    const file = files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", cloudPresetName);
    data.append("upload_name", cloudName);
    try {
      setLoading(true);
      response = await fetch("https://api.cloudinary.com/v1_1/ddm1owlon/image/upload", {
        method: "POST", body: data,
      }).then(response => response.json())
        .then(data => {
          const secureUrl = data.secure_url;
          setImageValue(data.public_id);
          if (secureUrl) {
            uploadPhotoURL(secureUrl);
            setLoading(true);
          }
          removeFile(file.name);
        });
    } catch (error) {
      deleteImageId(imageValue);
      console.log(error.message);
      setLoading(false);
    }
  };

  const uploadPhotoURL = async (data) => {
    setLoading(true);
    const sendData = { 'userId': user.userData._id, 'image_url': data };
    try {
      const res = await client.post('/api/user_uploadPhoto', sendData, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (res.data.msg === '201') {
        toast({ title: "Success!", description: "Profile photo uploaded successfully.", status: "success", duration: 5000, isClosable: true, position: "top" });
        setFiles(null); setLoading(false); setFiles([]);
        dispatch(updateUserDetails(res.data));
      } else if (res.data.status === '401') {
        toast({ title: "Error!", description: "Authorization required.", status: "error", duration: 5000 });
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
    } finally { setLoading(false); }
  };


  return (
    <Box>
      {/* Already uploaded notice */}
      {user.userData.reg_stage3 === 'Yes' && (
        <Flex align='center' gap='12px' p='16px' mb='20px'
          bg={successBg} borderRadius='12px'
          border='1px solid' borderColor='green.200'>
          <Icon as={MdCheckCircle} color='green.500' w='24px' h='24px' flexShrink='0' />
          <Box>
            <Text color='green.700' fontSize='sm' fontWeight='700'>
              Profile photo already uploaded
            </Text>
            <Text color='green.600' fontSize='sm'>
              Upload a new photo below to replace it
            </Text>
          </Box>
        </Flex>
      )}

      {/* Current photo preview */}
      {user.userData.profile_photo && (
        <Flex align='center' gap='12px' mb='20px'
          p='16px' bg={dropBg} borderRadius='12px'>
          <Image
            src={user.userData.profile_photo}
            boxSize='56px' borderRadius='full' objectFit='cover'
            border='3px solid' borderColor='brand.500'
          />
          <Box>
            <Text color={textColor} fontSize='sm' fontWeight='600'>
              Current Profile Photo
            </Text>
            <Text color={subColor} fontSize='sm'>
              Upload a new photo to replace this
            </Text>
          </Box>
        </Flex>
      )}

      {/* Info */}
      <Box mb='16px' p='12px' bg={dropBg} borderRadius='10px'>
        <Text color={subColor} fontSize='sm'>
          📸 Upload a clear photo of your face. This helps us verify your identity faster.
        </Text>
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
          /* Show preview inside dropzone */
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
            <Text color={subColor} fontSize='xs'>
              Click to change photo
            </Text>
          </Flex>
        ) : (
          /* Empty state */
          <Flex direction='column' align='center' gap='10px'>
            <Box w='56px' h='56px' borderRadius='16px'
              bg='brand.100' display='flex' alignItems='center' justifyContent='center'>
              <Icon as={isDragActive ? MdPerson : MdUpload}
                color='brand.500' w='28px' h='28px' />
            </Box>
            <Box>
              <Text color={textColor} fontSize='sm' fontWeight='700'>
                {isDragActive ? 'Drop photo here' : 'Click or drag photo here'}
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
          <AlertIcon />
          {error}
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
        {loading
          ? <Flex align='center' gap='8px'><Spinner size='sm' color='white' /> Processing...</Flex>
          : 'Upload Profile Photo'}
      </Button>
    </Box>
  );
}