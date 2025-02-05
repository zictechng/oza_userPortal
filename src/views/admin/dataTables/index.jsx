import { Box, SimpleGrid } from "@chakra-ui/react";
import DevelopmentTable from "views/admin/dataTables/components/TransactionTable";

import React from "react";

export default function Settings() {
  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px", lg:'100px' }}>
      <SimpleGrid
        mb='20px'
        columns={{ base: 1, md: 1, lg: 1}}
        spacing={{ base: "20px", xl: "20px", md:'20px', lg:'20px' }}>
        <DevelopmentTable/>
        
      </SimpleGrid>
    </Box>
  );
}
