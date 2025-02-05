// Chakra imports
import { Avatar, Flex, Text, useColorModeValue, Button } from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React from "react";

export default function Banner(props) {
  const { banner, avatar } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("#FBFBFB");
  const textColorSecondary = "white";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );
  return (
    <Card mb={{ base: "0px", lg: "20px" }} align='center'
    bg={`url(${banner})`}
    bgSize='cover'>
      {/* <Box
        bg={`url(${banner})`}
        bgSize='cover'
        borderRadius='16px'
        backgroundColor='white'
        h='75px'
        w='100%'
      /> */}
      <Avatar
        mx='auto'
        src={avatar}
        h='87px'
        w='87px'
        mt='-15px'
        border='4px solid'
        borderColor={borderColor}
      />
      
      <Flex direction="row" justifyContent="space-between" alignItems="center" mt={50}>
        <Flex direction='column' justifyContent='space-between'>
          
          <Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
            Current Funding Balance
          </Text>
          <Text color={textColorPrimary} fontSize='1xl' fontWeight='700'>
            {'30,000,000.00'}
          </Text>
        </Flex>

        <Flex direction='column' justifyContent='space-between'>
          
          <Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
            Bonus Balance
          </Text>
          <Text color={textColorPrimary} fontSize='1xl' fontWeight='700'>
            {'100,000,000.00'}
          </Text>
        </Flex>

      </Flex>
      
        
    {/* <Flex direction="row" justifyContent="space-between" alignItems="center" width="200px">
            
        <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
            {'3'}
        </Text>
        <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
            Posts
        </Text>
    </Flex> */}
              
              <Flex direction={{ base: "column", "2xl": "row" }} justifyContent="space-between" alignItems="center">
                    <Button
                        bg={'transparent'}
                        color='white'
                        size="md"
                        border="2px"
                        borderWidth={2}
                        borderColor="#FFF"
                        _hover={{ bg: "#5363CE", color: "#fff" }}
                          _active={{ bg: "white" }}
                          _focus={{ bg: "white" }}
                        fontWeight='500'
                          fontSize='14px'
                           mt={20}>
                        Fund Account
                      </Button>
                      <Button
                        bg={'transparent'}
                        color='white'
                        size="md"
                        border="2px"
                        borderWidth={2}
                        borderColor="#FFF"
                        _hover={{ bg: "#5363CE", color: "#fff" }}
                          _active={{ bg: "white" }}
                          _focus={{ bg: "white" }}
                        fontWeight='500'
                          fontSize='14px'
                          
                          mt={{base:'25px'}}>
                        Withdraw
                      </Button>
             </Flex>
    
    </Card>
  );
}
