// Chakra imports
import React, { useEffect, useState} from "react";
import {
  Box,
  Button, 
  Flex,
  FormLabel,
  Icon,
  SimpleGrid,
  Spinner,
  useColorModeValue,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription, 
  useDisclosure,
  CloseButton
} from "@chakra-ui/react";
// Assets
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import {
  MdArrowDownward,
  MdBarChart,
} from "react-icons/md";
import ComplexTable from "views/admin/default/components/ComplexTable";
import PieCard from "views/admin/default/components/PieCard";
import {
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";
import Banner from "../marketplace/components/Banner";
import { AddIcon, WarningIcon } from "@chakra-ui/icons";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DollarValueFormat } from "components/DollarFormat";
import { NairaValueFormat } from "components/NairaFormat";
import { getPendingBonus, resetState } from "storeMtg/pendingBonusSlice";


export default function UserReports() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { user, userToken} = useSelector((state) => state.authUser)
  const { data, dataLoading } = useSelector((state) => state.pendingBonus);
  const [regStage, setRegStage] = useState(false);
 
  
  // Chakra Color Mode
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  const fundAccountRedirect = () =>{
    navigate('/user/fund-account');
  }
  const withdrawRedirect = () =>{
    navigate('/user/withdraw');
  }
  const ProfileRedirect = () =>{
    navigate('/user/signup-process');
  }
  const {
      isOpen: isVisible,
      onClose,
      onOpen,
    } = useDisclosure({ defaultIsOpen: true })

  // useEffect(() => {
  //     // get current user details
  // const userData={
  //   'tag_id': user.userData?.tag_id,
  //   'user_token': user.userData.userToken,
  // }
  //   dispatch(getPendingBonus(userData)).then((response)=>{
  //     console.log("Record ", response.payload);
      
  //     if(response.payload?.status === 401){
  //       setErrors(true)
  //       setErrorMessages("Pending Bonus Data")
  //      }
  //     else if(response.payload?.msg ==='201'){
  //       setPendBonus(response.payload.data)
  //     }
  //     else{
  //       setErrors(true)
  //       setErrorMessages(response.payload?.message)
  //     }
  //   })
  //   }, [dispatch, user.userData?.tag_id, user.userData.userToken])

  useEffect(() => {
    checkRegistrationSteps();
    const requestData = {
      tag_id: user.userData?.tag_id,
      user_token: userToken,
      endpoint: "", // Optional: specify a custom endpoint
      
    };
    dispatch(getPendingBonus(requestData));
    // Cleanup function to reset state
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  const checkRegistrationSteps = () =>{
    if ( user.userData.reg_stage1 === "Yes"
        && user.userData.reg_stage2 === "" 
        && user.userData.reg_stage3 === "" 
        && user.userData.reg_stage4 === "" 
        && user.userData.reg_stage5 ===""
        && user.userData.reg_stage6 === ""
      )
      {
        setRegStage(true)
      }
else if ( user.userData.reg_stage1 === "Yes" 
        && user.userData.reg_stage2 === "Yes"
        && user.userData.reg_stage3 === "" 
        && user.userData.reg_stage4 === "" 
        && user.userData.reg_stage5 ===""
        && user.userData.reg_stage6 === ""
      )
      {
        setRegStage(true)
      }
else if ( 
        user.userData.reg_stage1 === "Yes" 
        && user.userData.reg_stage2 === "Yes"
        && user.userData.reg_stage3 === "Yes" 
        && user.userData.reg_stage4 === "" 
        && user.userData.reg_stage5 ===""
        && user.userData.reg_stage6 === ""
      )
      {
        setRegStage(true)
      }
else if (user.userData.reg_stage1 === "Yes" 
        && user.userData.reg_stage2 === "Yes"
        && user.userData.reg_stage3 === "Yes" 
        && user.userData.reg_stage4 === "Yes" 
        && user.userData.reg_stage5 ===""
        && user.userData.reg_stage6 === ""
      )
      {
        setRegStage(true)
      }
else if (
        user.userData.reg_stage1 === "Yes" 
        && user.userData.reg_stage2 === "Yes" 
        && user.userData.reg_stage3 === "Yes" 
        && user.userData.reg_stage4 === "Yes" 
        && user.userData.reg_stage5 ==="Yes" 
        && user.userData.reg_stage6 === ""
       )
      {
        setRegStage(true)
      }
      else if(user.userData.reg_stage1 === "Yes" 
        && user.userData.reg_stage2 === "Yes" 
        && user.userData.reg_stage3 === "Yes" 
        && user.userData.reg_stage4 === "Yes" 
        && user.userData.reg_stage5 ==="Yes" 
        && user.userData.reg_stage6 === "Yes"
      )
      {
        setRegStage(false)
      }
  }

 // console.log('Bonus Data ', data);
  return (
    <Box pt={{ base: "100px", sm:'100px', md: "80px", xl: "80px" }}>
      {/* <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='Earnings'
          value='$350.4'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name='Spend this month'
          value='$642.39'
        />
        <MiniStatistics growth='+23%' name='Sales' value='$574.34' />
        <MiniStatistics
          endContent={
            <Flex me='-16px' mt='10px'>
              <FormLabel htmlFor='balance'>
                <Avatar src={Usa} />
              </FormLabel>
              <Select
                id='balance'
                variant='mini'
                mt='5px'
                me='0px'
                defaultValue='usd'>
                <option value='usd'>USD</option>
                <option value='eur'>EUR</option>
                <option value='gba'>GBA</option>
              </Select>
            </Flex>
          }
          name='Your balance'
          value='$1,000'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
              icon={<Icon w='28px' h='28px' as={MdAddTask} color='white' />}
            />
          }
          name='New Tasks'
          value='154'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name='Total Projects'
          value='2935'
        />
      </SimpleGrid> */}

      {/* <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <Banner />
        <WeeklyRevenue />
      </SimpleGrid> */}
        
        <Flex
          flexDirection='column' gap='20px' mb='40px'
          gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}>
          <Banner />
         
         </Flex>

        <Flex direction="column" px={{ base: "15px", md: "30px", lg: "60px" }}>
          <SimpleGrid
            columns={{ base: 1, sm: 1, md: 2, lg: 2, xl: 4 }} // Limit to 3-4 columns on larger screens
            gap={{ base: "20px", sm: "30px", md: "40px", lg: "60px", xl: "80px" }} // Increase gap for larger screens
            mb="40px"
            mt="40px"
          >
            <MiniStatistics
              startContent={
                <IconBox
                  w={{ base: "48px", md: "56px" }}
                  h={{ base: "48px", md: "56px" }}
                  bg={boxBg}
                  icon={
                    <Icon w={{ base: "24px", md: "32px" }} h={{ base: "24px", md: "32px" }} as={MdBarChart} color="#7f8cda" />
                  }
                />
              }
              name="All Time Transactions"
              value={<DollarValueFormat value={user.userData?.tran_account ? user.userData.tran_account :'0.0'} />}
              p={{ base: "10px", md: "15px", lg: "20px" }}
              m={{ base: "5px", md: "10px", lg: "15px" }}
            />
            <MiniStatistics
              endContent={
                <Flex me={{ base: "-10px", md: "-16px" }} mt={{ base: "5px", md: "10px" }}>
                  <FormLabel htmlFor="balance" m="0">
                    <Button
                      color="#aaa"
                      variant="outline"
                      _hover={{ bg: "#5363CE", color: "white" }}
                      size="sm"
                      gap={2}
                      onClick={fundAccountRedirect}
                    >
                      Fund <AddIcon />
                    </Button>
                  </FormLabel>
                </Flex>
              }
              name="Funding Account"
              value={<NairaValueFormat value={user.userData?.amount ? user.userData.amount: '0.0'} />}
              p={{ base: "10px", md: "15px", lg: "20px" }}
              m={{ base: "5px", md: "10px", lg: "15px" }}
            />
            <MiniStatistics
              name="Account"
              value={<DollarValueFormat value={user.userData?.all_bonus_acct ? user.userData.all_bonus_acct:'0.0'} />}
              endContent={
                <Flex me={{ base: "-10px", md: "-16px" }} mt={{ base: "5px", md: "10px" }}>
                  <FormLabel htmlFor="balance" m="0">
                    <Button
                      color="#aaa"
                      variant="outline"
                      _hover={{ bg: "#5363CE", color: "white" }}
                      size="sm"
                      onClick={withdrawRedirect}
                    >
                      Withdraw <MdArrowDownward />
                    </Button>
                  </FormLabel>
                </Flex>
              }
              p={{ base: "10px", md: "15px", lg: "20px" }}
              m={{ base: "5px", md: "10px", lg: "15px" }}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w={{ base: "48px", md: "56px" }}
                  h={{ base: "48px", md: "56px" }}
                  bg={boxBg}
                  icon={
                    <Icon w={{ base: "24px", md: "32px" }} h={{ base: "24px", md: "32px" }} as={WarningIcon} color="#7f8cda" />
                  }
                />
              }
              name="Pending Account"
              value={dataLoading? <img src={require('assets/images/loading2.gif')} alt="loader_icon" width={'80px'} height={'20px'} />:<DollarValueFormat value={data?.feedbackBonus? data.feedbackBonus : '0.0'}/>}
              p={{ base: "10px", md: "15px", lg: "20px" }}
              m={{ base: "5px", md: "10px", lg: "15px" }}
            />
          </SimpleGrid>

            {/* Complete account registration */}
            
          {regStage && isVisible ?
          <Alert 
            status="info"
            mb={10}
            borderRadius={15}
            position="relative"
          >
            <AlertIcon />
            <Box flex="1">
              <AlertTitle mt={4} mb={1} fontSize='22px' textAlign={{ base: "center", md: "left" }}>
                Incomplete profile registration
              </AlertTitle>
              
              <Flex 
                justify={{ base: "center", md: "space-between" }} 
                align="center" 
                direction={{ base: "column", md: "row" }}
                textAlign={{ base: "center", md: "left" }}
                >
                <AlertDescription fontSize={{ base: "sm", md: "md" }}>
                  Complete your profile registration to remove restrictions in your account.
                </AlertDescription>
                
                <Button
                  bg='white'
                  color='black'
                  _hover={{ bg: "whiteAlpha.900" }}
                  _active={{ bg: "white" }}
                  _focus={{ bg: "white" }}
                  fontWeight='500'
                  fontSize={{ base: '12px', md: '14px' }}
                  py={{ base: '15px', md: '20px' }}
                  px={{ base: '15px', md: '20px' }}
                  mt={{ base: 3, md: 0 }}
                  onClick={ProfileRedirect}>
                  Complete
                </Button>
              </Flex>
            </Box>
            <CloseButton position="absolute" right="8px" top="8px"
              onClick={onClose} />
          </Alert>
          :''
          }
        </Flex>

      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px' mt='30px'>
          <SimpleGrid columns={{ base: 1, md: 3, xl: 2 }} gap='20px'>
          {/* <DailyTraffic /> */}
          <PieCard />
        </SimpleGrid>
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
        
      </SimpleGrid>
      {/* <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <Tasks />
          <MiniCalendar h='100%' minW='100%' selectRange={false} />
        </SimpleGrid>
      </SimpleGrid> */}
    </Box>
  );
}
