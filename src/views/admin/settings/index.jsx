import React from "react";

// Chakra imports
import {
  Box,
  Flex,
  Grid,
} from "@chakra-ui/react";

// Custom components
import Card from "components/card/Card.js";
import SettingForm from "views/admin/settings/SettingForm"
import SettingOther from "views/admin/settings/SettingOther"

// Assets
export default function Marketplace() {
  // Chakra Color Mode
  return (
    <Box pt={{ base: "100px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        mb='20px'
        gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}>
        <Flex
          flexDirection='column'
          gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}>
          
          <Flex direction='column'>
             <Card px='0px' mb='20px'>
            <SettingForm/>
          </Card>
          </Flex>

          <Flex direction='column'>
             <Card px='0px' mb='20px'>
            <SettingOther/>
          </Card>
          </Flex>
        </Flex>
        
        <Flex
          flexDirection='column'
          gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}>
        </Flex>
      </Grid>
      {/* Delete Product */}
    </Box>
  );
}
