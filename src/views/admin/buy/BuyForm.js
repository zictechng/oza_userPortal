// Chakra imports
import React, {useState, useEffect} from "react";
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
    Spinner,
    useToast,
  } from "@chakra-ui/react";
  // Custom components
  import Card from "components/card/Card.js";
  import { useNavigate } from 'react-router-dom';
  import { useDispatch, useSelector } from 'react-redux';
  import { getPaymentGateStatus, resetPaymentGatewayState } from "storeMtg/checkPaymentGatewayStatusSlice";
  import { buyFundData, resetBuyState } from "storeMtg/fundBuySlice";
  import { getExchangeRate } from "storeMtg/exchangeRateSlice";

  
  // Assets
  
  export default function Upload(props) {
    const toast = useToast();
    const dispatch = useDispatch()
    const { used, total, ...rest } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const [gateWayRes, setGetawayRes] = useState('');
    const [onlinePayment, setOnlinePayment] = useState(false)
    const [payBtnLoader, setPayBtnLoader] = useState(false);
    const [showMessageButton, setShowMessageButton] = useState('');
    const [currentRate, setCurrentRate] = useState();
    const [sendPayment, setSendPayment] = useState('');

    const {user} = useSelector((state) => state.authUser)
    const {fundLoading} = useSelector((state) => state.buyFunds)

    const initialRef = React.useRef();
    const finalRef = React.useRef();

    // open modal state
    const {
      isOpen: isRevocationModalOpen,
      onOpen: onOpenRevocationModal,
      onClose: onCloseRevocationModal,
    } = useDisclosure();

    //console.log("sales Rate ", currentRate)

        const [detailsFormData, setDetailsFormData] = useState({
                buy_service:'',
                buy_amount: '',
                buy_note: '',
               });
    
        const handleDataChange = (e) => {
          const { name, value } = e.target;
          setDetailsFormData({
            ...detailsFormData,
            [name]: value,
          });
        };

        const processBuyRequest = () => {
          if(detailsFormData.buy_service === null || detailsFormData.buy_service === '')
          {
            toast({
              title: "Error!",
              description: "Select service type .",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
          }
          else if(detailsFormData.buy_amount === null || detailsFormData.buy_amount === '')
            {
              toast({
                title: "Error!",
                description: "Please, enter amount .",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
              });
              return false;
            }
            else if (!/^\d+$/.test(detailsFormData.buy_amount)) {
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
            
          else {
            onOpenRevocationModal()
          }
        }
    
        useEffect(() => {
          const timeId = setTimeout(() => {
            // After 3 seconds set the show value to false
            dispatch(getPaymentGateStatus()).then((responseData) =>{
              //console.log("Online Payment Status ", responseData.payload.app_payStack_btn)
              setGetawayRes(responseData.payload)
                if(responseData.payload.app_payStack_btn === true || responseData.payload.app_payStack_btn === 'true')
                {
                  setOnlinePayment(true);
                }
              }).catch((error) => {
                console.error('Unexpected error:', error);
            });
          dispatch(resetPaymentGatewayState())
            }, 1000)
              return () => {
              clearTimeout(timeId)
              }
            }, [dispatch]);

        useEffect(() => {
            const getCurrentRate = () => {
                dispatch(getExchangeRate()).then((successData) =>{
              //console.log("After Payment Status ", successData.payload)
              if(successData?.payload)
              {
                setCurrentRate(successData.payload)
                }
              }).catch((error) => {
                console.error('Unexpected error:', error);
              })
            }
        getCurrentRate()
        
       }, [dispatch, detailsFormData.buy_service])

      
      useEffect(() => {
        if (detailsFormData.buy_service ==='Payoneer') {
          const newTotal = (parseFloat(currentRate.payoneer_selling * detailsFormData.buy_amount))
          setSendPayment(newTotal )
          }
        else if (detailsFormData.buy_service ==='Paypal') {
          const newTotal = (parseFloat(currentRate.paypal_selling * detailsFormData.buy_amount))
          setSendPayment(newTotal )
          }
          else if (detailsFormData.buy_service ==='Bitcoin') {
            const newTotal = (parseFloat(currentRate.btc_selling * detailsFormData.buy_amount))
           setSendPayment(newTotal )
            }
          else {
            setSendPayment(0);
        }
      }, [detailsFormData.buy_amount, detailsFormData.buy_service]);
  
       
      // call paystack button here 
        const handlePaystackButtonClick = () => {
              setPayBtnLoader(true)
                setTimeout(() => { 
                    if(detailsFormData.buy_amount < 5)
                      {
                        toast({
                          title: "Error!",
                          description: 'Minimum of $5 accepted',
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
                        }
                    else if (gateWayRes.app_payStack_btn === false || gateWayRes.app_payStack_btn === 'false')
                      {
                        setOnlinePayment(false);
                        setShowMessageButton('Payment gateway not available at the moment! Please, Use manual transfer')
                      }
                    else if (gateWayRes.app_payStack_btn === true || gateWayRes.app_payStack_btn === 'true')
                      {
                      setOnlinePayment(true);
                      setShowMessageButton('');
                      dispatch(resetPaymentGatewayState())
                      navigate('/user/checkout-paystack',{
                        state: {
                          reference: (new Date()).getTime().toString(),
                          email: user.userData.email,
                          amount: Number.parseInt(sendPayment) * 100, 
                          note: detailsFormData.buy_note,
                          actualPayment: detailsFormData.buy_amount,
                          serviceType:'Buy',
                          serviceCategory: detailsFormData.buy_service
                        }
                        })
                      setPayBtnLoader(false);
                      }
                    }, 1000); // 2-second delay
                  };
      // manual transfer function goes here
            const manualTransfer = () =>
            {
              const userData ={
                tag_id: user.userData?.tag_id,
                serviceName: detailsFormData.buy_service,
                serviceCategory: `Exchange`,
                method: 'Manually Checkout',
                total_money: detailsFormData.buy_amount,
                buy_amt: detailsFormData.buy_amount,
                buy_note: detailsFormData.buy_note,
                serviceType:'Buy'
              }
              if(detailsFormData.buy_amount < 5)
                {
                  toast({
                    title: "Error!",
                    description: 'Minimum of $5 accepted',
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                    });
                  return false
                }
              dispatch(buyFundData(userData))
              .then((successData) =>{
                //console.log("After Payment Status ", successData.payload)
                if(successData.payload.msg ==='200')
                {
                  dispatch(resetPaymentGatewayState())
                  dispatch(resetBuyState())
                  setDetailsFormData({
                    buy_amount:'',
                    buy_service: '',
                    buy_note: '',
                    });
                  //console.log("manual transfer response ", successData.payload.feedback);
                  navigate("/user/manual-payment", {
                    state: {
                      payment: detailsFormData.buy_amount,
                      track_id: successData.payload.feedback,
                      type: 'Buy',
                      serviceCategory: detailsFormData.buy_service,
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
          }
    
  
    return (
      <Card {...rest} mb='20px' align='center' p='20px'>
        <Flex px="5px" mb="8px" justifyContent="space-between" align="center">
          <Text
          fontSize={{ sm: '14px', lg: '16px'}}
          py={1.5}
          color="gray.700"
          >
          What did you want to exchange today?
          </Text>
      </Flex>
      <Flex px="5px" mb="8px" justifyContent="space-between" align="center">
          <Text
          fontSize={{ sm: '14px', lg: '16px'}}
          py={1.5}
          color="gray.400"
          >
          Select product name and enter the amount you want to buy/exchange
          </Text>
      </Flex>

        {/* paypal */}
          {detailsFormData.buy_service ==='Paypal' &&
          <Flex px="100px" mb="8px" justifyContent="space-between" align="center">
              <Text
              fontSize={{ sm: '14px', lg: '16px'}}
              py={1.5}
              color="gray.400">
                <img src="../../assets/images/paypal1.png" alt="Logo" width={'40px'} height={'27px'}/>
              </Text>
              <Text
              fontSize={{ sm: '14px', lg: '16px'}}
              py={1.5}
              color="gray.400">
                <img src="../../assets/images/exchange.png" alt="Logo" width={'40px'} height={'27px'} />
              </Text>
              <Text
              fontSize={{ sm: '14px', lg: '16px'}}
              py={1.5}
              color="gray.400">
              <img src="../../assets/images/money_ex.png" alt="Logo" width={'40px'} height={'27px'} />
              </Text>
          </Flex>
          }
        {/* bitcoin */}
        {detailsFormData.buy_service ==='Bitcoin' &&
      <Flex px="100px" mb="8px" justifyContent="space-between" align="center">
          <Text
          fontSize={{ sm: '14px', lg: '16px'}}
          py={1.5}
          color="gray.400"
          >
            <img src="../../assets/images/bitcoin1_virtual.png" alt="Logo" width={'40px'} height={'27px'} />
          </Text>
          <Text
          fontSize={{ sm: '14px', lg: '16px'}}
          py={1.5}
          color="gray.400"
          >
            <img src="../../assets/images/exchange.png" alt="Logo" width={'40px'} height={'27px'} />
          </Text>
          <Text
          fontSize={{ sm: '14px', lg: '16px'}}
          py={1.5}
          color="gray.400"
          >
          <img src="../../assets/images/money_ex.png" alt="Logo" width={'40px'} height={'27px'}/>
          </Text>
      </Flex>
        }
        {/* payoneer */}
        {detailsFormData.buy_service ==='Payoneer' &&
      <Flex px="100px" mb="8px" justifyContent="space-between" align="center">
          <Text
          fontSize={{ sm: '14px', lg: '16px'}}
          py={1.5}
          color="gray.400"
          >
            <img src="../../assets/images/payooner.png" alt="Logo" width={'40px'} height={'27px'} />
          </Text>
          <Text
          fontSize={{ sm: '14px', lg: '16px'}}
          py={1.5}
          color="gray.400"
          >
            <img src="../../assets/images/exchange.png" alt="Logo" width={'40px'} height={'27px'} />
          </Text>
          <Text
          fontSize={{ sm: '14px', lg: '16px'}}
          py={1.5}
          color="gray.400"
          >
          <img src="../../assets/images/money_ex.png" alt="Logo" width={'40px'} height={'27px'} />
          </Text>
      </Flex>
        }
  
        <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <Select placeholder="Service Name" color={'gray.500'} width={{base:'100%', lg:'400px', md:'400px'}}
            value={detailsFormData.buy_service}
            name="buy_service"
            onChange={handleDataChange}>
          <option value="Bitcoin">Bitcoin</option>
          <option value="Paypal">Paypal</option>
          <option value="Payoneer">Payoneer</option>
          
       </Select>
       </Flex>
       <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <HStack gap="10" width="full">
          <InputGroup flex="1">
          <InputLeftElement children='&#36;' fontSize={'25px'} color={'gray.300'} />
            <Input placeholder="Amount" width={{base:'100%', lg:'400px', md:'400px'}}
                value={detailsFormData.buy_amount}
                name="buy_amount"
                onChange={handleDataChange} />
          </InputGroup>
        </HStack>
      </Flex>
      
        <Textarea placeholder="Reason/purpose (250 characters max optional)" h={100} 
            value={detailsFormData.buy_note}
            name="buy_note"
            onChange={handleDataChange}/>
        <Box>
            <Flex px="0px" align='center' mb={{ base: "0px", md: "20px" }} direction='column' >
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
                      onClick={()=> processBuyRequest() }>
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
                <ModalHeader>Choose Payment Method</ModalHeader>
                <Text px={5} color={'gray.500'}
                 fontSize={{ sm: '14px', lg: '16px'}}>It's faster to get your transaction approved, convenient and secured when you choose Paystack directly.</Text>
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
                            {onlinePayment ?
                              <Button
                              bg='#5363CE'
                              color='white'
                              _hover={{ bg: "#5464c4" }}
                              _active={{ bg: "#5464c4" }}
                              _focus={{ bg: "#5363CE" }}
                              fontWeight='500'
                              fontSize='14px'
                              py='20px'
                              px='27'
                              me='38px' 
                              width={{ md: '100%', lg: '100%', base: '100%' }}
                              onClick={()=> handlePaystackButtonClick()}
                              disabled={payBtnLoader}>
                                {payBtnLoader ? <Text><Spinner _hover={payBtnLoader ? {color: "#FFF"} : {color:'#5464c4'}} animationDuration="0.8s" size="sm" /> Wait</Text>
                                :'Pay With Paystack'}
                              </Button>
                              :''
                              }
                             
                              <Button
                                  bg='#5363CE'
                                  color='white'
                                  _hover={{ bg: "#5464c4" }}
                                  _active={{ bg: "#5464c4" }}
                                  _focus={{ bg: "#5363CE" }}
                                  fontWeight='500'
                                  fontSize='14px'
                                  py='20px'
                                  px='27'
                                  me='38px'
                                  width={{md: '100%', lg: '100%', base: '100%' }}
                                  onClick={()=> manualTransfer()}>
                                  
                                  {fundLoading ? <Text><Spinner _hover={fundLoading ? {color: "#FFF"} : {color:'#5464c4'}} animationDuration="0.8s" size="sm" /> Wait</Text>
                                :'Manual Transfer'}
                              </Button>
                                {!onlinePayment &&
                                <Text color='#222' fontSize='20px'>Payment gateway not available at the moment! Please, consider using manual transfer.</Text>
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
  