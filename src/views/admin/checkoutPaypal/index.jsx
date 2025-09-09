import React, {useState, useEffect} from "react";

// Chakra imports
import {
  Box,
  Flex,
  Grid,
  Heading, 
  Text,
  useToast,
} from "@chakra-ui/react";

// Custom components
import Card from "components/card/Card.js";
import { PayPalButton } from "react-paypal-button-v2";
import { useNavigate, useLocation } from "react-router-dom";
import { capturePaypalPayment } from "storeMtg/paypalCheckoutSlice";
import { useSelector, useDispatch } from "react-redux";
import { DollarValueFormat } from "components/DollarFormat";
import { NairaValueFormat } from "components/NairaFormat";

// Assets
export default function CheckoutPaypal() {
  const location = useLocation();
  const toast = useToast();
  // Chakra Color Mode
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const PaypalDemoKey = process.env.REACT_APP_PAYPAL_DEMO_KEY;
  const dataInfo = location.state || {};
  const { paymentData = {}, approvalUrl, success, error } = useSelector((state) => state.paypalPayment);
  const {user} = useSelector((state) => state.authUser)

      useEffect(() => {
      
      }, [approvalUrl]);

    // Handle success response
    const handlePaymentSuccess = (details, data) => {
      console.log("Payment details ", details, data);
      setPaymentCompleted(true);
      
      const captureData = {
        payerId: data.payerID, 
        orderID: data.orderID,  // ✅ Use orderID instead of paymentID
        amount: paymentData.amount || details.purchase_units?.[0]?.amount?.value,
        'serviceName':dataInfo.serviceName,
        'serviceCategory':'Exchange',
        'sell_note':dataInfo.sell_note,
        'method': dataInfo.method,
        'myId': user.userData._id,
        'total_money': dataInfo.total_money,
        'serviceType':dataInfo.serviceType,
      };
        dispatch(capturePaypalPayment(captureData)).then((res) => {
          if (res.payload.msg ==='201') {
            setPaymentCompleted(true);
            console.log("Payment Captured Successfully", res.payload);
            toast({
              title: "Congratulations",
              description: 'Your transaction was successfully done! ',
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "top",
              });
          navigate('/user/success')
          }
        })
        .catch((error) => {
          console.error("Error capturing payment:", error);
        });
    };
  
    // Handle error response
    const handlePaymentError = (error) => {
      console.error("Payment error", error);
    };
  return (
    <Box pt={{ base: "80px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        mb='20px'
        gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}>
        <Flex
          flexDirection='column'>
          
          <Flex direction='column'>
          <Box p={5} shadow='md' borderWidth='1px' mb={10} ml={2} mr={2} bg='white' borderRadius='15'>
            <Heading fontSize='xl' color={'#aaa'}>{'Paypal Checkout'}</Heading>
              <Text mt={4} fontSize="18px" fontWeight={900}>
                {`Processing payment for ${dataInfo.email || "user"}`}
              </Text>
            <Text mt={4} fontSize='18px'>Please continue with Paypal to authorized your transaction and do not close the window while processing your transaction. </Text>
            </Box>
          </Flex>

          <Flex
            direction="column"
            align="center"
            justify="center"
            minHeight="20vh" // Make sure the content is centered vertically
            padding="20px" >
      <Card p="20px" shadow="md" borderWidth="1px" width="100%" maxWidth={{base: '100%', lg:"700px"}} borderRadius="15" bg="white">
          
          <Flex
            fontSize={{ base: "20px", md: "18px" }} // Adjusts font size for responsiveness
            color="#aaa"
            direction="row"
            alignItems="center"
            flexWrap="wrap"
          >
            <Heading color="inherit" fontSize='xl'>
              Send Amount{' '}
            </Heading>
            <Text fontSize='30px' ml='10px' fontWeight={700}>
            {dataInfo.serviceType === 'Funding' ? (
              <NairaValueFormat value={dataInfo.amt} />
            ) : (
              <DollarValueFormat value={dataInfo.amt} />
            )}
            </Text>
            
        </Flex>
        <Text textAlign="center" mb={4}>
          Paying with Paypal is safe, fast and secure! <br/>Please click on the PayPal button below, enter your login detail and complete the transaction. 
        </Text>
        
        {/* Flex container to center the PayPal button */}
        <Flex justify="center" align="center">
          <Box px={5} width="100%">
            {!paymentCompleted ? (
              <PayPalButton
                amount={dataInfo.amount} // Amount you want to charge
                currency="USD"
                onSuccess={handlePaymentSuccess} // Success handler
                onError={handlePaymentError} // Error handler
                options={{
                  clientId: PaypalDemoKey, // Replace with your actual PayPal client ID
                }}
              />
              
            ) : (
              <Text fontSize="18px" color="red.500" textAlign="center">
                Something went wrong processing your payment or payment already processed! If your account was debited, please contact support.
              </Text>
            )}
           
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
