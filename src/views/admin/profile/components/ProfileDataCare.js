// Chakra imports
import React, {useEffect, useState} from "react";
import {
  Flex,
  HStack, Input ,
  InputGroup,
  Textarea,
  Box,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription, 
  useDisclosure,
  CloseButton,
  Button
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
// Assets

export default function ProfileDataCard(props) {
  const { used, total, ...rest } = props;
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.authUser)
  const [regStage, setRegStage] = useState(false);

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
    <Card {...rest} mb='20px' align='center' p='20px'>
      <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        
        <HStack gap="10" width="full">
          <InputGroup flex="1">
            <Input placeholder="Full Name"  value={user.userData?.display_name}/>
          </InputGroup>

          <InputGroup flex="1" startElement="https://">
            <Input placeholder="Phone Number" value={user.userData?.phone} />
          </InputGroup>
          
        </HStack>
      </Flex>
      <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <HStack gap="10" width="full">
          <InputGroup flex="1">
            <Input placeholder="Email" value={user.userData?.email} />
          </InputGroup>

          <InputGroup flex="1">
            <Input placeholder="Sex" value={user.userData?.gender} />
          </InputGroup>
          
        </HStack>
      </Flex>

      <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <HStack gap="10" width="full">
          <InputGroup flex="1">
            <Input placeholder="DOB" value={user.userData?.dob} />
          </InputGroup>

          <InputGroup flex="1">
            <Input placeholder="State" value={user.userData?.state} />
          </InputGroup>
          
        </HStack>
      </Flex>
      <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <HStack gap="10" width="full">
          <InputGroup flex="1">
            <Input placeholder="City" value={user.userData?.city} />
          </InputGroup>

          <InputGroup flex="1">
            <Input placeholder="Country" value={user.userData?.country} />
          </InputGroup>
          
        </HStack>
      </Flex>
      <Textarea placeholder="Address" value={user.userData?.address} />
          
    </Card>
  );
}
