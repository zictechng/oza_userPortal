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
import { useNavigate , useSearchParams,} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sellFundData, resetSaleState } from "storeMtg/fundSaleSlice";
import { resetPaymentGatewayState } from "storeMtg/checkPaymentGatewayStatusSlice";
import { getPaymentGateStatus } from "storeMtg/checkPaymentGatewayStatusSlice";
import { getExchangeRate } from "storeMtg/exchangeRateSlice";
import { getPaypalPayment } from "storeMtg/paypalCheckoutSlice";
import { capturePaypalPayment } from "storeMtg/paypalCheckoutSlice";

  // Assets
  
  export default function SalesForm(props) {
    const { used, total, ...rest } = props;
    const toast = useToast();
    const dispatch = useDispatch()

    const [searchParams] = useSearchParams();
    const status = searchParams.get("status");
    const paymentToken = searchParams.get("token");
    const payerId = searchParams.get("PayerID"); // Extract payerId from URL
    const paymentId = searchParams.get("paymentId"); 

    const {user} = useSelector((state) => state.authUser)
    const {fundLoading} = useSelector((state) => state.sellFunds)
    const {isLoading, error, success} = useSelector((state) => state.paypalPayment)

    const [onlinePayment, setOnlinePayment] = useState(false)
    const [gateWayRes, setGetawayRes] = useState('');
    const [payBtnLoader, setPayBtnLoader] = useState(false);
    const [showMessageButton, setShowMessageButton] = useState('');
    const [currentRate, setCurrentRate] = useState();
    const [sendPayment, setSendPayment] = useState('');
    const [btnPaypal, setBtnPaypal] = useState(true);

    const [message, setMessage] = useState('');
    const [resultError , setResultError] = useState('');
    const [loading, setLoading] = useState(true);

    const {onClose } = useDisclosure();
    const navigate = useNavigate();

    const initialRef = React.useRef();
    const finalRef = React.useRef();

    // open modal state
      const {
        isOpen: isRevocationModalOpen,
        onOpen: onOpenRevocationModal,
        onClose: onCloseRevocationModal,
      } = useDisclosure();
      
      const closeModal =() => {
        onCloseRevocationModal();
        setBtnPaypal(true);
        
      }

       const [detailsFormData, setDetailsFormData] = useState({
                sell_service:'',
                sell_amount: '',
                sell_note: '',
                });
          
        const handleDataChange = (e) => {
          const { name, value } = e.target;
          setDetailsFormData({
            ...detailsFormData,
            [name]: value,
          });
        };

        // get paypal button status here
        useEffect(() => {
          const timeId = setTimeout(() => {
            // After 3 seconds set the show value to false
            dispatch(getPaymentGateStatus()).then((responseData) =>{
              //console.log("Online Payment Status ", responseData.payload.app_paypal_bnt)
              setGetawayRes(responseData.payload)
                if(responseData.payload.app_paypal_bnt === true || responseData.payload.app_paypal_bnt === 'true')
                {
                  setOnlinePayment(true);
                }
                else{
                  setOnlinePayment(false);
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
        
        // get exchange rate here
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
              
      }, [dispatch, detailsFormData.sell_service])
      
        // get total price using current rate with amount user want to sell/exchange
        useEffect(() => {
          if (detailsFormData.sell_service ==='Payoneer') {
            const newTotal = (parseFloat(currentRate.payoneer_buying * detailsFormData.sell_amount))
            setSendPayment(newTotal)
            setBtnPaypal(false)
            }
          else if (detailsFormData.sell_service ==='Paypal') {
            const newTotal = (parseFloat(currentRate.paypal_buying * detailsFormData.sell_amount))
            setSendPayment(newTotal)
            setBtnPaypal(true)

            }
            else if (detailsFormData.sell_service ==='Bitcoin') {
              const newTotal = (parseFloat(currentRate.btc_buying * detailsFormData.sell_amount))
              setSendPayment(newTotal)
              setBtnPaypal(false)
              }
            else {
              setSendPayment(0);
          }
        }, [detailsFormData.sell_amount, detailsFormData.sell_service]);

        const processBuyRequest = () => {
          if(detailsFormData.sell_service === null || detailsFormData.sell_service === '')
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
        else if(detailsFormData.sell_amount === null || detailsFormData.sell_amount === '')
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
        else if (!/^\d+$/.test(detailsFormData.sell_amount)) 
            {
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

          
      // process paypal check here
      const payPalCheckout = () =>{

        const paymentData = {
              amount: detailsFormData.sell_amount, 
              currency: "USD",
              tag_id: user.userData.tag_id,
              amt: detailsFormData.sell_amount,
              sell_note: detailsFormData.sell_note,
              serviceName: detailsFormData.sell_service,
              serviceCategory: 'Exchange',
              method: 'Paypal Checkout',
              total_money: sendPayment,
              "serviceType": detailsFormData.sell_service
              };
            setPayBtnLoader(true)

            setTimeout(() => { 
              if(detailsFormData.sell_amount < 5)
                  {
                  toast({
                    title: "Error!",
                    description: 'Minimum of $5 accepted',
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                    });
                  setPayBtnLoader(false)
                  }
                if (gateWayRes.status === '404') 
                    {
                      setOnlinePayment(false)
                      setShowMessageButton('Payment gateway not available at the moment! Please, consider manual transfer')
                      setPayBtnLoader(false)
                    }
                else if (gateWayRes.app_paypal_bnt === false || gateWayRes.app_paypal_bnt === 'false')
                  {
                    setOnlinePayment(false);
                    setShowMessageButton('Payment gateway not available at the moment! Please, consider manual transfer')
                    setPayBtnLoader(false)
                  }
                else if (gateWayRes.app_paypal_bnt === true || gateWayRes.app_paypal_bnt === 'true')
                  {
                    setOnlinePayment(true);
                    setShowMessageButton('');

                    dispatch(getPaypalPayment(paymentData))
                    .then((res) =>{
                      //console.log('any issue ', res.payload);
                      if(!res.payload.approvalUrl)
                      {
                       // console.log('Not success ', res.payload)
                        toast({
                          title: "Error!",
                          description: res.payload,
                          status: "warning",
                          duration: 5000,
                          isClosable: true,
                          position: "top",
                          });
                        return false
                      }
                  else if(res.payload.approvalUrl)
                    {
                 // window.location.href = res.payload.approvalUrl;
                    navigate("/user/checkout-paypal",
                    {
                    state: {
                      email: user.userData.email,
                      amount: detailsFormData.sell_amount, 
                      amt: detailsFormData.sell_amount, 
                      sell_note: detailsFormData.sell_note,
                      serviceCategory: 'Exchange',
                      method: 'Paypal Checkout',
                      total_money: sendPayment,
                      "serviceType": 'Sales',
                      approvalUrl: res.payload.approvalUrl,
                      serviceName: detailsFormData.sell_service,
                      }
                    })
                    setPayBtnLoader(false)
                      return false
                    }
                    else{
                        console.log("general ", res.payload)
                      }
                    })
                    .catch((error) => {
                      console.error('Unexpected error:', error);
                    });
                  }
            }, 1000)
        
        }
        
      // manual transfer function goes here
          const manualTransfer = () =>
          {
            const userData ={
              tag_id: user.userData?.tag_id,
              serviceName: detailsFormData.sell_service,
              serviceCategory: `Exchange`,
              method: 'Manually Checkout',
              total_money: detailsFormData.sell_amount,
              sell_amt: detailsFormData.sell_amount,
              sell_note: detailsFormData.sell_note,
              serviceType:'Sales',
              }
            if(detailsFormData.sell_amount < 5)
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
            dispatch(sellFundData(userData))
            .then((successData) =>{
              //console.log("After Payment Status ", successData.payload)
              if(successData.payload.msg ==='200')
              {
                dispatch(resetPaymentGatewayState())
                dispatch(resetSaleState())
                setDetailsFormData({
                  sell_amount:'',
                  sell_service: '',
                  sell_note: '',
                  });
                //console.log("manual transfer response ", successData.payload.feedback);
                navigate("/user/manual-payment", {
                  state: {
                    payment: detailsFormData.sell_amount,
                    track_id: successData.payload.feedback,
                    type: 'Sales',
                    serviceCategory: detailsFormData.sell_service,
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
          color="gray.400">
          Select product name and enter the amount you want to sell/exchange
          </Text>
      </Flex>

              {/* paypal */}
                 {detailsFormData.sell_service ==='Paypal' &&
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
               {detailsFormData.sell_service ==='Bitcoin' &&
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
               {/* Payoneer */}
               {detailsFormData.sell_service ==='Payoneer' &&
             <Flex px="100px" mb="8px" justifyContent="space-between" align="center">
                 <Text
                 fontSize={{ sm: '14px', lg: '16px'}}
                 py={1.5}
                 color="gray.400"
                 >
                   <img src="../../assets/images/Payooner.png" alt="Logo" width={'40px'} height={'27px'} />
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
            value={detailsFormData.sell_service}
            name="sell_service"
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
            value={detailsFormData.sell_amount}
            name="sell_amount"
            onChange={handleDataChange}/>
          </InputGroup>
        </HStack>
      </Flex>
      
        <Textarea placeholder="Reason/purpose (250 characters max optional)" h={100} 
            value={detailsFormData.sell_note}
            name="sell_note"
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
                      width={{ md: '200px', lg: '200px', sm: '100%' }}
                      onClick={()=>processBuyRequest()}>
                      Submit
                      </Button>
                  </SimpleGrid>
            </Flex>
          </Box>

        <div>
          
          {resultError && <p>{resultError}</p>}
          {message && <p>{message}</p>}
        </div>
          
          
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isRevocationModalOpen}
        onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose Method</ModalHeader>
          {btnPaypal ?
          <Text px={5} color={'gray.500'} fontSize={{ sm: '14px', lg: '16px'}}>
            It's faster to get paid, convenient and secured when you choose Paypal directly.
          </Text>
            :<Text px={5} color={'gray.500'} fontSize={{ sm: '14px', lg: '16px'}}>
            Continue with manual transfer it convenient, it's free and your account get credited immediately when transaction is completed.
          </Text>
          }
          {btnPaypal ?
            <Text px={5} color={'red'} align='center' fontSize={{ sm: '14px', lg: '15px', }} mt={3}>
              Note: Charges may applied by Paypal.
            </Text>
            : <Text px={5} color={'red'} align='center' fontSize={{ sm: '14px', lg: '15px', }} mt={3}>
              No: extra charges applied.
            </Text>
          }

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
                {btnPaypal &&
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
                  width={{ md: '100%', lg: '100%', base: '100%' }}
                  onClick={()=> payPalCheckout()}
                  disabled={payBtnLoader}>
                   {payBtnLoader ? <Text><Spinner _hover={payBtnLoader ? {color: "#FFF"} : {color:'#1D2667'}} animationDuration="0.8s" size="sm" /> Waiting</Text>
                    :'Pay With Paypal'}
                  </Button>
                }
                  
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
                      onClick={()=>manualTransfer()}
                      disabled={fundLoading}>
                      {fundLoading ? <Text><Spinner _hover={fundLoading ? {color: "#FFF"} : {color:'#1D2667'}} animationDuration="0.8s" size="sm" /> Waiting</Text>
                    :'Manual Transfer'}
                  </Button>
                    {!onlinePayment &&
                    <Text color='#222' fontSize='20px'>{showMessageButton}</Text>
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
  