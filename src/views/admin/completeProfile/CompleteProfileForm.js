// Chakra imports
import {
  Box,
  Button,
  Flex,
  Text,
  HStack, Input ,
  InputGroup,
  Textarea,
  SimpleGrid,
  Select,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Heading
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React, {useState}from "react";

import { useDispatch, useSelector } from 'react-redux';
import { updateUserDetails } from 'storeMtg/authSlice';
import { userProfileUpdateData, resetProfileState } from 'storeMtg/completeProfileSignupSlice';

// Assets

export default function Upload(props) {
  const dispatch = useDispatch()
  const {user, userToken} = useSelector((state) => state.authUser)
  const {profileLoading} = useSelector((state) => state.completeSignup)
  const [errors, setErrors] = useState(false);
  const [errorMessages, setErrorMessages] = useState("");
  
  const toast = useToast();
  const { used, total, ...rest } = props;
  // Chakra Color Mode
  const textColorSecondary = "gray.400";

  const [detailsFormData, setDetailsFormData] = useState({
        sex: '',
        dob: '',
        state: '',
        city: '',
        country: '',
        address: '',
        acct_name: '',
        acct_number: '',
        bank_name: '',
        paypal_address: '',
        payoneer_address: '',
        btc_address: '',
      });
    const handleDataChange = (e) => {
      const { name, value } = e.target;
      setDetailsFormData({
        ...detailsFormData,
        [name]: value,
      });
    };

    const updateProfile = () => {
        const allEmpty = Object.values(detailsFormData).every((value) => value === '');
          if (allEmpty) {
            toast({
              title: "error!",
              description: "You can not submit empty form! Please, enter value.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            setErrors(true)
            setErrorMessages('Please, enter details before submitting.')
            return false;
          } else {
            dispatch(userProfileUpdateData(detailsFormData))
            .then((result) => {
              if (result.meta.requestStatus === 'fulfilled' || result.payload.msg ==='201') {
                // Success case
                // reset global state
                dispatch(resetProfileState());
                dispatch(updateUserDetails(result.payload));
                // reset input fields
                    setDetailsFormData({
                    sex: '',
                    dob: '',
                    state: '',
                    city: '',
                    country: '',
                    address: '',
                    acct_name: '',
                    acct_number: '',
                    bank_name: '',
                    paypal_address: '',
                    payoneer_address: '',
                    btc_address: '',
                  });
                  // show success message
                  toast({
                    title: "Success!",
                    description: "Profile updated successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                  });
              } else {
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
        }
  return (
        <>
        {user.userData.reg_stage2 !=='Yes'? (
        <Card {...rest} mb='20px' p='20px'>
                {errors &&  
                  <Alert status="error" mt={2}>
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
        
        <Flex
            align={{ sm: 'flex-start', lg: 'center' }}
            justify="space-between"
            w="100%"
            px="22px"
            pb="20px"
            mb="10px"
            boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)"
        >
            <Text color={textColorSecondary} fontSize="xl" fontWeight="600">
            Complete Registration
            </Text>
                
        </Flex>
      
      <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <HStack gap="10" width="full">
          
          <InputGroup flex="1">
          <Select placeholder="Select Gender"
          value={detailsFormData.sex}
          name="sex"
          onChange={handleDataChange}>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Others">Others</option>
            </Select>
          </InputGroup>
          <InputGroup flex="1">
            <Input placeholder="DOB" 
            value={detailsFormData.dob}
            name="dob"
            onChange={handleDataChange}/>
          </InputGroup>
          
        </HStack>
      </Flex>

      <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <HStack gap="10" width="full">
          <InputGroup flex="1">
            <Input placeholder="State" 
            value={detailsFormData.state}
            name="state"
            onChange={handleDataChange} />
          </InputGroup>

          <InputGroup flex="1">
            <Input placeholder="City"
            value={detailsFormData.city}
            name="city"
            onChange={handleDataChange} />
          </InputGroup>
          
        </HStack>
      </Flex>
      <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <HStack gap="10" width="full">
          <InputGroup flex="1">
            <Input placeholder="Country"
            value={detailsFormData.country}
            name="country"
            onChange={handleDataChange} />
          </InputGroup>

          <InputGroup flex="1">
          <Textarea placeholder="Address"
          value={detailsFormData.address}
          name="address"
          onChange={handleDataChange} />
          </InputGroup>
        </HStack>
      </Flex>
      <hr></hr>
        <Flex
            align={{ sm: 'flex-start', lg: 'center' }}
            justify="space-between"
            w="100%"
            px="22px"
            pb="20px"
            mb="10px"
            mt="20px"
            boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)"
        >
            <Text color={textColorSecondary} fontSize="xl" fontWeight="600">
            Bank Details
            </Text>
                
        </Flex>

        <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <HStack gap="10" width="full">
          <InputGroup flex="1">
            <Input placeholder="Account Name"
            value={detailsFormData.acct_name}
            name="acct_name"
            onChange={handleDataChange} />
          </InputGroup>

          <InputGroup flex="1">
          <Input placeholder="Account Number"
          value={detailsFormData.acct_number}
          name="acct_number"
          onChange={handleDataChange} />
          </InputGroup>
          
        </HStack>
      </Flex>

      <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <HStack gap="10" width="47%">
         <InputGroup flex="1">
          <Input placeholder="Bank Name"
          value={detailsFormData.bank_name}
          name="bank_name"
          onChange={handleDataChange} />
          </InputGroup>
        </HStack>
      </Flex>

      <hr></hr>
        <Flex
            align={{ sm: 'flex-start', lg: 'center' }}
            justify="space-between"
            w="100%"
            px="22px"
            pb="20px"
            mb="10px"
            mt="20px"
            boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)"
        >
            <Text color={textColorSecondary} fontSize="xl" fontWeight="600">
            Wallet Address
            </Text>
         </Flex>

        <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <HStack gap="10" width="full">
          <InputGroup flex="1">
            <Input placeholder="Paypal Address" 
            value={detailsFormData.paypal_address}
            name="paypal_address"
            onChange={handleDataChange}/>
          </InputGroup>

          <InputGroup flex="1">
          <Input placeholder="Payoneer Address"
          value={detailsFormData.payoneer_address}
          name="payoneer_address"
          onChange={handleDataChange} />
          </InputGroup>
          
        </HStack>
      </Flex>

      <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <HStack gap="10" width="47%">
         <InputGroup flex="1">
          <Input placeholder="Bitcoin Address"
          value={detailsFormData.btc_address}
          name="btc_address"
          onChange={handleDataChange} />
          </InputGroup>
        </HStack>
      </Flex>
      
      <Box>
          <Flex px="25px" align='center' mb={{ sm: "0px", md: "20px" }} direction='column' >
                <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
                    gap={{ md: '250px', lg: '250px', sm: '40px' }}
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
                        onClick={() => updateProfile()}
                        disabled={profileLoading}>
                        {profileLoading ? <Text><Spinner color="white.500" animationDuration="0.8s" size="sm" /></Text> : 'Submit'}
                    </Button>
                </SimpleGrid>
          </Flex>
    </Box>
        </Card>
        ):<Heading fontSize="xl" color={'#aaa'}>
          {'Profile details has been updated! There is nothing to do at the moment.'}
          </Heading> 
          }
        </>
  );
}
