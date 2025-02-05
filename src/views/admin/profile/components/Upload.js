// Chakra imports
import {
  Flex,
  HStack, Input ,
  InputGroup,
  Textarea,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";
// Assets

export default function Upload(props) {
  const { used, total, ...rest } = props;
  return (
    <Card {...rest} mb='20px' align='center' p='20px'>
      <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        {/* <Dropzone
          w={{ base: "100%", "2xl": "268px" }}
          me='36px'
          maxH={{ base: "60%", lg: "50%", "2xl": "100%" }}
          minH={{ base: "60%", lg: "50%", "2xl": "100%" }}
          content={
            <Box>
              <Icon as={MdUpload} w='80px' h='80px' color={brandColor} />
              <Flex justify='center' mx='auto' mb='12px'>
                <Text fontSize='xl' fontWeight='700' color={brandColor}>
                  Upload Files
                </Text>
              </Flex>
              <Text fontSize='sm' fontWeight='500' color='secondaryGray.500'>
                PNG, JPG and GIF files are allowed
              </Text>
            </Box>
          }
        /> */}
        <HStack gap="10" width="full">
          <InputGroup flex="1">
            <Input placeholder="Full Name" />
          </InputGroup>

          <InputGroup flex="1" startElement="https://">
            <Input ps="4.75em" placeholder="Phone Number" />
          </InputGroup>
          
        </HStack>
      </Flex>
      <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <HStack gap="10" width="full">
          <InputGroup flex="1">
            <Input placeholder="Email" />
          </InputGroup>

          <InputGroup flex="1">
            <Input ps="4.75em" placeholder="Sex" />
          </InputGroup>
          
        </HStack>
      </Flex>

      <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <HStack gap="10" width="full">
          <InputGroup flex="1">
            <Input placeholder="DOB" />
          </InputGroup>

          <InputGroup flex="1">
            <Input ps="4.75em" placeholder="State" />
          </InputGroup>
          
        </HStack>
      </Flex>
      <Flex direction={{ base: "column", "2xl": "row" }} mb={5}>
        <HStack gap="10" width="full">
          <InputGroup flex="1">
            <Input placeholder="City" />
          </InputGroup>

          <InputGroup flex="1">
            <Input ps="4.75em" placeholder="Country" />
          </InputGroup>
          
        </HStack>
      </Flex>
      <Textarea placeholder="Address" />
      
    </Card>
  );
}
