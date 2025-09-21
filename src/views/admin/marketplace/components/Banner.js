import React from "react";

// Chakra imports
import { 
  Box,
  Flex,
  Text,
  Button,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
} from "@chakra-ui/react";
import {
  MdOutlineArrowDownward,
  MdWallet,
  MdCurrencyExchange
} from "react-icons/md";

import { AddIcon} from "@chakra-ui/icons";

// Assets
import banner from "assets/img/nfts/homeBanner1.png";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export default function Banner() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const initialRef = React.useRef();
  const finalRef = React.useRef();
  const {loading, error, user} = useSelector((state) => state.authUser)

    const fundAccountRedirect = () =>{
      navigate('/user/fund-account');
    }
    const withdrawRedirect = () =>{
      navigate('/user/withdraw');
    }

    const walletRedirect = () =>{
      navigate('/user/exchange-rate');
    }

    const sellRedirect = () =>{
      navigate('/user/sales');
    }

    const buyRedirect = () =>{
      navigate('/user/buy');
    }

    //console.log('app d ', user)
  // Chakra Color Mode
  return (
    <Flex
      direction='column'
      h={{ base: "100%", md: "250px" }}
      bgImage={banner}
      bgSize='cover'
      py={{ base: "30px", md: "56px" }}
      px={{ base: "30px", md: "64px" }}
      borderRadius='30px'>
      <Text
        fontSize={{ base: "24px", md: "30px" }}
        color='white'
        mb='14px'
        maxW={{
          base: "100%",
          md: "64%",
          lg: "46%",
          xl: "70%",
          "2xl": "50%",
          "3xl": "42%",
        }}
        fontWeight='500'
        lineHeight={{ base: "32px", md: "30px" }}>
        Sell, Swap, and Buy Virtual Funds
      </Text>
      <Text
        fontSize='md'
        color='#E3DAFF'
        maxW={{
          base: "100%",
          md: "64%",
          lg: "40%",
          xl: "56%",
          "2xl": "46%",
          "3xl": "34%",
        }}
        fontWeight='500'
        mb={{ base: "32px", md: "20px" }}

        lineHeight='20px'>
       {user.appData?.app_launch_title} <p>We ensure a more profitable experience when selling your virtual funds with us at attractive rates.</p>
      </Text>
      <Flex align='center' mb={{ sm: "0px", md: "20px" }} >
        <Button
          bg='white'
          color='black'
          _hover={{ bg: "whiteAlpha.900" }}
          _active={{ bg: "white" }}
          _focus={{ bg: "white" }}
          fontWeight='500'
          fontSize='14px'
          py='20px'
          px='27'
          me='38px'
          onClick={sellRedirect}>
          Sell
        </Button>
        <Button
          bg='#7f8cda'
          color='white'
          _hover={{ bg: "rgb(93, 105, 184)" }}
          _active={{ bg: "black" }}
          _focus={{ bg: "rgb(131, 146, 240)" }}
          fontWeight='500'
          fontSize='14px'
          py='20px'
          px='27'
          me='38px'
          onClick={buyRedirect}>
          Buy
        </Button>

        <Button
          color='white'
          variant='outline'
          _hover={{ bg: "blackAlpha.300" }}
          fontWeight='500'
          fontSize='14px'
          py='20px'
          px='27'
          me='38px'
          onClick={onOpen}>
          More
        </Button>
        
        {/* <Link>
          <Text color='white' fontSize='sm' fontWeight='500'>
            More...
          </Text>
        </Link> */}
      </Flex>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>More</ModalHeader>
          <Text px={5} color={'gray.500'}>What did you want to do today? Select option to get started.</Text>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={5}>
            <Box>
          <Flex px="25px" align='center' mb={{ sm: "0px", md: "20px" }} direction='row' >
                <SimpleGrid
                        row={{ base: 1, md: 1, lg: 1, "2xl": 3 }}
                        gap={{ md: '40px', lg: '40px', base: '40px' }}
                        mb='40px'
                        mt='5px'
                        width={{base: '100%', }}
                        >
                       <Button
                        bg='#5363CE'
                        color='white'
                        _hover={{ bg: "#1D2667" }}
                        _active={{ bg: "#1D2667" }}
                        _focus={{ bg: "#5363CE" }}
                        fontWeight='500'
                        fontSize='14px'
                        py='20px'
                        px='27'
                        me='38px'
                        leftIcon={<Box as={MdCurrencyExchange} size="20px" />}
                        width={{ md: '100%', lg: '100%', base: '100%' }}
                        onClick={walletRedirect}>
                          Exchange Rates
                      </Button>
                        
                        <Button
                        bg='#5363CE'
                        color='white'
                        _hover={{ bg: "#1D2667" }}
                        _active={{ bg: "#1D2667" }}
                        _focus={{ bg: "#5363CE" }}
                        fontWeight='500'
                        fontSize='14px'
                        py='20px'
                        px='27'
                        me='38px' 
                        leftIcon={<AddIcon w='20px' h='20px'/>}
                        width={{ md: '100%', lg: '100%', base: '100%' }}
                        onClick={fundAccountRedirect}>
                        Fund Account
                        </Button>
                       
                        <Button
                            bg='#5363CE'
                            color='white'
                            _hover={{ bg: "#1D2667" }}
                            _active={{ bg: "#1D2667" }}
                            _focus={{ bg: "#5363CE" }}
                            fontWeight='500'
                            fontSize='14px'
                            py='20px'
                            px='27'
                            me='38px'
                            leftIcon={<Box as={MdOutlineArrowDownward} size="20px" />}
                            width={{md: '100%', lg: '100%', base: '100%' }}
                            onClick={withdrawRedirect}>
                            Withdraw Funds
                        </Button>
                    </SimpleGrid>
                </Flex>
      </Box>
            </FormControl>
          </ModalBody>

          {/* <ModalFooter>
            <Button mr={3} bg={'#1D2667'} color='#fff' _hover={{ bg: "#5363CE", color: "#fff" }}>
              Update
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </Flex>
  );
}
