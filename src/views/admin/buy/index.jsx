import { 
    Box, 
    Grid
  } from "@chakra-ui/react";
  
  // Custom components
  import BuyForm from "views/admin/buy/BuyForm";
  
  // Assets
  import React from "react";
  
  export default function Buy() {
    return (
      <Box pt={{ base: "100px", md: "80px", xl: "80px" }}>
        {/* Main Fields */}
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "1fr 1fr 1.32fr",
          }}
          templateRows={{
            base: "repeat(2, 1fr)",
            lg: "1fr",
          }}
          gap={{ base: "20px", xl: "20px" }}>
         
        </Grid>
  
        <Box width={{ base: "100%", lg: "70%", md:'70%' }}>
        <BuyForm
           minH={{ base: "auto", lg: "220px", "2xl": "165px" }}
            pe='20px'
            pb={{ base: "100px", lg: "20px" }}
          />
        </Box>
         
    </Box>
    );
  }
  