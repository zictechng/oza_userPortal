import React, {useState } from 'react';

// Chakra imports
import {
  Box,
  Flex,
  Grid,
  Alert,
  AlertDescription,
  CloseButton,
  useDisclosure,
  Button,
  SimpleGrid
} from '@chakra-ui/react';
import { CheckCircleIcon, InfoOutlineIcon } from "@chakra-ui/icons";

import {useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Custom components
// Assets
export default function CompleteProfileSteps() {
  // Chakra Color Mode
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const {user, userToken} = useSelector((state) => state.authUser)
 
  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure({ defaultIsOpen: true })

  return (
    <Box pt={{ base: '80px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
        gap={{ base: '20px', xl: '20px' }}
        display={{ base: 'block', xl: 'block' }}
        width={{ base: 'block', xl: '60%' }}>
        <Flex flexDirection="column">
          
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
                    <Flex justifyContent='center' alignItems='center' direction='column'>
                    {/* <img src="../assets/images/paypal1.png" alt="paypal Logo" width={'45px'} height={'17px'} my='32px' /> */}
                    <CheckCircleIcon fontSize='80px' color={'green.300'} mb='8px' />
                        <Box flex="1" textAlign="left" fontSize={{ base: "30px", lg: "22px" }}>
                            Successful
                        </Box>
                    </Flex>
                </Box>

                <Flex mt='50px' mb='10px'>
                    {isVisible ? ( <Alert status="success" mb={4} fontSize={20} borderRadius={15}>
                <InfoOutlineIcon color='green' mr='8px'/>
                <Box>
                
                <AlertDescription fontSize={'18px'}>
                    Your transaction was successful! Thank you for choosing {user.appData?.app_name} as your prefer partner.
                </AlertDescription>
                </Box>
                <CloseButton
                alignSelf='flex-start'
                position='relative'
                right={{base: '-1', lg:'-10'}}
                top={-1}
                onClick={onClose}/>
            </Alert>
            ):('')}
            
           </Flex>
           <Box justifyContent='center' alignItems='center'>
              <Flex px="25px" align='center' justifyContent='center' mb={{ sm: "0px", md: "20px" }} direction='column' >
                    <SimpleGrid
                        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
                        gap={{ md: '250px', lg: '250px', sm: '40px' }}
                        mt='40px'
                        width={{sm: '20%' }}>
                            <Button
                              bg='#5363CE'
                              color='white'
                              _hover={{ bg: "#1D2667" }}
                              _active={{ bg: "#1D2667" }}
                              _focus={{ bg: "#1D2667" }}
                              fontWeight='500'
                              fontSize='14px'
                              py='20px'
                              px='27'
                              me='38px' 
                              width={{ md: '200px', lg: '200px', sm: '100%' }}
                            onClick={() => navigate('/user')}>
                            Okay
                        </Button>
                    </SimpleGrid>
                  </Flex>
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
