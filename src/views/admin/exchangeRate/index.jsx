import React from 'react';

// Chakra imports
import {
  Box,
  Flex,
  Grid,
  Alert,
  AlertIcon,
  AccordionItem,
  AccordionIcon,
  AccordionPanel,
  Accordion,
  AccordionButton,
} from '@chakra-ui/react';

// Custom components
import ExchangeCard from './SellExchangeCard';
import BuyCard from './BuyExchangeCard';

// Assets
export default function ExchangeRate() {
  return (
    <Box pt={{ base: '80px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
        gap={{ base: '20px', xl: '20px' }}
        display={{ base: 'block', xl: 'grid' }}
      >
        <Flex flexDirection="column">
          <Flex direction="column">
            <Alert status="info" mb={4} fontSize={20} borderRadius={15}>
              <AlertIcon />
              Exchange Rate
            </Alert>
          </Flex>

          <Flex direction="column">
            <Box
              p={5}
              shadow="md"
              borderWidth="1px"
              mb={10}
              ml={2}
              mr={2}
              bg="white"
              borderRadius="15"
            >
              <Box width={{ base: '100%', lg: '100%' }}>
                <Accordion allowToggle>
                  <AccordionItem>
                    <AccordionButton
                      _expanded={{ bg: '#1D2667', color: 'white' }}
                    >
                      <Box
                        flex="1"
                        textAlign="left"
                        fontSize={{ base: '20px', lg: '18px' }}
                      >
                        Sell Rate
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                      <ExchangeCard />
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
            </Box>
          </Flex>

          <Flex direction="column">
            <Box
              p={5}
              shadow="md"
              borderWidth="1px"
              mb={10}
              ml={2}
              mr={2}
              bg="white"
              borderRadius="15"
            >
              <Box width={{ base: '100%', lg: '100%' }}>
                <Accordion allowToggle>
                  <AccordionItem>
                    <AccordionButton
                      _expanded={{ bg: '#1D2667', color: 'white' }}
                    >
                      <Box
                        flex="1"
                        textAlign="left"
                        fontSize={{ base: '20px', lg: '18px' }}
                      >
                        Buy Rate
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                      <BuyCard />
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
            </Box>
          </Flex>
        </Flex>

        <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}
        ></Flex>
      </Grid>
      {/* Delete Product */}
    </Box>
  );
}
