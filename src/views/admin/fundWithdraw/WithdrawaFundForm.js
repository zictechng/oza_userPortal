// Chakra imports
import React, {useState, useEffect}from "react";
import {
    Box,
    Button,
    Flex,
    Text,
    Textarea,
    SimpleGrid,
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
    Spinner,
    useToast,
  } from "@chakra-ui/react";
  // Custom components
  import Card from "components/card/Card.js";
  import { useNavigate } from 'react-router-dom';
  import { useDispatch, useSelector } from 'react-redux';
  import { DollarValueFormat } from "components/DollarFormat";
  import { withdrawFundData, resetWithdrawState} from "storeMtg/withdrawalSlice";
  import { CheckCircleIcon } from "@chakra-ui/icons";
  import { updateUserDetails } from "storeMtg/authSlice";
import { updateBalance } from "storeMtg/authSlice";

  
  // Assets
  
  export default function Upload(props) {

    const {onClose } = useDisclosure();
        const navigate = useNavigate();
        const toast = useToast();
        const dispatch = useDispatch()


        const {user} = useSelector((state) => state.authUser)
        const {withdrawLoading} = useSelector((state) => state.withdrawFunds)
        const [withdrawPin, setWithdrawPin] = useState('');
        
        const initialRef = React.useRef();
        const finalRef = React.useRef();

        const initialSuccessRef = React.useRef();
        const finalSuccessRef = React.useRef();
        
        // open modal state
          const {
            isOpen: isRevocationModalOpen,
            onOpen: onOpenRevocationModal,
            onClose: onCloseRevocationModal,
          } = useDisclosure();

          // withdrawal success modal 
          const {
            isOpen: isSuccessModalOpen,
            onOpen: onOpenSuccessModal,
            onClose: onCloseSuccessModal,
          } = useDisclosure();

        // redirect back home page
        const goBack =() => {
          navigate('/user/')
        }

        const closePinModal =() => {
          onCloseRevocationModal()
          setWithdrawPin()
        }

        const [detailsFormData, setDetailsFormData] = useState({
                withdraw_amt:'',
                withdraw_note: '',
                });
        const handleDataChange = (e) => {
          const { name, value } = e.target;
          setDetailsFormData({
            ...detailsFormData,
            [name]: value,
          });
        };

        //console.log("Setting ", user)
    // process withdrawal request here 
     const withdrawFunds = () => {
            // validate inputs here
          if(detailsFormData.withdraw_amt === null || detailsFormData.withdraw_amt === '')
            {
              toast({
                title: "Error!",
                description: "Please, enter withdrawal amount.",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
              });
              return false;
            }
          else if (!/^\d+$/.test(detailsFormData.withdraw_amt)) {
            toast({
              title: "Error!",
              description: "Please enter a valid digit amount",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return false;
          }
          onOpenRevocationModal()
        }

        // process the request
        const processWithdrawal =() =>{
          const userData ={
            amt: detailsFormData.withdraw_amt,
            note: detailsFormData.withdraw_note,
            }
            if(withdrawPin === undefined || withdrawPin ==='')
            {
              toast({
                title: "Error!",
                description: "Please enter account pin",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
              });
              return false;
            }
            else if (!/^\d+$/.test(detailsFormData.withdraw_amt)) {
              toast({
                title: "Error!",
                description: "Please enter a valid digit amount",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
              });
              return false;
            }
            else if(user.userData.acct_cot_pin !== withdrawPin)
            {
              toast({
                title: "Error!",
                description: "Invalid account pin entered! Try again.",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
              });
              return false;
            }
            else{
              dispatch(withdrawFundData(userData))
              .then((successData) =>{
              if(successData.payload.msg ==='200')
              {
                dispatch(resetWithdrawState())
                setDetailsFormData({
                  withdraw_amt:'',
                  withdraw_note: '',
                  });
                setWithdrawPin('')
                onCloseRevocationModal();
                onOpenSuccessModal();
                dispatch(updateBalance(successData.payload.userData.all_bonus_acct))
                //console.log("After Withdraw Status ", successData.payload)
              }
            else if (successData.payload.msg !=='200')
              {
              toast({
                title: "Error!",
                description: successData.payload.message,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
                });
              return false
              }
            }).catch((error) => {
              console.error('Unexpected error:', error);
            })
          }
            
        }
    // const successRedirect = () =>{
    //   navigate('/user/fund-account');
    // }
  
    return (
      <Card mb='20px' align='center' p='20px'>
        <Flex px="5px" mb="8px" justifyContent="space-between" align="center">
          <Text
          fontSize={{ sm: '14px', lg: '16px'}}
          py={1.5}
          color="gray.700"
          >
          Withdraw Funds?
          </Text>
      </Flex>
      <Flex px="5px" mb="8px" justifyContent="space-between" align="center">
          <Text
          fontSize={{ sm: '14px', lg: '16px'}}
          py={1.5}
          color="gray.400"
          >
          Enter the amount you wish to withdraw today.
          </Text>
      </Flex>
       <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <HStack gap="10" width="full">
          <InputGroup flex="1">
          <InputLeftElement children='&#36;' fontSize={'25px'} color={'gray.300'}/>
            <Input placeholder="Amount (in USD)" width={{base:'100%', lg:'400px', md:'400px'}}
              value={detailsFormData.withdraw_amt}
              name="withdraw_amt"
              onChange={handleDataChange}/>
          </InputGroup>
        </HStack>
      </Flex>
        
      <Flex px="0px" align="center" mb={{ sm: "0px", md: "20px" }} direction="row">
        <Text
          fontSize={{ base: "14px", lg: "16px", md: "16px" }}
          color="gray.400"
          display="inline-flex"
          alignItems="center"
          mr={5}>
            Current wallet balance: &nbsp; <DollarValueFormat value={user.userData?.all_bonus_acct} />
        </Text>
      </Flex>
      
        <Textarea placeholder="Reason/purpose (250 characters max optional)" h={100}
            value={detailsFormData.withdraw_note}
            name="withdraw_note"
            onChange={handleDataChange} />
        <Box>
            <Flex px="0px" align='center' mb={{ base: "0px", md: "20px" }} direction='column' >
                  <SimpleGrid
                      columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
                      gap={{ md: '250px', lg: '250px', base: '40px' }}
                      mb='40px'
                      mt='40px'
                      width={{base: '100%' }}>
                      <Button
                      bg='#1D2667'
                      color='white'
                      _hover={{ bg: "#5363CE" }}
                      _active={{ bg: "#5363CE" }}
                      _focus={{ bg: "#5363CE" }}
                      fontWeight='500'
                      fontSize='14px'
                      py='20px'
                      px='27'
                      me='38px' 
                      width={{ md: '200px', lg: '200px', base: '100%' }}
                      onClick={() => withdrawFunds()}>
                      Withdraw
                      </Button>
                  </SimpleGrid>
            </Flex>
          </Box>

          {/* Pin modal */}
          <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isRevocationModalOpen}
            onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Authorization Required</ModalHeader>
              <Text px={5} color={'gray.500'}>Please enter your account pin to authorized this transactions</Text>
              <ModalCloseButton  onClick={()=>closePinModal()}/>
              <ModalBody pb={6}>
                <FormControl mt={1}>
                  <FormLabel>Enter Pin</FormLabel>
                  <Input ref={initialRef} placeholder="Enter Account Pin"
                  type="password"
                    onChange={(e) => setWithdrawPin(e.target.value)}
                  value={withdrawPin} />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button mr={3} bg={'#1D2667'} color='#fff' _hover={{ bg: "#5363CE", color: "#fff" }}
                onClick={()=> processWithdrawal()}
                disabled={withdrawLoading}>
                  {withdrawLoading ? <Text><Spinner _hover={withdrawLoading ? {color: "#FFF"} : {color:'#1D2667'}} animationDuration="0.8s" size="sm" /> Waiting</Text>
                  :'Confirm'}
                </Button>
                <Button onClick={()=>closePinModal()}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* success modal */}
          <Modal
            initialFocusRef={initialSuccessRef}
            finalFocusRef={finalSuccessRef}
            isOpen={isSuccessModalOpen}
            onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>
                
                </ModalHeader>
                <Flex justifyContent='center' alignItems='center' direction='column'>
                   <CheckCircleIcon fontSize='80px' color={'green.300'} mb='10px' />
                      <Box flex="1" textAlign="left" fontSize={{ base: "30px", lg: "22px" }} mb={5}>
                            Successful
                      </Box>
                    </Flex>
                <Text px={5} color={'gray.500'}>Your withdrawal request was successfully submitted! Your bank account will be credited once approved.</Text>
                <ModalCloseButton  onClick={()=>goBack()}/>
                <ModalBody pb={6}>
                  <FormControl mt={1}>
                    
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button mr={3} bg={'#1D2667'} color='#fff' _hover={{ bg: "#5363CE", color: "#fff" }}
                  onClick={()=> goBack()}>
                   Okay
                  </Button>
                  
                </ModalFooter>
              </ModalContent>
          </Modal>
      </Card>
    );
  }
  