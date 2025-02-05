import {
  Button,
  Flex,
  Link,
  Text,
  useColorModeValue,
  useClipboard
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getExchangeRate } from "storeMtg/exchangeRateSlice";

export default function SidebarDocs() {
  const dispatch = useDispatch()
  const bgColor = "linear-gradient(135deg, #1D2667 0%, #5363CE 100%)";
  const borderColor = useColorModeValue("white", "#5363CE.800");
  const {user, userToken} = useSelector((state) => state.authUser)
   const [value, setValue] = React.useState("");
   const { onCopy, hasCopied } = useClipboard(value);
  

  const [bonus, setBonus] = useState('')

  useEffect(() => {
      dispatch(getExchangeRate()).then((response)=>{
          setBonus(response.payload.bonus_rate)
          //console.log("bank data ", response.payload)
        }, [])
        // set user share ID for copying here
        setValue(`${user.appData?.app_name } is reliable for all virtual funds exchange, I use it in selling my Paypal, Payoneer and Bitcoin funds with high rate. 
                They have a good rate, start selling your funds with ${user.appData?.app_name}. 
                Use my ID ${user.userData?.tag_id} to join and get free cash back
                Visit https://ozaapp.com`)
  
      }, [user.userData?.tag_id])

  return (
    <Flex
      justify='center'
      direction='column'
      align='center'
      bg={bgColor}
      borderRadius='30px'
      position='relative'>
      <Flex
        border='5px solid'
        borderColor={borderColor}
        bg='linear-gradient(135deg, #1D2667 0%, #5363CE 100%)'
        borderRadius='20%'
        w='85px'
        h='85px'
        align='center'
        justify='center'
        mx='auto'
        position='absolute'
        left='50%'
        top='-35px'
        transform='translate(-50%, 0%)'>
        <img src="../../assets/images/shareme.png" alt="gift_logo" width={'85px'} height={'27px'} my='32px' />
       
      </Flex>
      <Flex
        direction='column'
        mb='12px'
        align='center'
        justify='center'
        px='15px'
        pt='55px'>
        <Text
          fontSize={{ base: "lg", xl: "18px" }}
          color='white'
          fontWeight='bold'
          lineHeight='150%'
          textAlign='center'
          px='10px'
          mt="10px"
          mb='6px'>
          Invite a friend
        </Text>
        <Text
          fontSize='14px'
          color={"white"}
          fontWeight='500'
          px='10px'
          mb='6px'
          textAlign='center'>
          Share your link to invite your friends both get {bonus? '$'+bonus: ''} credited to your account directly.
        </Text>
      </Flex>
      <Link href='#'>
        <Button
          bg='whiteAlpha.300'
          _hover={{ bg: "whiteAlpha.200" }}
          _active={{ bg: "whiteAlpha.100" }}
          mb={{ sm: "16px", xl: "24px" }}
          color={"white"}
          fontWeight='regular'
          fontSize='sm'
          minW='185px'
          mx='auto'
          onClick={onCopy}>
            {hasCopied ? "Copied" : "Share"}
        </Button>
      </Link>
    </Flex>
  );
}
