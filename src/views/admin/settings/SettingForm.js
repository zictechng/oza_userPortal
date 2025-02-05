/* eslint-disable */

import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Switch,
  Stack,
  FormLabel,
  useToast
} from '@chakra-ui/react';

import React , {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postSetting } from 'storeMtg/emailSettingSlice';
import { updateUserDetails } from 'storeMtg/authSlice';
import { post2FAMode } from 'storeMtg/f2ASettingSlice';
import { postInAppNotification } from 'storeMtg/inAppSettingSlice';

export default function SettingForm(props) {
  // redux state method here
  const dispatch = useDispatch()

  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const [emailEnable, setEmailEnable] = useState(false)
  const [f2AmodeEnable, setF2AmodeEnable] = useState(false);
  const [inAppEnable, setInappEnable] = useState(false);
  const [errors, setErrors] = useState(false);

  const [errorMessages, setErrorMessages] = useState("");

  const toast = useToast();

  const {user} = useSelector((state) => state.authUser)
  

                useEffect(() => {
                  checkEmailNotificationStatus();
                  check2FANotificationStatus();
                  checkInAppNotificationStatus();
                  }, []);


                // check email notification status first
                const checkEmailNotificationStatus = ()=>{
                if(user.userData.receive_email_notification == true){
                  setEmailEnable(true);
                    //console.log('active state ', isEmailEnabled)
                }
                if(user.userData.receive_email_notification == false){
                  setEmailEnable(false);
                    // console.log('active state ', isEmailEnabled)
                }
              }
              // check 2FA notification status first
              const check2FANotificationStatus = ()=>{
                if(user.userData.activate_2fa_login == true){
                  setF2AmodeEnable(true);
                    //console.log('active state ', isEmailEnabled)
                }
                if(user.userData.activate_2fa_login == false){
                  setF2AmodeEnable(false);
                    // console.log('active state ', isEmailEnabled)
                }
              }

              // check 2FA notification status first
              const checkInAppNotificationStatus = ()=>{
                if(user.userData.receive_app_message == true){
                  setInappEnable(true);
                    //console.log('active state ', isEmailEnabled)
                }
                if(user.userData.receive_app_message == false){
                  setInappEnable(false);
                    // console.log('active state ', isEmailEnabled)
                }
              }


            // call email enable method here 
            const toggleEmailSwitch  = (event) =>{
              const emailEnable = event.target.checked; 
              setEmailEnable(emailEnable); // Update the state
                dispatch(postSetting(emailEnable)).then((response)=>{
                  if(response.payload?.status === 401){
                    setErrors(true)
                    setErrorMessages("Access Denied")
                   }
                  else if(response.payload?.msg ==='201'){
                    // update user details
                    dispatch(updateUserDetails(response.payload));
                    console.log("New user Record ", response.payload);
                    // show a toast here
                    if(emailEnable === true || emailEnable === 'true')
                    {
                      toast({
                        title: "Success!",
                        description: "Email notification enabled.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                      });
                    setEmailEnable(emailEnable);
                    }
                    else{
                      toast({
                        title: "Success!",
                        description: "Email notification disabled.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                      });
                    }
                  setEmailEnable(emailEnable);
                  }
                  else{
                    setErrorMessages(response.payload?.message)
                    toast({
                      title: "Error!",
                      description: "There was an issue updating your request.",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                  }
                })
              }

            // call 2FA enable method here
            const toggle2FASwitch  = (event) =>{
              const f2AmodeEnable = event.target.checked; 
              console.log('Switch state:', f2AmodeEnable);
              setF2AmodeEnable(f2AmodeEnable); // Update the state
              
                dispatch(post2FAMode(f2AmodeEnable)).then((response)=>{
                  if(response.payload?.status === 401){
                    setErrors(true)
                    setErrorMessages("Access Denied")
                   }
                  else if(response.payload?.msg ==='201'){
                    // update user details
                    dispatch(updateUserDetails(response.payload));
                    console.log("New user Record ", response.payload);
                    // show a toast here
                    if(f2AmodeEnable === true || f2AmodeEnable === 'true')
                    {
                      toast({
                        title: "Success!",
                        description: "Email notification enabled.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                      });
                    setF2AmodeEnable(f2AmodeEnable);
                    }
                    else{
                      toast({
                        title: "Success!",
                        description: "Email notification disabled.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                      });
                    }
                  setF2AmodeEnable(f2AmodeEnable);
                  }
                  else{
                    setErrorMessages(response.payload?.message)
                    toast({
                      title: "Error!",
                      description: "There was an issue updating your request.",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                  }
                })
              }

              // call In app notification enable method here
            const toggleInAppSwitch  = (event) =>{
              const inAppEnable = event.target.checked; 
              console.log('Switch state:', inAppEnable);
              setInappEnable(inAppEnable); // Update the state
              
                dispatch(postInAppNotification(inAppEnable)).then((response)=>{
                  if(response.payload?.status === 401){
                    setErrors(true)
                    setErrorMessages("Access Denied")
                   }
                  else if(response.payload?.msg ==='201'){
                    // update user details
                    dispatch(updateUserDetails(response.payload));
                    console.log("New user Record ", response.payload);
                    // show a toast here
                    if(inAppEnable === true || inAppEnable === 'true')
                    {
                      toast({
                        title: "Success!",
                        description: "Email notification enabled.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                      });
                      setInappEnable(inAppEnable);
                    }
                    else{
                      toast({
                        title: "Success!",
                        description: "Email notification disabled.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                      });
                    }
                    setInappEnable(inAppEnable);
                  }
                  else{
                    setErrorMessages(response.payload?.message)
                    toast({
                      title: "Error!",
                      description: "There was an issue updating your request.",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                  }
                })
              }
  
  return (
    <Flex
      direction="column"
      w="100%"
      overflowX={{ lg: 'hidden' }}
    >
      <Flex
        align={{ sm: 'flex-start', lg: 'center' }}
        justify="space-between"
        w="100%"
        px="22px"
        pb="20px"
        mb="10px"
        boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)"
      >
        <Text color={textColor} fontSize="xl" fontWeight="600">
         App Settings
        </Text>
        {/* <Button variant="action">See all</Button> */}
      </Flex>
          <Box ml={5}>
            <Stack isInline 
              fontSize="sm"
              mb="20px">
                <Switch colorScheme='green' id='1'
                isChecked={emailEnable}
                onChange={toggleEmailSwitch}/>
                <FormLabel htmlFor="email-alerts">Enable Email Notifications</FormLabel>
                
            </Stack>
            <Stack isInline
            fontSize="sm"
            mb="20px"> 
                <Switch colorScheme='green' id='2' 
                isChecked={f2AmodeEnable}
                onChange={toggle2FASwitch}/>
                <FormLabel htmlFor="email-alerts">Enable 2FA Authentication</FormLabel>
                
            </Stack>
            <Stack isInline> 
                <Switch colorScheme='green' id='3' 
                isChecked={inAppEnable}
                onChange={toggleInAppSwitch}/>
                <FormLabel htmlFor="email-alerts">Enable In-App Notification?</FormLabel>
                
            </Stack>
      </Box>
    </Flex>
  );
}
