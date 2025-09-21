/* eslint-disable react-hooks/exhaustive-deps */
// Chakra imports
import React , {useState, useEffect} from "react";
import {
    Box,
    Button,
    Flex,
    Text,
    Textarea,
    SimpleGrid,
    Select,
    HStack, 
    Input ,
    InputGroup,
    InputLeftElement,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    ModalFooter,
    useToast,
    Spinner
  } from "@chakra-ui/react";
  // Custom components
import Card from "components/card/Card.js";
import { ProfileIcon } from "components/icons/Icons";
import { useNavigate } from 'react-router-dom';
import client from "components/client";
import { useDispatch, useSelector } from 'react-redux';
import { sendFundData } from "storeMtg/sendFundSlice";
import { resetAccountState } from "storeMtg/pinUpdateSlice";
import { updateUserDetails } from "storeMtg/authSlice";
  
  // Assets
  
  export default function SendFund(props) {
  
    const toast = useToast();
    const dispatch = useDispatch()
    const {user, userToken} = useSelector((state) => state.authUser)
    const { used, total, ...rest } = props;
    const [isGettingID, setIsGettingID] = useState(false);
    const [newData, setNewData] = useState('')

    const {onClose } = useDisclosure();
    const navigate = useNavigate();
    const {acctLoading} = useSelector((state) => state.sendFund)
    
    const initialRef = React.useRef();
    const finalRef = React.useRef();

    const [detailsFormData, setDetailsFormData] = useState({
            acctPin:'',
            tag_id: '',
            sendAmt: '',
            send_note: '',
            account_source: '',
            });

    const handleDataChange = (e) => {
      const { name, value } = e.target;
      setDetailsFormData({
        ...detailsFormData,
        [name]: value,
      });
    };
    
    // open modal state
      const {
        isOpen: isRevocationModalOpen,
        onOpen: onOpenRevocationModal,
        onClose: onCloseRevocationModal,
      } = useDisclosure();

      // fetch receiver details
    const getReceiverDetails = async() => {
      setIsGettingID(true)
      try {
          
      const res = await client.post('/api/fetch_AccountDetailsMobile',{
        data: detailsFormData.tag_id
      } 
      )
        if(res.data.msg === '200'){
          //console.log(' user Tag details', res.data.userData);
        setNewData(res.data.userData)
        
        }
        else if(res.data.status === '404'){
         //console.log('no account found')
         setNewData('')
        }
        else {
          toast({
            title: "error!",
            description: "Record not found",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }

    } catch (error) {
      console.log(error.message)
    }
    finally {
      setIsGettingID(false)
    }
  }

      // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
      useEffect(() => {
        // Use a setTimeout to delay the execution of the function
        const timeoutId = setTimeout(() => {
          if(detailsFormData.tag_id.length === 7){
            getReceiverDetails();
          }
          // Clear the timeout to prevent further execution
          clearTimeout(timeoutId);
        }, 500);
      }, [detailsFormData.tag_id]);

      // processing fund sending

      const getFundsendingDetails = () => 
      {
        if(detailsFormData.tag_id === '' || detailsFormData.tag_id === null)
        {
          toast({
            title: "error!",
            description: "Enter receiver Tag ID",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          return false;
        }
        if(detailsFormData.account_source === undefined || detailsFormData.account_source === '')
          {
            toast({
              title: "error!",
              description: "Account source is required",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return false;
          }
          if(detailsFormData.sendAmt === undefined || detailsFormData.sendAmt === '')
            {
              toast({
                title: "error!",
                description: "Amount sending is required",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return false
            }
            if (!/^\d+$/.test(detailsFormData.sendAmt)) {
              toast({
                title: "Error!",
                description: "Please enter a valid digit amount",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return false;
            }
            else{
              onOpenRevocationModal();
            }
        }

        // processing the sending fund
        const sendFundRequest = () => 
        {
          const getSendInfo=
          {
            amt: detailsFormData.sendAmt,
            tagId: detailsFormData.tag_id,
            note: detailsFormData.send_note,
            userId: user.userData?._id,
            acctPin: detailsFormData.acctPin,
            account_source: detailsFormData.account_source,
          }
            if(detailsFormData.acctPin===null || detailsFormData.acctPin===''|| detailsFormData.acctPin === undefined)
            {
              toast({
                title: "error!",
                description: "Please enter account pin to authorize this transaction",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
              });
              return false;
            }
          // check if the user is sending fund to himself 
          if(detailsFormData.tag_id === user.userData?.tag_id)
          {
            toast({
              title: "error!",
              description: "Sorry, same account can not receive funds sending",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return false;
          }
          
            dispatch(sendFundData(getSendInfo))
          .then((result) => {
                if (result.payload.msg ==='200') {
                  // Success case
                  //console.log('Front Success:', result.payload);
                  // reset global state
                  dispatch(resetAccountState());
                  dispatch(updateUserDetails(result.payload));
                  // reset input fields
                      setDetailsFormData({
                        acctPin:'',
                        tag_id: '',
                        sendAmt: '',
                        send_note: '',
                        account_source: '',
                    });
                    // show success message
                    toast({
                      title: "Success!",
                      description: "Funds sent successfully.",
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                      position: "top",
                    });
                    navigate('/user/success')
               
                } 
                else if(result.payload.msg !=='200')
                  {
                    toast({
                      title: "Failed!",
                      description: result.payload.message,
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                      position: "top",
                    });
                   }
                else {
                  // Failure case
                    console.error('Error:', result.payload || 'Something went wrong');
                    toast({
                      title: "error!",
                      description: "Something went wrong, try again.",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                      position: "top",
                    });
                }
              })
              .catch((error) => {
                console.error('Unexpected error:', error);
              });
          
        }
  
    return (
      <Card {...rest} mb='20px' align='center' p='20px'>
        <Flex px="5px" mb="8px" justifyContent="space-between" align="center">
          <Text
          fontSize={{ sm: '14px', lg: '16px'}}
          py={1.5}
          color="gray.700"
          >
          Send Funds
          </Text>
          
      </Flex>
      <Flex px="5px" mb="8px" justifyContent="space-between" align="center">
          
          <Text
          fontSize={{ sm: '14px', lg: '16px'}}
          py={1.5}
          color="gray.400"
          >
          Enter the receiver Tag ID, select source type and enter the amount you want to send.
          </Text>
      </Flex>

      <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <HStack gap="10" width="full">
          <InputGroup flex="1">
          <InputLeftElement children={<ProfileIcon />} fontSize={'25px'} color={'gray.300'} />
            <Input placeholder="Receiver Tag ID" width={{base:'100%', lg:'400px', md:'400px'}}
            value={detailsFormData.tag_id}
            name="tag_id"
            onChange={handleDataChange} />
          </InputGroup>
        </HStack>
      </Flex>
        <Text fontSize={'20px'} color={'gray.300'} align='left' mt='-15px' mb='10px' ml='8px'>{newData}</Text>

        <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <Select placeholder="Account Source" color={'gray.500'} width={{base:'100%', lg:'400px', md:'400px'}}
            value={detailsFormData.account_source}
            name="account_source"
            onChange={handleDataChange}>
          <option value="2">Account [USD]</option>
          <option value="1">Fund Account [NGN]</option>
        </Select>
       </Flex>
       <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <HStack gap="10" width="full">
          <InputGroup flex="1">
          <InputLeftElement children='&#36;' fontSize={'25px'} color={'gray.300'} />
            <Input placeholder="Amount" width={{base:'100%', lg:'400px', md:'400px'}} 
            value={detailsFormData.sendAmt}
            name="sendAmt"
            onChange={handleDataChange}/>
          </InputGroup>
        </HStack>
      </Flex>
      
        <Textarea placeholder="Reason/purpose (250 characters max optional)" h={100} 
        value={detailsFormData.send_note}
        name="send_note"
        onChange={handleDataChange}/>
        <Box>
            <Flex px="0px" align='center' mb={{ sm: "0px", md: "20px" }} direction='column' >
                  <SimpleGrid
                      columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
                      gap={{ md: '250px', lg: '250px', sm: '40px' }}
                      mb='40px'
                      mt='40px'
                      width={{sm: '100%' }}>
                          <Button
                          bg='#5464c4'
                          color='white'
                          _hover={{ bg: "#5363CE" }}
                          _active={{ bg: "#5363CE" }}
                          _focus={{ bg: "#5363CE" }}
                          fontWeight='500'
                          fontSize='14px'
                          py='20px'
                          px='27'
                          me='38px' 
                          width={{ md: '200px', lg: '200px', sm: '100%' }}
                          onClick={() => getFundsendingDetails()}>
                      Submit
                      </Button>
                  </SimpleGrid>
            </Flex>
          </Box>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isRevocationModalOpen}
        onClose={onClose}
        >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Authorization Required</ModalHeader>
          <Text px={5} color={'gray.500'}>Enter account pin to authorized this transactions</Text>
          <ModalCloseButton  onClick={onCloseRevocationModal}/>
          <ModalBody pb={6}>
            <FormControl mt={1}>
              <FormLabel>Enter Pin</FormLabel>
              <Input ref={initialRef} placeholder="Enter Account Pin"
              type="password"
                value={detailsFormData.acctPin}
                name="acctPin"
                onChange={handleDataChange} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} bg={'#5464c4'} color='#fff' _hover={{ bg: "#5363CE", color: "#fff" }}
              disabled={acctLoading}
              onClick={()=> sendFundRequest()}>
              {acctLoading ? <Text><Spinner color="white.500" animationDuration="0.8s" size="sm" /> Validating</Text> : 'Confirm'}
            </Button>
            <Button onClick={onCloseRevocationModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Card>
    );
  }
  