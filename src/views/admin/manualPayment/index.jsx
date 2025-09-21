import React , {useState, useEffect} from "react";

// Chakra imports
import {
  Box,
  Flex,
  Grid,
  Button,
  Heading, 
  Text,
  AccordionItem,
  AccordionIcon,
  AccordionPanel,
  Accordion,
  AccordionButton,
  useColorModeValue,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useClipboard 
} from "@chakra-ui/react";

// Custom components
import Card from "components/card/Card.js";
import PaymentSection from "views/admin/manualPayment/PaymentSection"
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getExchangeRate } from "storeMtg/exchangeRateSlice";
import { getCompanyBankInfo } from "storeMtg/getCompanyBankInfoSlice";
import { DollarValueFormat } from "components/DollarFormat";
import { NairaValueFormat } from "components/NairaFormat";
import { CopyIcon } from "@chakra-ui/icons";

// Assets
export default function ManualPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const dispatch = useDispatch()
  const { payment, track_id, type, serviceCategory } = location.state || {};

  const [currentRate, setCurrentRate] = useState();
  const [saleRate, setSaleRate] = useState();
  const [buyRate, setBuyRate] = useState();
  const [companyBank, setCompanyBank] = useState({});
  const {user} = useSelector((state) => state.authUser)
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const [value, setValue] = React.useState("");
  const [fidelityValue, setFidelityValue] = React.useState("");
  const { onCopy, hasCopied } = useClipboard(value);

  const [paypalValue, setPaypalValue] = React.useState("");
  const [payoneerValue, setPayoneerValue] = React.useState("");
  const [bitcoinValue, setBitcoinValue] = React.useState("");

  const { onCopy: fidelityCopy, hasCopied: fidelityCopied } = useClipboard(fidelityValue);
  const { onCopy: copyPaypal, hasCopied: paypalCopied } = useClipboard(paypalValue);
  const { onCopy: copyPayoneer, hasCopied: payoneerCopied } = useClipboard(payoneerValue);
  const { onCopy: copyBitcoin, hasCopied: bitcoinCopied } = useClipboard(bitcoinValue);

      //console.log("data: ", companyBank)

   useEffect(() => {

          const getCompanyBank = () =>{
            dispatch(getCompanyBankInfo()).then((resData) =>{
              //console.log("After Payment Status ", resData.payload)
              if(resData.payload.msg ==='200')
              {
                const userDetails = resData.payload.bankData; 
                setCompanyBank(userDetails)
              }
              }).catch((error) => {
                console.error('Unexpected error:', error);
              })
          }
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
      getCompanyBank();
    // appDetails()
    }, [dispatch])

  useEffect(() => {

    if(serviceCategory  === 'Payoneer')
      {
        const sell_rate = (payment * currentRate?.payoneer_selling)
        const buy_rate = (payment * currentRate?.payoneer_buying)
        setBuyRate(buy_rate)
        setSaleRate(sell_rate)
      }
      else if(serviceCategory === 'Paypal')
      {
        const sell_rate = (payment * currentRate?.paypal_selling)
        const buy_rate = (payment * currentRate?.paypal_buying)
        setSaleRate(sell_rate)
        setBuyRate(buy_rate)
      }
      else if(serviceCategory === 'Bitcoin')
      {
        const sell_rate = (payment * currentRate?.btc_selling)
        const buy_rate = (payment * currentRate?.btc_buying)
        setSaleRate(sell_rate)
        setBuyRate(buy_rate)
      }
      else{
        
      }
      // Zenith Bank Details
      setValue(`
        Bank Name: ${companyBank?.company_bank1 } \n
        Account Name: ${companyBank?.company_acct_name1 } \n
        Account Number: ${companyBank?.company_acct_number1 } \n
        Use the following details for payment! For more information, contact support@ozaapp.com
        `)

        // Fidelity Bank Details
        setFidelityValue(`
        Bank Name: ${companyBank?.company_bank2 } \n
        Account Name: ${companyBank?.company_acct_name2 } \n
        Account Number: ${companyBank?.company_acct_number2 } \n
        Use the following details for payment! For more information, contact support@ozaapp.com
        `)

        // Copy Paypal Details
        setPaypalValue(`
          Paypal Address: ${companyBank?.company_paypal_address } \n
          Use the following details for payment! For more information please, contact support@ozaapp.com
          `)

          // Copy Payoneer Details
        setPayoneerValue(`
          Payoneer Address: ${companyBank?.company_payoneer_address } \n
           Use the following details for payment! For more information please, contact support@ozaapp.com
          `)

          // Copy Bitcoin Details
        setBitcoinValue(`
          Bitcoin Address: ${companyBank?.company_btc_address } \n
          Use the following details for payment! For more information please, contact support@ozaapp.com
          `)
   
  }, [currentRate?.btc_selling, currentRate?.paypal_selling, currentRate?.payoneer_selling, payment, serviceCategory])

  
// Fidelity Bank Details
  // set user share ID for copying here
   // console.log('buy rate', currentRate)

  // Chakra Color Mode
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
          <Box p={5} shadow='md' borderWidth='1px' mb={10} ml={2} mr={2} borderRadius={15}>
            <Heading fontSize='xl'>{'Payment Pending'}</Heading>
            <Text mt={4} fontSize='16px'>Your request to {type ==='Funding'? 'fund your account': 'exchange'} <b>{type !=='Funding' && serviceCategory}</b> is currently pending! Once payment is received, your account will be credited immediately.</Text>
            </Box>
          </Flex>

          <Flex direction='column'>
             <Card px='0px' mb='20px'>
            <PaymentSection data={track_id}
            companyName={user.appData.app_name}/>
          </Card>
          </Flex>
        </Flex>

        <Flex direction='column'>
             <Card px='0px' mb='20px'>
             <Flex
                direction="column"
                w="100%"
                overflowX={{ lg: 'hidden' }} >
            <Flex
                align={{ sm: 'flex-start', lg: 'center' }}
                justify="space-between"
                w="100%"
                px="22px"
                pb="20px"
                mb="10px"
                boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)"
            >
                <Text color={'#aaa'} fontSize="xl" fontWeight="600">
                    {type ==='Funding'? 'Amount Funding ':'Amount Exchanging'}
                </Text>
                {/* <Button variant="action">See all</Button> */}
            </Flex>
            <Box ml={5}>
                <Flex direction={{ base: "column", "2xl": "row" }} mb={5} justifyContent='space-between' mr={5}>
                  <Text mt={4} fontSize={type ==='Funding'? { base: "25px", lg:'20px' } : { base: "40px", lg:'35px' }} fontWeight='300'>{type ==='Funding'? 'In Naira' : (<DollarValueFormat value={payment}/>)}</Text>
                  <Flex mt={4} fontSize={{ base: "40px", lg: '30px' }} fontWeight='300' alignItems="baseline">
                  <Text mr={2}> Due</Text>{type === 'Funding' ? <NairaValueFormat value={payment} /> : type==='Sales'? <NairaValueFormat value={buyRate} /> : <NairaValueFormat value={saleRate} /> } </Flex>
            
                </Flex>
            </Box>
      {/* <Stack isInline>
        <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
        <Avatar name="Kola Tioluwani" src="https://bit.ly/tioluwani-kolawole" />
        <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
        <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
        <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
        <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
        <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
    </Stack> */}
    
        </Flex>
          </Card>
        </Flex>
        
        <Flex
          flexDirection='column'
          gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}>
        </Flex>
      </Grid>
      {/* Delete Product */}
      <Box width={{ base: "100%", lg: "68%" }}>
        <Accordion allowToggle>
                    <AccordionItem>
                        <AccordionButton _expanded={{ bg: "#5464c4", color: "white" }}>
                        <Box flex="1" textAlign="left" fontSize={{ base: "25px", lg: "22px" }}>
                            View Company Payment Details
                        </Box>
                        <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel>
                        <Box mt="20px" backgroundColor='#FFF' width={{ base: "100%", lg: "60%", md:'60%' }}>
                          {/* Pagination overlay loader */}
                          <Table variant="simple" color="gray.100" mt="12px">
                            <Tbody>
                              {(type ==='Funding' || type==='Buy') && type !=='Sales' ?
                              <p>
                              <Td width="100%">
                                  <Flex justifyContent="space-between" alignItems="center">
                                    <Text fontSize="20px" color="#222" fontWeight="bold">
                                      {companyBank.company_bank1}
                                    </Text>
                                    <Text fontSize="20px" color="#222" fontWeight="bold"
                                      onClick={onCopy} cursor='pointer'>
                                      {hasCopied ? "Copied" : <CopyIcon />}
                                    </Text>
                                  </Flex>
                                </Td>
                                <Tr>
                                <Th borderColor={borderColor}>Account Name</Th>
                                  <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                                    {companyBank?.company_acct_name1}
                                </Td>
                                </Tr>
                                <Tr>
                                <Th borderColor={borderColor}>Account Number</Th>
                                  <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                                    {companyBank.company_acct_number1}
                                </Td>
                                </Tr>
                                <Tr>
                                <Th borderColor={borderColor}>Bank Name</Th>
                                  <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                                    {companyBank.company_bank1}
                                </Td>
                                </Tr>
                                
                                <Td width="100%">
                                  <Flex justifyContent="space-between" alignItems="center">
                                    <Text fontSize="20px" color="#222" fontWeight="bold">
                                      {companyBank.company_bank2}
                                    </Text>
                                    <Text fontSize="20px" color="#222" fontWeight="bold"
                                    onClick={fidelityCopy} cursor='pointer'>
                                      {fidelityCopied ? "Copied" : <CopyIcon />}
                                    </Text>
                                  </Flex>
                                
                              </Td>
                              <Tr>
                                <Th borderColor={borderColor}>Account Name</Th>
                                  <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                                    {companyBank.company_acct_name2}
                                </Td>
                                </Tr>
                                <Tr>
                                <Th borderColor={borderColor}>Account Number</Th>
                                  <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                                  {companyBank.company_acct_number2}
                                </Td>
                                </Tr>
                                <Tr>
                                <Th borderColor={borderColor}>Bank Name</Th>
                                  <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                                  {companyBank.company_bank2}
                                </Td>
                                </Tr>
                              </p> :''
                              }
                                {type !=='Funding' && type !=='Buy' && type ==='Sales'?
                                <p>
                                {serviceCategory ==='Paypal' &&
                                <Tr>
                                <Th borderColor={borderColor} width="100%" fontSize="18px"
                                  fontWeight="700">Paypal Address</Th>
                                  <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                                  <Flex justifyContent="space-between" alignItems="center">
                                    <Text> {companyBank?.company_paypal_address} </Text>
                                   <Text  onClick={copyPaypal} cursor='pointer' ml={6}>
                                  {paypalCopied ? "Copied" : <CopyIcon />}</Text>
                                  </Flex>
                                </Td>
                                </Tr>
                                }
                                {serviceCategory ==='Payoneer' &&
                                <Tr>
                                <Th borderColor={borderColor} fontSize="18px"
                                  fontWeight="700">Payoneer Address</Th>
                                  <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                                  <Flex justifyContent="space-between" alignItems="center">
                                    <Text> {companyBank?.company_payoneer_address} </Text>
                                   <Text  onClick={copyPayoneer} cursor='pointer' ml={6}>
                                  {payoneerCopied ? "Copied" : <CopyIcon />}</Text>
                                  </Flex>
                                </Td>
                                </Tr>
                                }
                                {serviceCategory==='Bitcoin' &&
                                <Tr>
                                <Th borderColor={borderColor} fontSize="18px"
                                  fontWeight="700">Bitcoin Address</Th>
                                  <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                                  <Flex justifyContent="space-between" alignItems="center">
                                    <Text> {companyBank?.company_btc_address} </Text>
                                   <Text  onClick={copyBitcoin} cursor='pointer' ml={6}>
                                  {bitcoinCopied ? "Copied" : <CopyIcon />}</Text>
                                  </Flex>
                                   
                                </Td>
                                  
                                </Tr>
                                }
                                </p>:''
                                }
                                
                            </Tbody>
                          </Table>
                  
                          {/* Pagination controls */}
                          
                  </Box>
                </AccordionPanel>
                </AccordionItem>
        </Accordion>
      </Box>
       <Flex direction={{ base: "column", "2xl": "row" }} alignItems="center" justifyContent='center' mr={{ base: "column", lg: "400px" }} mb='20px'>
                          <Button
                              bg={'#5464c4'}
                              color='white'
                              width={{ base: "80%", lg: "30%" }}
                              height='50px'
                              border="2px"
                              borderWidth={2}
                              borderColor="#FFF"
                              _hover={{ bg: "#5363CE", color: "#fff" }}
                                _active={{ bg: "white" }}
                                _focus={{ bg: "#5464c4" }}
                              fontWeight='500'
                                fontSize='14px'
                                 mt={20}
                                 onClick={() => navigate('/user/payment-proof', {
                                  state: {
                                    amt:payment,
                                    track_id: track_id,
                                    serviceType: type,
                                    serviceCategory: '',
                                  }
                                 }) }>
                              I'v made payment
                            </Button>
                            
        </Flex>
            
        </Box>
  );
}
