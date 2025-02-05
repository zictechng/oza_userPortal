import { 
    Box, 
    Card,
    Grid, 
    AlertDescription, 
    Alert, 
    Button, 
    Flex,
    Tabs,
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel,
    AlertTitle,
    Text
    } 
    from "@chakra-ui/react";
  
  // Custom components
  import CompleteForm from "views/admin/completeProfile/CompleteProfileForm";
  
  // Assets
  import React from "react";
  
  export default function Overview() {
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
        <CompleteForm
           minH={{ base: "auto", lg: "220px", "2xl": "165px" }}
            pe='20px'
            pb={{ base: "100px", lg: "20px" }}
          />
        </Box>

        
          <Box mt={35}>
            <Alert
              status="info"
              flexDirection="column"
              justifyContent="center"
              textAlign="center"
              borderRadius={15}
              mb={5}
              mt={15}>
              <AlertDescription maxWidth="sm">
               Share your ID with your friends both earn $20
              </AlertDescription>
              <Flex align='center' mb={{ sm: "px", md: "10px",}} >
            <Button
              bg={'transparent'}
              size="md"
              border="2px"
              borderWidth={2}
              borderColor="#5363CE"
              _hover={{ bg: "#5363CE", color: "#fff" }}
                _active={{ bg: "white" }}
                _focus={{ bg: "white" }}
              fontWeight='500'
                fontSize='14px'
                py='20px'
                px='27'
                me='38px'
                mt={5}>
              Share
            </Button>
          </Flex>
            </Alert>
        </Box>



        <Card  mb='20px' p='20px' width={{ base: "100%", lg: "70%", md:'70%' }} mt='40px'>
        
        <Tabs variant="soft-rounded" variantColor="green">
          <TabList>
            <Tab>Upload Profile Photo</Tab>
            <Tab>Upload Document ID</Tab>
            <Tab>Proof Ownership</Tab>
            <Tab>Proof of Address</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <p>Upload Profile Photo details here</p>
            </TabPanel>
            <TabPanel>
              <p>Upload documents ID details here</p>
            </TabPanel>
            <TabPanel>
              <p>show Ownership details here</p>
            </TabPanel>
            <TabPanel>
              <p>Proof of Address here</p>
            </TabPanel>
          </TabPanels>
      </Tabs>
    </Card>
      </Box>
    );
  }
  