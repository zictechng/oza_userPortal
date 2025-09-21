// Chakra imports
import React, {useEffect, useState} from "react";
import { 
  Avatar, 
  Box, 
  Text, 
  useColorModeValue,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription, 
  useDisclosure,
  CloseButton,
  Button,
  Flex
}from "@chakra-ui/react";
import Card from "components/card/Card.js";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

export default function Banner(props) {
  const navigate = useNavigate();
  const { banner, avatar, name, job, } = props;
  const {user} = useSelector((state) => state.authUser)
  const [regStage, setRegStage] = useState(false);

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );

  const {
        isOpen: isVisible,
        onClose,
        onOpen,
      } = useDisclosure({ defaultIsOpen: true })

  const ProfileRedirect = () =>{
    navigate('/user/signup-process');
  }

  useEffect(() => {
        checkRegistrationSteps();
        
      }, [user]);
  
      const checkRegistrationSteps = () =>{
        if ( user.userData.reg_stage1 === "Yes"
            && user.userData.reg_stage2 === "" 
            && user.userData.reg_stage3 === "" 
            && user.userData.reg_stage4 === "" 
            && user.userData.reg_stage5 ===""
            && user.userData.reg_stage6 === ""
          )
          {
            setRegStage(true)
          }
    else if ( user.userData.reg_stage1 === "Yes" 
            && user.userData.reg_stage2 === "Yes"
            && user.userData.reg_stage3 === "" 
            && user.userData.reg_stage4 === "" 
            && user.userData.reg_stage5 ===""
            && user.userData.reg_stage6 === ""
          )
          {
            setRegStage(true)
          }
    else if ( 
            user.userData.reg_stage1 === "Yes" 
            && user.userData.reg_stage2 === "Yes"
            && user.userData.reg_stage3 === "Yes" 
            && user.userData.reg_stage4 === "" 
            && user.userData.reg_stage5 ===""
            && user.userData.reg_stage6 === ""
          )
          {
            setRegStage(true)
          }
    else if (user.userData.reg_stage1 === "Yes" 
            && user.userData.reg_stage2 === "Yes"
            && user.userData.reg_stage3 === "Yes" 
            && user.userData.reg_stage4 === "Yes" 
            && user.userData.reg_stage5 ===""
            && user.userData.reg_stage6 === ""
          )
          {
            setRegStage(true)
          }
    else if (
            user.userData.reg_stage1 === "Yes" 
            && user.userData.reg_stage2 === "Yes" 
            && user.userData.reg_stage3 === "Yes" 
            && user.userData.reg_stage4 === "Yes" 
            && user.userData.reg_stage5 ==="Yes" 
            && user.userData.reg_stage6 === ""
           )
          {
            setRegStage(true)
          }
          else if(user.userData.reg_stage1 === "Yes" 
            && user.userData.reg_stage2 === "Yes" 
            && user.userData.reg_stage3 === "Yes" 
            && user.userData.reg_stage4 === "Yes" 
            && user.userData.reg_stage5 ==="Yes" 
            && user.userData.reg_stage6 === "Yes"
          )
          {
            setRegStage(false)
          }
      }

  return (
    <Card mb={{ base: "0px", lg: "20px" }} align='center'>
      <Box
        bg={`url(${banner})`}
        bgSize='cover'
        borderRadius='16px'
        h='75px'
        w='100%'
      />
      
      <Avatar
        mx='auto'
        src={avatar}
        h='87px'
        w='87px'
        mt='-43px'
        border='4px solid'
        borderColor={borderColor}
      />
      <Text color={textColorPrimary} fontWeight='bold' fontSize='xl' mt='10px'>
        {name}
      </Text>
      <Text color={textColorSecondary} fontSize='sm'>
        {job}
      </Text>
          
      <Center color='black' mt='30px'> 
        {/* <Button
          bg={'transparent'}
          size="md"
          border="2px"
          borderWidth={2}
          borderColor="#5363CE"
          _hover={{ bg: "#5363CE", color: "#fff" }}
            _active={{ bg: "#5464c4" }}
            _focus={{ bg: "#5464c4", color: "#fff", borderColor:'#5464c4'  }}
          fontWeight='500'
            fontSize='14px'
            
            mt={20}>
          Upload Profile
        </Button> */}
        {user.userData.acct_approved_status !=='none'?
      <RiVerifiedBadgeFill size='40px' color="#5363CE"
      _hover={{ bg: "#5464c4", color: "#fff" }}/>
      :(<Text color='#aaa' fontSize='16px' >Account verification pending</Text>)}
        
      </Center> 
          {regStage && isVisible ?
          <Alert 
            status="warning"
            mt={8}
            mb={6}
            borderRadius={15}
            position="relative"
          >
            <AlertIcon />
            <Box flex="1">
              <AlertTitle mt={4} mb={1} fontSize='22px' textAlign={{ base: "center", md: "left" }}>
                Incomplete profile
              </AlertTitle>
              
              <Flex 
                justify={{ base: "center", md: "space-between" }} 
                align="center" 
                direction={{ base: "column", md: "row" }}
                textAlign={{ base: "center", md: "left" }}
                >
                <AlertDescription fontSize={{ base: "sm", md: "md" }}>
                  Complete your profile registration to remove restrictions in your account.
                </AlertDescription>
                
                <Button
                  bg='white'
                  color='black'
                  _hover={{ bg: "whiteAlpha.900" }}
                  _active={{ bg: "white" }}
                  _focus={{ bg: "white" }}
                  fontWeight='500'
                  fontSize={{ base: '12px', md: '14px' }}
                  py={{ base: '15px', md: '20px' }}
                  px={{ base: '15px', md: '20px' }}
                  mt={{ base: 3, md: 0 }}
                  onClick={ProfileRedirect}>
                  Okay
                </Button>
              </Flex>
            </Box>
            <CloseButton position="absolute" right="8px" top="8px"
              onClick={onClose} />
          </Alert>
          :''
          }
    </Card>
  );
}
