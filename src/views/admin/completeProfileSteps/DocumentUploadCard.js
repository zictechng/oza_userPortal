// Chakra imports
import { 
    Flex, 
    Text, 
    useColorModeValue,
    Icon,
    VStack,
    Image,
    HStack, 
    Card,
    Box,
    Heading,
    Input,
    Button,
    Alert,
  AlertIcon,
  Spinner,
  useToast,
  InputGroup,
  Select
} from "@chakra-ui/react";
import client from "components/client";
// Custom components
import React , { useCallback, useState }from "react";
import { useDropzone } from 'react-dropzone';
import { MdUpload } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserDetails } from "storeMtg/authSlice";

export default function DocumentIDUpload(props) {
const dispatch = useDispatch()
const toast = useToast();
const {user, userToken} = useSelector((state) => state.authUser)
const bg = useColorModeValue('gray.100', 'navy.700');
const borderColor = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');
const cloudName = process.env.REACT_APP_CLOUDINARY_ACCOUNT_NAME;
const cloudPresetName = process.env.REACT_APP_CLOUDINARY_PRESET_NAME;

const [files, setFiles] = useState([]);
const [error, setError] = useState(null);
const [DocLoading, setDocLoading] = useState(false);
const [imageValue, setImageValue] = useState('');
const [docName, setDocName] = useState('');

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
          setError("Invalid file type. Only JPEG and PNG files under 5MB are allowed.");
        } else {
          // Otherwise, clear the error and update files
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
                        if (!docName || docName.length === 0) {
                          toast({
                            title: "Error!",
                            description: "Select Document Type.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                            position: "top",
                          });
                          return false;
                        }
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
                          
                            // If the upload was successful, process the response
                            if (secureUrl) {
                              setImageValue(data_res.public_id);
                              uploadPhotoURL(secureUrl);
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
                            'image_url': data,
                            'document_name': docName
                          }
                            try {
                                const res = await client.post('/api/user_uploadDocument', sendData,{
                                  headers: {
                                    Authorization: `Bearer ${userToken}`,
                                  },
                            })
                            
                            if(res.data.msg === '201'){
                              toast({
                                title: "success!",
                                description: "Document successfully uploaded.",
                                status: "success",
                                duration: 5000,
                                isClosable: true,
                                position: "top",
                              });
                              setFiles(null)
                              setFiles([]);
                              dispatch(updateUserDetails(res.data))
                             setDocName('');
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
          <>
            {user.userData.reg_stage4 !=='Yes' ? (
            <Flex flexDirection="column">
              <Flex direction="column">
                <Box
                  p={5}
                  ml={2}
                  mr={2}
                  bg="white"
                  >
                  <Heading fontSize="xl" color={'#aaa'}>
                    {'Documents upload'}
                  </Heading>
                  <Text mt={4} fontSize="18px" color={'#aaa'}>
                    Any of the documents below are supported.
                    <hr/>
                  </Text>
                  <Text mt={2} fontSize="18px">
                    * International Passport
                  </Text>
                  <Text mt={2} fontSize="18px">
                    * Government Official ID ("NIN").
                  </Text>
                  <Text mt={2} fontSize="18px">
                   * Driving License ("Valid")
                  </Text>
                  <Text mt={2} fontSize="18px">
                    * Bank Statement ("3 months old, on your name").
                  </Text>
                </Box>
              </Flex>
    
              <Flex direction="column">
                <InputGroup flex="1" mb='10px' width={{sm:'100%', lg: '50%' }}>
                          <Select placeholder="Select Type"
                            onChange={(e) => setDocName(e.target.value)}
                            value={docName}>
                            <option value="Bank Statement">Bank Statement</option>
                            <option value="Driving License">Driving License</option>
                            <option value="Government ID">Government ID</option>
                            <option value="International Passport">International Passport</option>
                            
                            </Select>
                          </InputGroup>
                <Card px="0px" mb="20px" height="250px">
                  <Flex
                    align="center"
                    justify="center"
                    bg={bg}
                    border="1px dashed"
                    borderColor={borderColor}
                    borderRadius="16px"
                    h="max-content"
                    minH="85%"
                    cursor="pointer"
                    ml="5"
                    mr="5"
                    mt='5'
                    mb='5'
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
                              Select file [PNG and JPG] files are allowed
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
                  {DocLoading ? <Text><Spinner color="white.500" animationDuration="0.8s" size="sm" /> Processing</Text> : 'Upload Document'}
                </Button>
              </Flex>
            </Flex>
        ):<Heading fontSize="xl" color={'#aaa'}>
          {'Document ID has already been uploaded! There is nothing to do at the moment.'}
        </Heading> }</>
  );
}
