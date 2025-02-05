// Chakra imports
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import React from "react";

export default function SellExchange(props) {

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
 
  return (
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
          You can sell to us at your rate
        </Text>
       </Flex>
  );
}
