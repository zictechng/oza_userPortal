import React, {useState } from 'react';

// Chakra imports
import {
  Box,
  Flex,
  Grid,
  Alert,
  AlertIcon,
  AccordionItem,
  AccordionPanel,
  Accordion,
  AccordionButton,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { CheckIcon, CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

// Custom components
import ProfileDetailsForm from 'views/admin/completeProfile/CompleteProfileForm'
import ProfileImageUpload from './ProfileImageUploadCard'
import DocumentUpload from './DocumentUploadCard'
import AccountOwnerShip from './AccountOwnershipCard'
import AddressProof from './AddressProofCard'
import {useSelector } from 'react-redux';

// Assets
export default function CompleteProfileSteps() {
  // Chakra Color Mode

  const {user} = useSelector((state) => state.authUser)

  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);
  const [isExpanded3, setIsExpanded3] = useState(false);
  const [isExpanded4, setIsExpanded4] = useState(false);
  const [isExpanded5, setIsExpanded5] = useState(false);
  const [isExpanded6, setIsExpanded6] = useState(false);

  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure({ defaultIsOpen: true })

    //console.log('User data ', user.userData)

  return (
    <Box pt={{ base: '80px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
        gap={{ base: '20px', xl: '20px' }}
        display={{ base: 'block', xl: 'grid', lg:'grid', sm:'block', md:'grid' }}
      >
        <Flex flexDirection="column">
          <Flex>
            {isVisible ? ( <Alert status="info" mb={4} fontSize={20} borderRadius={15}>
            <AlertIcon />
            <Box>
                <AlertTitle mt={4} mb={1} fontSize='22px'>Signup Process</AlertTitle>
                <AlertDescription fontSize={'18px'}>
                Complete your account signup process to enjoy the amazing offers we have for you. It takes less than five minutes to complete.
                </AlertDescription>
            </Box>
                <CloseButton
                alignSelf='flex-start'
                position='relative'
                right={-1}
                top={-1}
                onClick={onClose}/>
            </Alert>
            ):('')}
            
           </Flex>

          <Flex direction="column">
            <Box
              p={5}
              shadow="md"
              borderWidth="1px"
              mb={10}
              ml={2}
              mr={2}
              bg="white"
              borderRadius="15">
              <Box width={{ base: "100%", lg: "100%" }}>
                    <Accordion allowToggle>
                                <AccordionItem>
                                    <AccordionButton
                                    onClick={() => setIsExpanded(!isExpanded)}>
                                    <Box flex="1" textAlign="left" fontSize={{ base: "20px", lg: "18px" }} color={'#aaa'}>
                                        Account Opening
                                    </Box>
                                    {isExpanded ? <CheckIcon color={'#aaa'} /> : <CheckCircleIcon color={'#aaa'} />}
                                    </AccordionButton>
                                    
                                </AccordionItem>
                    </Accordion>
            </Box>
            </Box>
            
          </Flex>
            {/* profile form */}
          <Flex direction="column">
            <Box
              p={5}
              shadow="md"
              borderWidth="1px"
              mb={10}
              ml={2}
              mr={2}
              bg="white"
              borderRadius="15">
              <Box width={{ base: "100%"}}>
                    <Accordion allowToggle>
                                <AccordionItem>
                                    <AccordionButton _expanded={{ bg: "#5464c4", color: "white" }}
                                    onClick={() => setIsExpanded2(!isExpanded2)}>
                                    <Box flex="1" textAlign="left" fontSize={{ base: "20px", lg: "18px" }}>
                                        Complete Profile Details
                                    </Box>
                                    {isExpanded2 && user.userData.reg_stage2 ==='Yes'? <CheckCircleIcon color={'#FFF'} /> : isExpanded2 && user.userData.reg_stage2 ===''? <WarningIcon color={'orange'} />: user.userData.reg_stage2 ==='Yes'? <CheckCircleIcon color={'#aaa'} />: user.userData.reg_stage2 ==='' && <WarningIcon color={'orange'} />}
                                    </AccordionButton>
                                    <AccordionPanel>
                                       <ProfileDetailsForm />
                            </AccordionPanel>
                            </AccordionItem>
                    </Accordion>
            </Box>
            </Box>
            
          </Flex>

          {/* upload profile photo */}
          <Flex direction="column">
            <Box
              p={5}
              shadow="md"
              borderWidth="1px"
              mb={10}
              ml={2}
              mr={2}
              bg="white"
              borderRadius="15">
              <Box width={{ base: "100%", lg: "100%" }}>
                    <Accordion allowToggle>
                                <AccordionItem>
                                    <AccordionButton _expanded={{ bg: "#5464c4", color: "white" }}
                                    onClick={() =>setIsExpanded3(!isExpanded3)}>
                                    <Box flex="1" textAlign="left" fontSize={{ base: "20px", lg: "18px" }}>
                                        Upload Profile Photo
                                    </Box>
                                    {isExpanded3 && user.userData.reg_stage3 ==='Yes'? <CheckCircleIcon color={'#FFF'} /> : isExpanded3 && user.userData.reg_stage3 ===''? <WarningIcon color={'orange'} />: user.userData.reg_stage3 ==='Yes'? <CheckCircleIcon color={'#aaa'} />: user.userData.reg_stage3 ==='' && <WarningIcon color={'orange'} />}
                                    </AccordionButton>
                                    <AccordionPanel>
                                       <ProfileImageUpload />
                            </AccordionPanel>
                            </AccordionItem>
                    </Accordion>
            </Box>
            </Box>
            
          </Flex>

          {/* Document ID Upload */}
          <Flex direction="column">
            <Box
              p={5}
              shadow="md"
              borderWidth="1px"
              mb={10}
              ml={2}
              mr={2}
              bg="white"
              borderRadius="15">
              <Box width={{ base: "100%", lg: "100%" }}>
                    <Accordion allowToggle>
                                <AccordionItem>
                                    <AccordionButton _expanded={{ bg: "#5464c4", color: "white" }}
                                    onClick={()=>setIsExpanded4(isExpanded4)}>
                                    <Box flex="1" textAlign="left" fontSize={{ base: "20px", lg: "18px" }}>
                                        Upload Document ID
                                    </Box>
                                    {isExpanded4 && user.userData?.reg_stage4 ==='Yes'? <CheckCircleIcon color={'#FFF'} /> : isExpanded4 && user.userData?.reg_stage4 ===''? <WarningIcon color={'orange'} />: user.userData?.reg_stage4 ==='Yes'? <CheckCircleIcon color={'#aaa'} />: user.userData?.reg_stage4 ==='' && <WarningIcon color={'orange'} />}
                                    </AccordionButton>
                                    <AccordionPanel>
                                       <DocumentUpload/>
                            </AccordionPanel>
                            </AccordionItem>
                    </Accordion>
            </Box>
            </Box>
            
          </Flex>

          {/* Proof account ownership */}
          <Flex direction="column">
            <Box
              p={5}
              shadow="md"
              borderWidth="1px"
              mb={10}
              ml={2}
              mr={2}
              bg="white"
              borderRadius="15">
                <Box width={{ base: "100%", lg: "100%" }}>
                    <Accordion allowToggle>
                                <AccordionItem>
                                    <AccordionButton _expanded={{ bg: "#5464c4", color: "white" }}
                                    onClick={()=>setIsExpanded5(isExpanded5)}>
                                    <Box flex="1" textAlign="left" fontSize={{ base: "20px", lg: "18px" }}>
                                        Proof Account Ownership
                                    </Box>
                                    {isExpanded5 && user.userData?.reg_stage5 ==='Yes'? <CheckCircleIcon color={'#FFF'} /> : isExpanded5 && user.userData?.reg_stage5 ===''? <WarningIcon color={'orange'} />: user.userData?.reg_stage5 ==='Yes'? <CheckCircleIcon color={'#aaa'} />: user.userData?.reg_stage5 ==='' && <WarningIcon color={'orange'} />}
                                    </AccordionButton>
                                    <AccordionPanel>
                                       <AccountOwnerShip/>
                            </AccordionPanel>
                            </AccordionItem>
                    </Accordion>
                </Box>
            </Box>
            
          </Flex>

            {/* Proof of address */}

            <Flex direction="column">
            <Box
              p={5}
              shadow="md"
              borderWidth="1px"
              mb={10}
              ml={2}
              mr={2}
              bg="white"
              borderRadius="15">
                <Box width={{ base: "100%", lg: "100%" }}>
                    <Accordion allowToggle>
                                <AccordionItem>
                                    <AccordionButton _expanded={{ bg: "#5464c4", color: "white" }}
                                    onClick={()=>setIsExpanded6(isExpanded6)}>
                                    <Box flex="1" textAlign="left" fontSize={{ base: "20px", lg: "18px" }}>
                                        Proof of Address
                                    </Box>
                                    {isExpanded6 && user.userData?.reg_stage6 ==='Yes'? <CheckCircleIcon color={'#FFF'} /> : isExpanded6 && user.userData?.reg_stage6 ===''? <WarningIcon color={'orange'} />: user.userData?.reg_stage6 ==='Yes'? <CheckCircleIcon color={'#aaa'} />: user.userData?.reg_stage6 ==='' && <WarningIcon color={'orange'} />}
                                    </AccordionButton>
                                    <AccordionPanel>
                                       <AddressProof/>
                            </AccordionPanel>
                            </AccordionItem>
                    </Accordion>
                </Box>
            </Box>
            
          </Flex>

        </Flex>

        <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}
        ></Flex>
      </Grid>
      {/* Delete Product */}
    </Box>
  );
}
