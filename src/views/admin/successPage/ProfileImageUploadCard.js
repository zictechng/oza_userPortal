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
  AlertIcon
} from "@chakra-ui/react";
// Custom components
import React , { useCallback, useState }from "react";
import { useDropzone } from 'react-dropzone';
import { MdUpload } from 'react-icons/md';

export default function ProfileImageUpload(props) {

const bg = useColorModeValue('gray.100', 'navy.700');
const borderColor = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');

const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

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
    setFiles(files.filter((file) => file.name !== fileName));
  };
 
  return (
    <Flex flexDirection="column">
              <Flex direction="column">
                <Box
                  p={5}
                  ml={2}
                  mr={2}
                  bg="white"
                  >
                  {/* <Heading fontSize="xl" color={'#aaa'}>
                    {'Upload Payment Proof'}
                  </Heading> */}
                  <Text mt={4} fontSize="18px">
                    Highly recommended to upload profile photo to fast track your account approval.
                  </Text>
                </Box>
              </Flex>
    
              <Flex direction="column">
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
                              Select file [PNG, JPG] files are allowed
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
                          <Text fontSize="sm">PDF File not supported</Text>
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
                  bg={'#1D2667'}
                  color="white"
                  width={{ base: '80%', lg: '30%' }}
                  height="50px"
                  border="2px"
                  borderWidth={2}
                  borderColor="#FFF"
                  _hover={{ bg: '#5363CE', color: '#fff' }}
                  _active={{ bg: 'white' }}
                  _focus={{ bg: '#1D2667' }}
                  fontWeight="500"
                  fontSize="14px"
                  mt={20}
                >
                  Upload Photo
                </Button>
              </Flex>
            </Flex>
  );
}
