import React, { useCallback, useState } from 'react';

// Chakra imports
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Button,
  Icon,
  VStack,
  Image,
  HStack,
  useColorModeValue,
  Input,
  Alert,
  AlertIcon,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { MdUpload } from 'react-icons/md';

// Custom components
import Card from 'components/card/Card.js';
import { useDropzone } from 'react-dropzone';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { NairaValueFormat } from 'components/NairaFormat';
import { DollarValueFormat } from 'components/DollarFormat';
import client from 'components/client';

// Assets
export default function ProofPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const { amt, track_id, serviceType } = location.state || {};
  const {user, userToken} = useSelector((state) => state.authUser)

  const cloudName = process.env.REACT_APP_CLOUDINARY_ACCOUNT_NAME;
  const cloudPresetName = process.env.REACT_APP_CLOUDINARY_PRESET_NAME;

  const bg = useColorModeValue('gray.100', 'navy.700');
  const borderColor = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');
  // Chakra Color Mode


  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [DocLoading, setDocLoading] = useState(false);
  const [imageValue, setImageValue] = useState('');
  const [fileUploadType, setFileUploadType] = useState('');

   const onDrop = useCallback((acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
            setError("Invalid file type. Only JPEG and PNG files under 5MB are allowed.");
          } else {
            // Otherwise, clear the error and update files
            acceptedFiles.forEach((file) => {
              setFileUploadType(file.type)
              console.log(`File type: ${file.type}`);
            });
            setError(null);
            setFiles(
            acceptedFiles.map((file) =>
                Object.assign(file, {
                preview: URL.createObjectURL(file),
                }),
            ),
            );
        }
      }, []);
    
      const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ["image/jpeg", "image/png"],
        maxSize: 5 * 1024 * 1024, // 2 MB
      });
    
      const removeFile = (fileName) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
      };
  
                        // delete old photo method here
                      const deleteImageId = async(data) =>{
                        const sendData = {
                          'userId': user.userData?._id,
                          'delete_url': data
                        }
                          try {
                              const res = await client.post('/api/deleteUploaded_image', sendData,{
                                headers: {
                                  'Authorization': 'Bearer '+userToken,
                              }
                          })
                          if(res.data.msg === '201'){
                            // update user profile details
                          }
                          else if(res.data.status === '401'){
                            toast({
                              title: "error!",
                              description: "Authorization required to delete old photo.",
                              status: "error",
                              duration: 5000,
                              isClosable: true,
                              position: "top",
                            });
                            return
                          }
                          else if(res.data.status === '402'){
                            toast({
                              title: "error!",
                              description: "You need to login and try again",
                              status: "error",
                              duration: 5000,
                              isClosable: true,
                              position: "top",
                            });
                            return
                          }
                          else if(res.data.status === '500'){
                            toast({
                              title: "error!",
                              description: res.data.message,
                              status: "error",
                              duration: 5000,
                              isClosable: true,
                              position: "top",
                            });
                            return
                          }
                        } catch (error) {
                          console.log(error.message)
                        }
                      }
                  
                        const uploadPhoto = async () => {
                            if (!files || files.length === 0) {
                              toast({
                                title: "Error!",
                                description: "You cannot submit an empty form! Please select a file.",
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                                position: "top",
                              });
                              return false;
                            }
                            
                            const file = files[0]; // Get the first file
                            try {
                              setDocLoading(true);
                              const data = new FormData();
                              data.append("file", file); // Add the raw file object
                              data.append("upload_preset", cloudPresetName);
                              data.append("upload_name", cloudName);
                              // Make the API request to upload the file
                              const response = await fetch("https://api.cloudinary.com/v1_1/ddm1owlon/image/upload", {
                                method: "POST",
                                body: data,
                              });
                            
                              const data_res = await response.json(); // Parse the JSON response
                              const secureUrl = data_res.secure_url;
                              const publicId = data_res.public_id;
                              
                              setImageValue(publicId);
                              // If the upload was successful, process the response
                              if (secureUrl) {
                                console.log("pp ", data_res.public_id)
                                const responseData ={
                                  dataUrl:secureUrl,
                                  publicId: data_res.public_id
                                }
                                uploadPhotoURL(responseData);
                                setDocLoading(false); // Set Docloading to false after completion
                                removeFile(file.name); // Remove the file preview from UI
                              } else {
                                throw new Error("Failed to upload photo");
                              }
                            } catch (error) {
                              deleteImageId(imageValue); // Optionally delete image ID if needed
                              console.error("Upload error:", error.message);
                              setDocLoading(false); // Ensure Docloading is set to false on error
                            }
                          };
                    // upload and update user photo url
                      const uploadPhotoURL = async(data) => {
                      setDocLoading(true)
                      const sendData = {
                        'userId': user.userData._id,
                        'image_url': data.dataUrl,
                        'trackId': track_id,
                        'fileType': fileUploadType,
                        'public_id': data.publicId
                      }
                        try {
                            const res = await client.post('/api/user_uploadPaymentProof', sendData,{
                              headers: {
                                Authorization: `Bearer ${userToken}`,
                              },
                        })
                        
                        if(res.data.msg === '201'){
                          toast({
                            title: "success!",
                            description: "Document uploaded successfully and it's now been review .",
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                            position: "top",
                          });
                          setFiles(null)
                          setFiles([]);
                          navigate('/user/')
                          }
                        else if(res.data.status === '401'){
                          toast({
                            title: "error!",
                            description: "Authorization required.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                            position: "top",
                          });
                          return deleteImageId(imageValue)
                        }
                        else if(res.data.status === '400'){
                          toast({
                            title: "error!",
                            description: "Profile not found, try again.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                            position: "top",
                          });
                          return deleteImageId(imageValue)
                        }
                        else if(res.data.status === '404'){
                          toast({
                            title: "error!",
                            description: "File too large",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                            position: "top",
                          });
                          return deleteImageId(imageValue)
                        }
                        else if(res.data.status === '402'){
                          toast({
                            title: "error!",
                            description: "You need to login and try again.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                            position: "top",
                          });
                          deleteImageId(imageValue)
                          return
                        }
                        else if(res.data.status === '500'){
                          toast({
                            title: "error!",
                            description: res.data.message,
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                            position: "top",
                          });
                          return deleteImageId(imageValue)
                        }
                        
                      } catch (error) {
                        deleteImageId(imageValue)
                        console.log(error.message)
                      }
                      finally{
                        setDocLoading(false)
                      }
                    
                      }

  return (
    <Box pt={{ base: '80px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
        gap={{ base: '20px', xl: '20px' }}
        display={{ base: 'block', xl: 'grid' }}
      >
        <Flex flexDirection="column">
          <Flex direction="column">
            <Box
              p={5}
              shadow="md"
              borderWidth="1px"
              mb={10}
              ml={2}
              mr={2}
              bg="white"
              borderRadius="15"
            >
              <Flex
                  fontSize={{ base: "20px", md: "18px" }} // Adjusts font size for responsiveness
                  color="#aaa"
                  direction="row"
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Heading fontWeight="400" color="inherit">
                    Upload Payment Proof for{' '}
                  </Heading>
                  <Text fontSize='30px' ml='10px'>
                  {serviceType === 'Funding' ? (
                    <NairaValueFormat value={amt} />
                  ) : (
                    <DollarValueFormat value={amt} />
                  )}
                  </Text>
                 
              </Flex>
              <Text mt={4} fontSize="18px">
                This is highly recommended for manual payment! Please upload
                proof of payment to fast track your transaction approval.{' '}
              </Text>
            </Box>
          </Flex>

          <Flex direction="column">
            <Card px="0px" mb="20px" height="300px">
              <Flex
                align="center"
                justify="center"
                bg={bg}
                border="1px dashed"
                borderColor={borderColor}
                borderRadius="16px"
                h="max-content"
                minH="100%"
                cursor="pointer"
                ml="5"
                mr="5"
                {...getRootProps()}
              >
                <Input variant="main" {...getInputProps()} />
                <Button variant="no-effects">
                  <Box>
                    <Icon as={MdUpload} w="80px" h="80px" color={'#aaa'} />
                    <Flex justify="center" mx="auto" mb="12px">
                      {isDragActive ? (
                        <Text fontSize="xl" fontWeight="700" color={'#aaa'}>
                          Upload Files Here
                        </Text>
                      ) : files.length? (
                        <Text
                          fontSize="20px"
                          fontWeight="500"
                          color="secondaryGray.500">
                          File selected! please upload
                        </Text>):(
                        <Text
                          fontSize="sm"
                          fontWeight="500"
                          color="secondaryGray.500"
                        >
                          Select file [PNG, JPG and PDF] files are allowed
                        </Text>
                      )}
                    </Flex>
                  </Box>
                </Button>
              </Flex>
            </Card>
            <VStack align="stretch" spacing={4}>
              {files.map((file) => (
                <HStack key={file.name} spacing={4} align="center">
                  {/* If the file is an image, show preview */}
                  {file.type.startsWith('image') ? (
                    <Image
                      src={file.preview}
                      alt={file.name}
                      boxSize="50px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  ) : file.type === 'application/pdf' ? (
                    <Box
                      p={2}
                      bg="gray.100"
                      borderRadius="md"
                      width="100px"
                      textAlign="center"
                    >
                      <Text fontSize="sm">PDF File</Text>
                    </Box>
                  ): (
                    <Text fontSize="sm">File not previewable</Text>
                  )}

                  {/* Display file name */}
                  <Text>{file.name}</Text>

                  {/* Remove button */}
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => removeFile(file.name)}
                  >
                    Remove
                  </Button>
                </HStack>
              ))}
            </VStack>
          </Flex>
          {error && (
            <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
          <Flex
            direction={{ base: 'column', '2xl': 'row' }}
            alignItems="center"
            justifyContent="center"
            mb="20px"
          >
            <Button
              bg={'#5464c4'}
              color="white"
              width={{ base: '80%', lg: '30%' }}
              height="50px"
              border="2px"
              borderWidth={2}
              borderColor="#FFF"
              _hover={{ bg: '#5363CE', color: '#fff' }}
              _active={{ bg: 'white' }}
              _focus={{ bg: '#5464c4' }}
              fontWeight="500"
              fontSize="14px"
              mt={20}
            onClick={()=> uploadPhoto()}
            disabled={DocLoading}>
            {DocLoading ? <Text><Spinner color="white.500" animationDuration="0.8s" size="sm" /> Processing</Text> : 'Upload'}
            </Button>
          </Flex>
        </Flex>

        {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
        <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}
        ></Flex>
      </Grid>
      {/* Delete Product */}
    </Box>
  );
}
