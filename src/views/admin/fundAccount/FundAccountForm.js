// Chakra imports
import React, {useState, useEffect} from "react";
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
    useToast,
    Spinner
  } from "@chakra-ui/react";
  // Custom components
  import Card from "components/card/Card.js";
  import {useNavigate } from 'react-router-dom';
  import { useDispatch, useSelector } from 'react-redux';
  import { getPaymentGateStatus, resetPaymentGatewayState } from "storeMtg/checkPaymentGatewayStatusSlice";
  import { paystackFundData , resetPaystackState} from "storeMtg/fundAccountPaysackSlice";
import { getFundLimitRate } from "storeMtg/getFundingLimitSlice";

  // Assets
  export default function Upload(props) {
    const { used, total, ...rest } = props;
    const toast = useToast();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.authUser)

    const PaystackDemoKey = process.env.REACT_APP_PAYSTACK_DEMO_KEY;

    const {onClose } = useDisclosure();

    const initialRef = React.useRef();
    const finalRef = React.useRef();
    const [sendAmt, setSendAmt] = useState('')
    const [sendNote, setSendNote] = useState('')
    const [onlinePayment, setOnlinePayment] = useState(false)
    const [showMessageButton, setShowMessageButton] = useState('');
    const [gateWayRes, setGetawayRes] = useState('');
    const [btnLoader, setBtnLoader] = useState(false);
    const [payBtnLoader, setPayBtnLoader] = useState(false);

        // open modal state
          const {
            isOpen: isRevocationModalOpen,
            onOpen: onOpenRevocationModal,
            onClose: onCloseRevocationModal,
           } = useDisclosure();

    // call paystack button here 
    const handlePaystackButtonClick = () => {
              setPayBtnLoader(true)

                setTimeout(() => {
                  dispatch(getFundLimitRate({amt: sendAmt}))
                  .then((res) =>{
                  //console.log("Feed ", res)
                  if(res.payload.status === 403)
                  {
                    toast({
                      title: "Error!",
                      description: res.payload.message,
                      status: "warning",
                      duration: 5000,
                      isClosable: true,
                      position: "top",
                      });
                    setPayBtnLoader(false);
                    return false
                    }
                    if (gateWayRes.status === '404') 
                      {
                        setOnlinePayment(false)
                        setShowMessageButton('Payment gateway not available at the moment! Please, Use manual transfer')
                        setPayBtnLoader(false)
                      }
                  else if (gateWayRes.app_payStack_btn === false || gateWayRes.app_payStack_btn === 'false')
                    {
                      setOnlinePayment(false);
                      setShowMessageButton('Payment gateway not available at the moment! Please, Use manual transfer')
                      setPayBtnLoader(false)
                    }
                  else if (gateWayRes.app_payStack_btn === true || gateWayRes.app_payStack_btn === 'true')
                    {
                    setShowMessageButton('');
                    dispatch(resetPaymentGatewayState())
                    navigate('/user/checkout-paystack',{
                      state: {
                        reference: (new Date()).getTime().toString(),
                        email: user.userData.email,
                        amount: Number.parseInt(sendAmt) * 100, 
                        publicKey: PaystackDemoKey,
                        note: sendNote,
                        actualPayment: sendAmt,
                        serviceType:'Funding'
                      }
                      })
                    setPayBtnLoader(false);
                    }
                }).catch((error) => {
                  console.error('Unexpected error:', error);
                });
                  
                }, 1000); // 2-second delay
            };


          useEffect(() => {
              const timeId = setTimeout(() => {
            // After 3 seconds set the show value to false
            dispatch(getPaymentGateStatus()).then((responseData) =>{
                //console.log("Online Payment Status ", responseData.payload)
                setGetawayRes(responseData.payload)
                }).catch((error) => {
              console.error('Unexpected error:', error);
              });
            dispatch(resetPaymentGatewayState())
            }, 1000)
              return () => {
              clearTimeout(timeId)
              }
            }, []);    

              // validate form details
              const fundAccountForm = () =>
              {
                if(sendAmt ==='' || sendAmt === undefined)
                {
                  toast({
                    title: "error!",
                    description: "Please Enter Amount",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                  });
                  return false;
                }
                if (!/^\d+$/.test(sendAmt)) {
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
              
              // manual transfer function goes here
              const manualTransfer = () =>
              {

                const userData ={
                  tag_id: user.userData?.tag_id,
                  serviceName: 'Account Funding',
                  serviceCategory: 'Exchange',
                  method: 'Manually Checkout',
                  total_money: sendAmt,
                  amt: sendAmt,
                  note: sendNote
                }
              setBtnLoader(true)
              dispatch(paystackFundData({amt: sendAmt}))
              .then((resData) =>{
                //console.log('on Pay ', resData)
              if(resData.payload.status === 403)
                {
                toast({
                  title: "Error!",
                  description: resData.payload.message,
                  status: "warning",
                  duration: 5000,
                  isClosable: true,
                  position: "top",
                  });
              setBtnLoader(false);
                return false
                }
                
                  dispatch(paystackFundData(userData))
                  .then((successData) =>{
                    //console.log("After Payment Status ", successData.payload)
                    if(successData.payload.msg ==='200')
                    {
                      dispatch(resetPaymentGatewayState())
                      dispatch(resetPaystackState())
                      setSendNote('')
                      setSendAmt('')
                      setBtnLoader(false)
                      //console.log("manual transfer response ", successData.payload.feedback);
                      navigate("/user/manual-payment", {
                        state: {
                          payment: sendAmt,
                          track_id: successData.payload.feedback,
                          type: 'Funding',
                          serviceCategory: '',
                        }
                        })
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
              })
            }

    return (
      <Card {...rest} mb='20px' align='center' p='20px'>
        <Flex px="5px" mb="8px" justifyContent="space-between" align="center">
          <Text
          fontSize={{ sm: '14px', lg: '16px'}}
          py={1.5}
          color="gray.700">
          Account Funding
          </Text>
        </Flex>
      <Flex px="5px" mb="8px" justifyContent="space-between" align="center">
          <Text
          fontSize={{ sm: '14px', lg: '16px'}}
          py={1.5}
          color="gray.400"
          >
          Enter the amount you want to fund your account today! 
          </Text>
      </Flex>
       <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <HStack gap="10" width="full">
          <InputGroup flex="1">
          <InputLeftElement children='&#8358;' fontSize={'25px'} color={'gray.300'} />
            <Input placeholder="Amount (in Naira)" width={{base:'100%', lg:'400px', md:'400px'}}
            onChange={(e) => setSendAmt(e.target.value)}
            value={sendAmt}
            required="required" />
          </InputGroup>
        </HStack>
      </Flex>
      
        <Textarea placeholder="Reason/purpose (250 characters max optional)" h={100}
          onChange={(e) => setSendNote(e.target.value)}
          value={sendNote}
          required="required" />
        <Box>
            <Flex px="0px" align='center' mb={{ sm: "0px", md: "20px" }} direction='row' >
                  <SimpleGrid
                      columns={{ base: 1, md: 2, lg: 3, }}
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
                          onClick={() => fundAccountForm()}>
                          Fund Account
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
          <ModalHeader>Choose Funding Method</ModalHeader>
          <Text px={5} color={'gray.500'}
           fontSize={{ sm: '14px', lg: '16px'}}>It's faster to get your wallet funded, convenient and secured when you choose pay with Paystack directly.</Text>
          <ModalCloseButton onClick={onCloseRevocationModal}/>
          <ModalBody pb={6}>
            <FormControl mt={5}>
            <Box>
          <Flex px="25px" align='center' mb={{ sm: "0px", md: "20px" }} direction='row' >
                <SimpleGrid
                        row={{ base: 1, md: 1, lg: 1, "2xl": 3 }}
                        gap={{ md: '40px', lg: '40px', base: '40px' }}
                        mb='40px'
                        mt='5px'
                        width={{base: '100%', }}
                        >
                        <Button
                            bg='#5363CE'
                            color='white'
                            _hover={{ bg: "#1D2667" }}
                            _active={{ bg: "#1D2667" }}
                            _focus={{ bg: "#5363CE" }}
                            fontWeight='500'
                            fontSize='14px'
                            py='20px'
                            px='27'
                            me='38px'
                            width={{md: '100%', lg: '100%', base: '100%' }}
                            onClick={() =>handlePaystackButtonClick()}
                            disabled={payBtnLoader}>
                            {payBtnLoader ? <Text><Spinner animationDuration="0.8s" size="sm" /> Waiting</Text>
                          : 'Pay With Paystack' } 
                        </Button>
                        <Button
                            bg='#5363CE'
                            color='white'

                            _hover={{ bg: "#1D2667" }}
                            _active={{ bg: "#1D2667" }}
                            _focus={{ bg: "#5363CE" }}
                            fontWeight='500'
                            fontSize='14px'
                            py='20px'
                            px='27'
                            me='38px'
                            width={{md: '100%', lg: '100%', base: '100%' }}
                            disabled={btnLoader}
                            onClick={manualTransfer}>
                           {btnLoader ? <Text><Spinner _hover={btnLoader ? {color: "#FFF"} : {color:'#1D2667'}} animationDuration="0.8s" size="sm" /> Waiting</Text>
                           :'Manual Transfer'}
                        </Button>
                        {!onlinePayment && <Text color='#222' fontSize='20px'>{showMessageButton}</Text>
                          }

                    </SimpleGrid>
                </Flex>
            </Box>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
      </Card>
      
    );

    
  }

  
  