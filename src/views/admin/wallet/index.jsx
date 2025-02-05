import { 
    Box, 
    Grid, 
    Tabs,
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel,
    Button, 
    Flex,
    FormLabel,
    Icon,
    SimpleGrid,
    useColorModeValue
} from "@chakra-ui/react";
  
  // Custom components
  import WalletBanner from "views/admin/wallet/WalletBanner";
  import WalletTable from "views/admin/wallet/WalletTable";
  import WalletMiniStatistics from "views/admin/wallet/WalletMiniStatistics";
  import IconBox from "components/icons/IconBox";
  import {
    MdBarChart,
  } from "react-icons/md";
  
  // Assets
  import banner from "assets/images/bg_wallet.png";
  import avatar from "assets/images/wallet_logg.png";
  import { AddIcon } from "@chakra-ui/icons";
  import React from "react";
  
  export default function Wallet() {
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
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
          <WalletBanner
            banner={banner}
            avatar={avatar}
            name='Adela Parkson'
            job='ID: 9900987'
            posts='17'
            followers='9.7k'
            following='274'
          />

          <WalletTable
            minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
            pe='20px'
            pb={{ base: "100px", lg: "20px" }}
          />
        </Grid>
        <Flex>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
              gap={{ md: '345px', lg: '345px', sm: '40px' }}
              mb='40px'
              mt='40px'>
            <WalletMiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={'#5363CE'} />
              }
            />
          }
          name='All Time'
          value='$350.4'
        />
        <WalletMiniStatistics 
          endContent={
            <Flex me='-16px' mt='10px'>
              <FormLabel htmlFor='balance'>
              <Button color="#aaa" variant="outline" _hover={{ bg: "#5363CE", color:'white'}} size={'sm'} gap={2}
              onClick={''}>
                Fund  <AddIcon />
              </Button>
              </FormLabel>
              
            </Flex>
          }
          name='Funding Balance'
          value='₦642.39'
        />
        <WalletMiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={'#5363CE'} />
              }
            />
          }
          name='All Time'
          value='$350.4'
        />
        
        </SimpleGrid>
      </Flex>
          <Box mt={20}>
          <Tabs variant="soft-rounded" variantColor="green">
            <TabList>
              <Tab>Bank Details</Tab>
              <Tab>Account Documents</Tab>
              <Tab>My Network</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <p>Show bank details here</p>
              </TabPanel>
              <TabPanel>
                <p>show user documents details here</p>
              </TabPanel>
              <TabPanel>
                <p>show my referral details here</p>
              </TabPanel>
            </TabPanels>
        </Tabs>
          </Box>
  
      </Box>
    );
  }
  