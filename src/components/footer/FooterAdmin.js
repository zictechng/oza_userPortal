/*eslint-disable*/
import React from "react";
import {
  Flex,
  Link,
  List,
  ListItem,
  Text,
  Button,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Footer() {
  const textColor = useColorModeValue("gray.400", "white");
  const { toggleColorMode } = useColorMode();

        const handleMailto = () => {
          const email = "hello@ozaapp.com";
          const mailtoLink = `mailto:${email}`;
        
          // Create a temporary <a> element and simulate a click
          const a = document.createElement("a");
          a.href = mailtoLink;
          a.click();
        };


  return (
    <Flex
      zIndex='3'
      flexDirection={{
        base: "column",
        xl: "row",
      }}
      alignItems={{
        base: "center",
        xl: "start",
      }}
      justifyContent='space-between'
      px={{ base: "30px", md: "50px" }}
      pb='30px'>
      <Text
        color={textColor}
        textAlign={{
          base: "center",
          xl: "start",
        }}
        mb={{ base: "20px", xl: "0px" }}>
        {" "}
        &copy; {1900 + new Date().getYear()}
        <Text as='span' fontWeight='500' ms='4px'>
          Oza App. All Rights Reserved. Powered by
          <Link
            mx='3px'
            color={textColor}
            href='https://www.zictech-ng.com'
            target='_blank'
            fontWeight='700'>
            Zictech Technologies Limited
          </Link>
        </Text>
      </Text>
      <List display='flex'>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <Link
            fontWeight="500"
            color={textColor}
            onClick={handleMailto}>
            Support
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <Link
            fontWeight='500'
            color={textColor}
            href='https://ozaapp.com/terms-and-conditions'
            target='_blank'>
            Terms and Conditions 
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}>
          <Link
            fontWeight='500'
            color={textColor}
            href='https://ozaapp.com/privacy-policy'
            target='_blank'>
            Privacy Policy
          </Link>
        </ListItem>
        <ListItem>
          <Link
            fontWeight='500'
            color={textColor}
            href='https://ozaapp.com/about-us'
            target='_blank'>
            About
          </Link>
        </ListItem>
      </List>
    </Flex>
  );
}
