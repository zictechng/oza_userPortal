import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  
} from "@chakra-ui/react";
// Custom components
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/auth.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import IsValidEmail from "components/EmailValidation";

import { authUserLogin } from "storeMtg/authSlice";

function SignIn() {
  const navigate = useNavigate();
  // Chakra color mode
  const textColor = useColorModeValue("#1D2667", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("#1D2667.700", "secondaryGray.600");
  const googleHover = useColorModeValue(
    { bg: "#1D2aa7" },
    { bg: "blueAlpha.300" }
  );
  // const googleActive = useColorModeValue(
  //   { bg: "#1D2aa7" },
  //   { bg: "blueAlpha.200" }
  // );
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);


  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("");
  const [errors, setErrors] = useState(false);
  const [errorMessages, setErrorMessages] = useState("");

   // redux state method here
  const dispatch = useDispatch()
  const {loading, error, userToken} = useSelector((state) => state.authUser)
  
  useEffect(() => {
    if (userToken) {
      navigate('/')
    }
  }, [navigate, userToken])
  
  // call login method here 
  const submitLoginForm  = () =>{
    if (userEmail === undefined||userEmail ===''){
      setErrors(true)
      setErrorMessages("Please enter your email")
    }
    else if (userPassword === undefined||userPassword ===''){
      setErrors(true)
      setErrorMessages("Please enter your password")
    }
     // validate email address format 
    else if (!IsValidEmail(userEmail)){
      setErrors(true)
      setErrorMessages("Email format not valid")
    }
    else{
      
    //then run login method api call here
      const loginData={
        'username': userEmail,
        'password': userPassword,
      }
      dispatch(authUserLogin(loginData)).then((response)=>{
        //console.log("Auth User Record ", response.payload.status);
        
        if(response.payload?.status === 401){
          setErrors(true)
          setErrorMessages("Invalid username or password")
         }
        else if(response.payload?.msg ==='200'){
          setUserEmail('');
          setUserPassword('');
          navigate('/')
        }
        else{
          setErrors(true)
          setErrorMessages(response.payload?.message)
        }
      })
    }
  }
  
  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w='100%'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            User Login
          </Heading>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Enter your credentials to access your Oza account.
          </Text>
        </Box>
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
          {error &&
            <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>
                  Warning!
                </AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
                <CloseButton position="absolute" right="8px" top="8px" onClick={() => setErrors(false)}/>
                </Alert>
            }
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          {/* <Button
            fontSize='sm'
            me='0px'
            mb='26px'
            py='15px'
            h='50px'
            borderRadius='16px'
            bg={googleBg}
            color={googleText}
            fontWeight='500'
            _hover={googleHover}
            _active={googleActive}
            _focus={googleActive}>
            <Icon as={FcGoogle} w='20px' h='20px' me='10px' />
            Sign in with Google
          </Button>
          <Flex align='center' mb='25px'>
            <HSeparator />
            <Text color='gray.400' mx='14px'>
              or
            </Text>
            <HSeparator />
          </Flex> */}
          <FormControl isRequired>
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Email
            </FormLabel>
            <Input
              isRequired={true}
              variant='auth'
              fontSize='sm'
              ms={{ base: "0px", md: "0px" }}
              type='email'
              placeholder='mail@simmmple.com'
              mb='24px'
              fontWeight='500'
              size='lg'
              value={userEmail}
              required="required"
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <FormLabel
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              display='flex'>
              Password
            </FormLabel>
            <InputGroup size='md'>
              <Input
                isRequired={true}
                fontSize='sm'
                placeholder='Min. 8 characters'
                mb='24px'
                size='lg'
                type={show ? "text" : "password"}
                variant='auth'
                value={userPassword}
                required="required"
                onChange={(e) => setUserPassword(e.target.value)}
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            <Flex justifyContent='space-between' align='center' mb='24px'>
              <FormControl display='flex' alignItems='center'>
                <Checkbox
                  id='remember-login'
                  colorScheme='brandScheme'
                  me='10px'
                />
                <FormLabel
                  htmlFor='remember-login'
                  mb='0'
                  fontWeight='normal'
                  color={textColor}
                  fontSize='sm'>
                  Remember Me
                </FormLabel>
              </FormControl>
              <NavLink to='https://ozaapp.com/forget-password'>
                <Text
                  color={'#1D2667'}
                  fontSize='sm'
                  w='124px'
                  fontWeight='500'>
                  Forgot password?
                </Text>
              </NavLink>
            </Flex>
            <Button
              fontSize='sm'
              bg={loading? "#aaa" : "#1D2667" }
              color={'white'}
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'
              _hover={googleHover}
              onClick={() => submitLoginForm()}
              disabled={loading}>
              {loading ? <Spinner color="white.500" animationDuration="0.8s" size="sm" /> :'Login'}
            </Button>
          </FormControl>
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            maxW='100%'
            mt='0px'>
            <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
              I don't have an account?
              <NavLink to='https://ozaapp.com/signup'>
                <Text
                  color={'#1D2667'}
                  as='span'
                  ms='5px'
                  fontWeight='500'>
                  Create an Account
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
