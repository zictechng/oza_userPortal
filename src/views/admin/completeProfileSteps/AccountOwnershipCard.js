import {
  Flex, Text, useColorModeValue, Icon,
  Image, Box, Input, Button,
  Alert, AlertIcon, Spinner, Badge,
  SimpleGrid, Divider,
} from "@chakra-ui/react";
import client from "components/client";
import React, { useCallback, useState, useRef } from "react";
import { useDropzone } from 'react-dropzone';
import {
  MdUpload, MdCheckCircle, MdCameraAlt,
  MdPerson, MdEmail, MdRefresh,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserDetails } from "storeMtg/authSlice";
import { useToast } from "@chakra-ui/react";

export default function AccountOwnerShip(props) {
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
  const infoBg = useColorModeValue('blue.50', 'navy.700');
  const stepBg = useColorModeValue('gray.50', 'navy.700');

  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [DocLoading, setDocLoading] = useState(false);
  const [imageValue, setImageValue] = useState('');
  const [otpSend, setOtpSend] = useState(false);
  const [documentType, setDocumentType] = useState('');
  const [loading2fa, setLoading2FA] = useState(false);

  // Webcam states
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      setError("Invalid file type. Only JPEG and PNG files under 5MB are allowed.");
    } else {
      setError(null);
      setCapturedPhoto(null); // clear webcam capture if file selected
      setFiles(acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      ));
      setDocumentType(acceptedFiles);
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

  // ── WEBCAM FUNCTIONS ──────────────────────────────────

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setShowCamera(true);
      setFiles([]);
      setCapturedPhoto(null);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      }, 100);
    } catch (err) {
      toast({
        title: 'Camera Error',
        description: 'Could not access camera. Please allow camera permission or upload a photo instead.',
        status: 'error', duration: 5000, isClosable: true, position: 'top',
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const capturedFile = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
      Object.assign(capturedFile, { preview: URL.createObjectURL(capturedFile) });
      setFiles([capturedFile]);
      setCapturedPhoto(canvas.toDataURL('image/jpeg'));
      stopCamera();
    }, 'image/jpeg', 0.9);
  };

  // ── ORIGINAL WORKING FUNCTIONS — NOT CHANGED ──────────

  const sendOTPCode = async () => {
    const formData = { userId: user.userData._id };
    if (user.userData.email === undefined || user.userData.email === '') {
      toast({ title: "Error!", description: "Please login to get started.", status: "error", duration: 5000, isClosable: true, position: "top" });
      return;
    }
    try {
      setLoading2FA(true);
      const res = await client.post('/api/user_2fa_otpSend', formData, {
        headers: { 'Authorization': 'Bearer ' + userToken }
      });
      if (res.data.msg === '201') {
        setOtpSend(true);
        toast({ title: "OTP Sent!", description: "Check your email for the OTP code.", status: "success", duration: 5000, isClosable: true, position: "top" });
      } else if (res.data.status === '404') {
        toast({ title: "Error!", description: "No account found.", status: "error", duration: 5000 });
      } else if (res.data.status === '402') {
        toast({ title: "Error!", description: "Login and try again.", status: "error", duration: 5000 });
      } else {
        toast({ title: "Error!", description: "System error occurred.", status: "error", duration: 5000 });
      }
    } catch (error) { console.log(error); }
    finally { setLoading2FA(false); }
  };

  const deleteImageId = async (data) => {
    const sendData = { 'userId': user.userData?._id, 'delete_url': data };
    try {
      await client.post('/api/deleteUploaded_image', sendData, {
        headers: { 'Authorization': 'Bearer ' + userToken }
      });
    } catch (error) { console.log(error.message); }
  };

  const uploadDoc = async () => {
    if (!files || files.length === 0) {
      toast({ title: "Error!", description: "Please select or take a photo first.", status: "error", duration: 5000, isClosable: true, position: "top" });
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
    setDocLoading(true);
    const sendData = {
      'userId': user.userData._id,
      'image_url': data,
      'fileType': documentType,
      'public_id': imageValue
    };
    try {
      const res = await client.post('/api/user_upload2fa', sendData, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (res.data.msg === '201') {
        toast({ title: "Success!", description: "Selfie uploaded successfully. We will review your account.", status: "success", duration: 5000, isClosable: true, position: "top" });
        setFiles(null); setFiles([]);
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
    } finally { setDocLoading(false); }
  };

  // ── ALREADY DONE ──────────────────────────────────────

  if (user.userData?.reg_stage5 === 'Yes') {
    return (
      <Flex align='center' gap='12px' p='20px'
        bg={successBg} borderRadius='16px'
        border='1px solid' borderColor='green.200'>
        <Icon as={MdCheckCircle} color='green.500' w='28px' h='28px' flexShrink='0' />
        <Box>
          <Text color='green.700' fontSize='sm' fontWeight='700'>
            Account ownership verified
          </Text>
          <Text color='green.600' fontSize='xs' mt='4px'>
            Your selfie has been submitted and is under review.
            You cannot re-submit at this time.
          </Text>
        </Box>
      </Flex>
    );
  }

  // ── MAIN UI ───────────────────────────────────────────

  return (
    <Box>
      {/* Step 1 — Profile photo reference */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap='16px' mb='20px'>
        {/* User's profile photo */}
        <Box p='16px' bg={stepBg} borderRadius='16px'
          border='1px solid' borderColor={borderColor} textAlign='center'>
          <Text color={subColor} fontSize='xs' fontWeight='600'
            textTransform='uppercase' letterSpacing='0.5px' mb='12px'>
            Your Profile Photo
          </Text>
          {user.userData?.profile_photo ? (
            <Image
              src={user.userData.profile_photo}
              alt='Profile'
              boxSize='100px'
              borderRadius='full'
              objectFit='cover'
              border='3px solid'
              borderColor='brand.500'
              mx='auto'
            />
          ) : (
            <Box w='100px' h='100px' borderRadius='full'
              bg='gray.200' mx='auto'
              display='flex' alignItems='center' justifyContent='center'>
              <Icon as={MdPerson} w='48px' h='48px' color='gray.400' />
            </Box>
          )}
          <Text color={subColor} fontSize='xs' mt='8px'>
            Take a selfie that matches this photo
          </Text>
        </Box>

        {/* Instructions */}
        <Box p='16px' bg={infoBg} borderRadius='16px'
          border='1px solid' borderColor='blue.200'>
          <Text color={textColor} fontSize='sm' fontWeight='700' mb='12px'>
            📋 How it works
          </Text>
          {[
            { step: '1', text: 'Click "Send OTP" to get a code on your email' },
            { step: '2', text: 'Write the OTP code clearly on a piece of paper' },
            { step: '3', text: 'Take a selfie holding the paper with the code' },
            { step: '4', text: 'Upload the selfie below' },
          ].map((item, i) => (
            <Flex key={i} align='flex-start' gap='10px' mb='10px'>
              <Box w='22px' h='22px' borderRadius='full'
                bg='brand.500' display='flex' alignItems='center'
                justifyContent='center' flexShrink='0'>
                <Text color='white' fontSize='10px' fontWeight='800'>{item.step}</Text>
              </Box>
              <Text color={subColor} fontSize='sm'>{item.text}</Text>
            </Flex>
          ))}
        </Box>
      </SimpleGrid>

      {/* Step 2 — Send OTP */}
      <Box p='16px' bg={stepBg} borderRadius='16px'
        border='1px solid'
        borderColor={otpSend ? 'green.300' : borderColor}
        mb='20px'>
        <Flex justify='space-between' align='center'>
          <Flex align='center' gap='10px'>
            <Icon as={MdEmail} color={otpSend ? 'green.500' : 'brand.500'} w='20px' h='20px' />
            <Box>
              <Text color={textColor} fontSize='sm' fontWeight='700'>
                {otpSend ? 'OTP sent to your email ✓' : 'Get your OTP code'}
              </Text>
              <Text color={subColor} fontSize='xs'>
                {otpSend
                  ? `Sent to ${user.userData?.email}`
                  : 'We will send a unique code to your registered email'}
              </Text>
            </Box>
          </Flex>
          {!otpSend ? (
            <Button
              size='sm' bg='brand.500' color='white'
              borderRadius='10px' fontWeight='700'
              _hover={{ bg: 'brand.600' }}
              isLoading={loading2fa}
              loadingText='Sending...'
              onClick={() => sendOTPCode()}>
              Send OTP
            </Button>
          ) : (
            <Button
              size='sm' variant='ghost' color='brand.500'
              leftIcon={<Icon as={MdRefresh} />}
              onClick={() => { setOtpSend(false); sendOTPCode(); }}>
              Resend
            </Button>
          )}
        </Flex>
      </Box>

      {/* Step 3 — Upload selfie */}
      <Divider borderColor={borderColor} mb='20px' />
      <Text color={textColor} fontSize='sm' fontWeight='700' mb='4px'>
        Upload Your Selfie with OTP Code
      </Text>
      <Text color={subColor} fontSize='xs' mb='16px'>
        Take a clear selfie holding the paper with the OTP code written on it
      </Text>

      {/* Camera / Upload toggle */}
      <Flex gap='10px' mb='16px'>
        <Button
          size='sm' borderRadius='10px' fontWeight='600'
          leftIcon={<Icon as={MdCameraAlt} />}
          bg={showCamera ? 'brand.500' : dropBg}
          color={showCamera ? 'white' : textColor}
          border='1px solid' borderColor={showCamera ? 'brand.500' : borderColor}
          _hover={{ borderColor: 'brand.500' }}
          onClick={() => showCamera ? stopCamera() : startCamera()}>
          {showCamera ? 'Close Camera' : 'Use Camera'}
        </Button>
        <Button
          size='sm' borderRadius='10px' fontWeight='600'
          leftIcon={<Icon as={MdUpload} />}
          bg={!showCamera ? 'brand.500' : dropBg}
          color={!showCamera ? 'white' : textColor}
          border='1px solid' borderColor={!showCamera ? 'brand.500' : borderColor}
          _hover={{ borderColor: 'brand.500' }}
          onClick={() => { stopCamera(); }}>
          Upload Photo
        </Button>
      </Flex>

      {/* Webcam */}
      {showCamera && (
        <Box mb='16px' borderRadius='16px' overflow='hidden'
          border='2px solid' borderColor='brand.500'>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <Flex justify='center' p='12px' bg={dropBg}>
            <Button
              bg='brand.500' color='white'
              borderRadius='12px' fontWeight='700'
              leftIcon={<Icon as={MdCameraAlt} />}
              _hover={{ bg: 'brand.600' }}
              onClick={capturePhoto}>
              Take Selfie
            </Button>
          </Flex>
        </Box>
      )}

      {/* Dropzone — shown when camera is off */}
      {!showCamera && (
        <Box
          {...getRootProps()}
          bg={isDragActive ? dropActiveBg : dropBg}
          border='2px dashed'
          borderColor={isDragActive ? 'brand.500' : files.length ? 'brand.500' : borderColor}
          borderRadius='16px'
          p={files.length || capturedPhoto ? '16px' : '32px'}
          textAlign='center'
          cursor='pointer' mb='16px' transition='all 0.2s'
          _hover={{ borderColor: 'brand.500', bg: dropActiveBg }}>
          <Input variant='main' {...getInputProps()} />

          {files.length > 0 ? (
            <Flex direction='column' align='center' gap='12px'>
              <Image
                src={capturedPhoto || files[0].preview}
                alt='Selfie preview'
                maxH='220px'
                borderRadius='12px'
                objectFit='contain'
              />
              <Flex align='center' gap='8px'>
                <Badge colorScheme='green' borderRadius='full'>✓ Photo ready</Badge>
                <Button size='xs' colorScheme='red' variant='ghost'
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(files[0].name);
                    setCapturedPhoto(null);
                  }}>
                  Remove
                </Button>
              </Flex>
              <Text color={subColor} fontSize='xs'>Click to change photo</Text>
            </Flex>
          ) : (
            <Flex direction='column' align='center' gap='10px'>
              <Box w='56px' h='56px' borderRadius='16px'
                bg='brand.100' display='flex' alignItems='center' justifyContent='center'>
                <Icon as={isDragActive ? MdPerson : MdUpload}
                  color='brand.500' w='28px' h='28px' />
              </Box>
              <Box>
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                  {isDragActive ? 'Drop selfie here' : 'Click or drag selfie here'}
                </Text>
                <Text color={subColor} fontSize='xs' mt='4px'>
                  PNG, JPG files only — max 5MB
                </Text>
              </Box>
            </Flex>
          )}
        </Box>
      )}

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
        onClick={() => uploadDoc()}>
        {DocLoading
          ? <Flex align='center' gap='8px'><Spinner size='sm' color='white' /> Uploading...</Flex>
          : 'Submit Selfie for Verification'}
      </Button>
    </Box>
  );
}