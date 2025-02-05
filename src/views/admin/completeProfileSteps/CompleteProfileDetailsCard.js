// Chakra imports
import { Box, Flex, Text, useColorModeValue, } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import { VSeparator } from "components/separator/Separator";
import React from "react";

export default function CompleteProfileDetails(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 10px 10px rgba(112, 144, 176, 0.12)",
    "unset"
  );


  
  return (
    <Card p='20px' align='center' direction='column' w={{ md: "580px", xl:'580px', lg:'580px', sm:'100%' }} {...rest}>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent='space-between'
        alignItems='center'
        w='100%'
        mb='8px'>
        <Text color={textColor} mt='4px'
        fontSize="20px"
        fontWeight="700"
        lineHeight="100%">
          You can buy from us at your rate
        </Text>
       </Flex>

      <Card
        bg={cardColor}
        flexDirection='row' 
        boxShadow={cardShadow}
        w='100%'
        p='15px'
        px='20px'
        mt='15px'
        mx='auto'>
        <Flex direction='column' py='5px' align='center'>
          <Flex align='center'>
            <Box h='8px' w='8px' borderRadius='50%' me='4px' />
            <Text
              fontSize='xs'
              color='secondaryGray.600'
              fontWeight='700'
              mb='5px'>
              <img src="../assets/images/paypal1.png" alt="paypal Logo" width={'45px'} height={'17px'} my='32px' />
            </Text>
          </Flex>
          <Text fontSize='lg' color={textColor} fontWeight='700'>
            63%
          </Text>
        </Flex>
        <VSeparator mx={{ base: "60px", xl: "60px", "2xl": "60px" }} />
        <Flex direction='column' py='5px' me='10px'>
          <Flex align='center'>
            <Box h='8px' w='8px' borderRadius='50%' me='4px' />
            <Text
              fontSize='xs'
              color='secondaryGray.600'
              fontWeight='700'
              mb='5px'>
              <img src="../assets/images/payooner.png" alt="payooner Logo" width={'45px'} height={'17px'} my='32px' />
            </Text>
          </Flex>
          <Text fontSize='lg' color={textColor} fontWeight='700'>
            25%
          </Text>
        </Flex>
        <VSeparator mx={{ base: "60px", xl: "60px", "2xl": "60px" }} />
        <Flex direction='column' py='5px' me='10px'>
          <Flex align='center'>
            <Box h='8px' w='8px' borderRadius='50%' me='4px' />
            <Text
              fontSize='xs'
              color='secondaryGray.600'
              fontWeight='700'
              mb='5px'>
              <img src="../assets/images/bitcoin1_virtual.png" alt="btc Logo" width={'45px'} height={'17px'} my='32px' />
            </Text>
          </Flex>
          <Text fontSize='lg' color={textColor} fontWeight='700'>
            0.5%
          </Text>
        </Flex>
      </Card>
    </Card>
  );
}
