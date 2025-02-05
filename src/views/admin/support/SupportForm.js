// Chakra imports
import {
  Box,
  Button,
  Flex,
  Text,
  Textarea,
  SimpleGrid,
  Select,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton, 
  useToast 
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React , {useState} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { postSupport } from "storeMtg/supportSlice";

// Assets

export default function SupportForm() {

    // redux state method here
        const dispatch = useDispatch()
        const [supportSubject, setSupportSubject] = useState("")
        const [supportMessage, setSupportMessage] = useState("");
        const [errors, setErrors] = useState(false);
        const [errorMessages, setErrorMessages] = useState("");
        const toast = useToast();
  
        const {user} = useSelector((state) => state.authUser)
        const {dataLoading, error, errorMessage} = useSelector((state) => state.support)


         // call method here 
          const submitForm  = () =>{
            if (supportSubject === undefined||supportSubject ===''){
              setErrors(true)
              setErrorMessages("Please Subject Required")
            }
            else if (supportMessage === undefined||supportMessage ===''){
              setErrors(true)
              setErrorMessages("Please message Required")
            }
             else{
             //then run login method api call here
              const postData={
                'ticket_message': supportMessage,
                'ticket_type': supportSubject,
                'createdBy': user?.userData._id
              }
              dispatch(postSupport(postData)).then((response)=>{
                //console.log("Auth User Record ", response.payload.status);
                
                if(response.payload?.status === 401){
                  setErrors(true)
                  setErrorMessages("Access Denied")
                 }
                else if(response.payload?.msg ==='200'){
                  setSupportSubject('');
                  setSupportMessage('');
                  // show a toast here
                  console.log('Support Message: ' + response.payload)
                  toast({
                    title: "Success!",
                    description: "Your message was sent successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                  });
                }
                else{
                  setErrors(true)
                  setErrorMessages(response.payload?.message)
                  toast({
                    title: "Error!",
                    description: "There was an issue posting your request.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                }
              })
            }
          }
 
  return (
    <Card mb='20px' align='center' p='20px'>
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
        fontSize={{ sm: '14px', lg: '16px'}}
        py={1.5}
        color="gray.400"
        >
        How may we help you today?
        </Text>
    </Flex>
                {errors &&  
                <Alert status="error" mb={5}>
                    <AlertIcon />
                    <AlertTitle mr={2}>
                      Error!
                    </AlertTitle>
                  <AlertDescription>
                      {errorMessages}
                  </AlertDescription>
                  
                  <CloseButton position="absolute" right="8px" top="8px" onClick={() => setErrors(false)}/>
                </Alert>
                }
      <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
      <Select placeholder="Select Subject" width={{base:'100%', lg:'400px', md:'400px'}}
      onChange={(e) => setSupportSubject(e.target.value)}
      value={supportSubject}
      required="required">
        <option value="Account Funding">Account Funding</option>
        <option value="Account Profile Update">Account Profile Update</option>
        <option value="Account Approval">Account Approval</option>
        <option value="Bounces Issues">Bounces Issues</option>
        <option value="Closing Account">Closing Account</option>
        <option value="Document Upload">Document Upload</option>
        <option value="Funds Sending">Funds Sending</option>
        <option value="Funds Withdrawal">Funds Withdrawal</option>
        <option value="Payment Issues">Payment Issues</option>
        <option value="Paypal Account Opening">Paypal Account Opening</option>
        <option value="Transactions Issues">Transactions Issues</option>
        <option value="2FA Issues">2FA Issues</option>
        <option value="Others">Others</option>
     </Select>
      </Flex>
      <Textarea placeholder="Enter Message (350 characters max)" h={200}
       onChange={(e) => setSupportMessage(e.target.value)}
       value={supportMessage}
       required="required" />
      <Box>
          <Flex px="25px" align='center' mb={{ sm: "0px", md: "20px" }} direction='column' >
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
                        disabled={dataLoading}
                        onClick={() => submitForm()}>
                        {dataLoading ? <Spinner color="white.500" animationDuration="0.8s" size="sm" /> :'Submit'}
                    </Button>
                </SimpleGrid>
          </Flex>
    </Box>
    </Card>
  );
}
