import React from "react";

// Chakra imports
import { 
  Flex, 
  useColorMode
 } 
 from "@chakra-ui/react";

// Custom components
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  const { colorMode } = useColorMode();
  //   Chakra color mode

  return (
    <Flex align='center' direction='column'>
      {/* <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} /> */}
      {colorMode === 'light' ? <img src={require('assets/images/logo_black.png')} alt="Logo" width={'105px'} height={'27px'} my='32px' mb='5px' /> : <img src={require('assets/images/logo_white.png')} alt="Logo" width={'105px'} height={'27px'} my='32px' mb='5px' />}
    <HSeparator mb='20px' mt='10px' />
    </Flex>
  );
}

export default SidebarBrand;
