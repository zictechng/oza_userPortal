import React, {useState, useEffect, useRef} from "react";

// Chakra imports
import {
  Box,
  Flex,
  Grid,
  Heading, 
  Text,
  useToast,
  Spinner,
  Button,
  VStack
} from "@chakra-ui/react";

// Custom components
import Card from "components/card/Card.js";
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PaystackButton } from 'react-paystack'
import { paystackFundData , resetPaystackState} from "storeMtg/fundAccountPaysackSlice";
import { getPaymentGateStatus, resetPaymentGatewayState } from "storeMtg/checkPaymentGatewayStatusSlice";
import { buyFundData, resetBuyState } from "storeMtg/fundBuySlice";
// Assets
export default function CheckoutPaystack() {
  // Chakra Color Mode
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const toast = useToast();
  const {user} = useSelector((state) => state.authUser)
  const { reference, email, amount, note, actualPayment, serviceType, serviceCategory } = location.state || {};

  const PaystackDemoKey = process.env.REACT_APP_PAYSTACK_DEMO_KEY;
  const paystackButtonRef = useRef(null);
  const autoPaystackButtonRef = useRef(null);
  const [btnLoader, setBtnLoader] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [isPaymentTriggered, setIsPaymentTriggered] = useState(false);
  

      // close paystack payment modal here
      const handlePaystackClose = () => {
        console.log('closed')
        toast({
          title: "error!",
          description: "Transaction has been cancelled",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setBtnLoader(false)
        setIsPaymentTriggered(false)
        setPageLoader(false)
      return false;
      }

        useEffect(() => {
          setPageLoader(true);
          setTimeout(() => {
            if (!isPaymentTriggered) {
              callPaystack(); // Try automatic payment
            }
          }, 1000);
        }, []);
        
        const handlePaystackClick = () => {
          setBtnLoader(true); 
          paystackButtonRef.current.querySelector("button").click();
        };

        const callPaystack = () => {
          
          if (autoPaystackButtonRef.current) {
            const paystackBtn = autoPaystackButtonRef.current.querySelector("button");
            if (paystackBtn) {
              paystackBtn.click();
              setIsPaymentTriggered(true);
            }
          }
        };

          const config = {
            reference: reference,
            email: email,
            amount: amount, 
            publicKey: PaystackDemoKey,
          };

        const componentProps = {
          ...config,
          text: 'Pay Now',
            onSuccess: (reference) => handlePaystackSuccess(reference),
            onClose: handlePaystackClose,
          };

        const handlePaystackSuccess = (reference) => {
            //console.log("Pay Success", reference);
            setBtnLoader(false);
                  if(serviceType ==='Funding')
                  {
                    const userData ={
                      tag_id: user.userData?.tag_id,
                      serviceName: 'Account Funding',
                      serviceCategory: 'Exchange',
                      method: 'Paystack Checkout',
                      total_money: actualPayment,
                      payId: reference.reference,
                      amt: actualPayment,
                      note: note
                    };
                    //navigate('/user/success')
                      dispatch(paystackFundData(userData))
                      .then((successData) =>{
                        if(successData.payload.msg ==='200')
                            {
                              // toast({
                              //   title: "Success!",
                              //   description: "Transaction was successful.",
                              //   status: "success",
                              //   duration: 5000,
                              //   isClosable: true,
                              //   position: "top",
                              // });
                              dispatch(resetPaymentGatewayState())
                              dispatch(resetPaystackState())
                              setPageLoader(false);
                             navigate('/user/success')
                            }
                          else if (successData.payload.status ==='401')
                              {
                                toast({
                                  title: "Error!",
                                  description: "Failed to authenticate.",
                                  status: "warning",
                                  duration: 5000,
                                  isClosable: true,
                                  position: "top",
                                });
                                dispatch(resetPaymentGatewayState())
                                dispatch(resetPaystackState())
                                dispatch(resetPaymentGatewayState())
                              }
                            else if (successData.payload.status === 403)
                                {
                                  toast({
                                    title: "Error! Payment Failed",
                                    description: successData.payload.message,
                                    status: "warning",
                                    duration: 5000,
                                    isClosable: true,
                                    position: "top",
                                  });
                                  dispatch(resetPaymentGatewayState())
                                  dispatch(resetPaystackState())
                                  dispatch(resetPaymentGatewayState())
                                  return
                                }
                              else if (successData.payload.status ==='500')
                                {
                                toast({
                                  title: "Error!",
                                  description: successData.payload.message,
                                  status: "warning",
                                  duration: 5000,
                                  isClosable: true,
                                  position: "top",
                                });
                                dispatch(resetPaymentGatewayState())
                                dispatch(resetPaystackState())
                                dispatch(resetPaymentGatewayState())
                                }
                              }).catch((error) => {
                                console.error('Unexpected error:', error);
                                setPageLoader(false);
                                setBtnLoader(false);
                            });
                        }

                    else if (serviceType ==='Buy')
                        {
                        const userData ={
                          tag_id: user.userData?.tag_id,
                          serviceName: serviceCategory,
                          serviceCategory: `Exchange`,
                          method: 'Paystack Checkout',
                          total_money: actualPayment,
                          buy_amt: actualPayment,
                          payId: reference.reference,
                          buy_note: note,
                          serviceType:'Buy'
                        };
                        dispatch(buyFundData(userData))
                        .then((successData) =>{
                          //console.log("After Payment Status ", successData.payload)
                          if(successData.payload.msg ==='200')
                          {
                            dispatch(resetPaymentGatewayState())
                            dispatch(resetBuyState())
                            navigate("/user/success")
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
                    else{
                      toast({
                        title: "Error!",
                        description: 'Transaction not recognized',
                        status: "warning",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                      });
                      navigate('/user')
                    }
                  }

  return (
    <Box pt={{ base: "80px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        mb='20px'
        gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}>
        <Flex
          flexDirection='column'
          >
          
          <Flex direction='column'>
          <Box p={5} shadow='md' borderWidth='1px' mb={10} ml={2} mr={2} bg='white' borderRadius='15'>
            <Heading fontSize='xl' color={'#aaa'}>{'Paystack Checkout'}</Heading>
            <Text mt={4} fontSize='18px'>Please wait as Paystack authorized your transaction and do not close this window. <br/>
            If the payment page didn't display please, click the button continue with Paystack and re-try</Text>
            </Box>
          </Flex>

          <Flex alignItems="center" justifyContent='center' mb='20px'>
             <Card px='0px' mb='20px'>
                
                <Box position="relative" mt="20px">
                  {pageLoader && (
                    <Flex
                      position="absolute"
                      top={5}
                      left={0}
                      width="100%"
                      height="100%"
                      bg="rgba(255, 255, 255, 0.8)"
                      justify="center"
                      align="center"
                      zIndex={10}>
                        
                      <VStack spacing={3}> {/* Stack for vertical alignment */}
                        <Spinner size="lg" />
                        <Text mb={8}>Waiting...</Text>
                      </VStack>
                    </Flex>
                  )}
                </Box>
                
            <Flex direction={{ base: "column", "2xl": "row" }} alignItems="center" justifyContent='center' mr={{ base: "column", lg: "400px" }} mb='20px'>
                  {!isPaymentTriggered && !pageLoader &&
                  <Box
                    as="button"
                    bg="transparent"
                    color="#000"
                    fontWeight="500"
                    fontSize="14px"
                    py="10px"
                    px="27px"
                    me="38px"
                    borderRadius="15px"
                    borderColor="#5464c4"
                    borderWidth="2px" /* Adjusted for a more subtle border */
                    transition="background-color 0.3s"
                    _hover={{ bg: "#5464c4", color: "#FFFFFF"}}
                    _active={{ bg: "#5464c4" }}
                    _focus={{ bg: "#5363CE", outline: "none" }} /* Corrected outline styling */
                    width={{ md: "40%", lg: "40%", base: "80%", sm:'80%', '': '80%' }}
                    disabled={btnLoader} // Disable button when loading
                    onClick={handlePaystackClick}>
                    {btnLoader ? <Text><Spinner _hover={btnLoader ? {color: "#FFF"} : {color:'#5464c4'}} animationDuration="0.8s" size="sm" /> Waiting</Text>
                    : 'Continue with Paystack' } 
                    
                    {/* Hidden PaystackButton */}
                      <Box ref={paystackButtonRef} style={{ display: "none" }}>
                        <PaystackButton {...componentProps} />
                      </Box>
                </Box>
                }     
                <Box ref={autoPaystackButtonRef} style={{ display: "none" }}>
                    <PaystackButton {...componentProps} />
                </Box>
                             
              </Flex> 
          </Card>
          </Flex>
        </Flex>

        <Flex
          flexDirection='column'
          gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}>
        </Flex>
      </Grid>
      {/* Delete Product */}
      
    </Box>
  );
}
