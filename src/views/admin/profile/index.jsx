import React, { useState, useEffect } from "react";
import { 
  Box, 
  Grid, 
  Tabs,
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,  
  Alert,
  AlertTitle,
  AlertDescription, 
  Button, 
  Flex,
  Stack,
  Progress,
  Spinner,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Avatar,
  useClipboard 
} from "@chakra-ui/react";

// Custom components
import Banner from "views/admin/profile/components/Banner";
// Assets
import banner from "assets/images/bg_cover.jpg";
import avatar from "assets/images/default_profile.png";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileDataCard from "./components/ProfileDataCare";
import { getUserBankDetails, resetBankDetailsState } from "storeMtg/userBankDetailsSlice";
import moment from 'moment';
import { fetchReferral, setPage } from "storeMtg/getReferralSlice";
import { fetchDocument, setDocPage } from "storeMtg/getDocumentUploadSlice";
import { getCompanyBankInfo } from "storeMtg/getCompanyBankInfoSlice";
import { getExchangeRate } from "storeMtg/exchangeRateSlice";

export default function Overview() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const {user, userToken} = useSelector((state) => state.authUser)
  const {userBankInfo, dLoading, errorMessage} = useSelector((state) => state.bankDetails)
  const {referralData, paginationLoading, currentPage,totalPages,paginationStatus,
    initialLoading,} = useSelector((state) => state.referral)

  const {documentData, documentLoading, docCurrentPage,docTotalPages,docPaginationStatus,
    docInitialLoading,} = useSelector((state) => state.uploadedDocuments)

  const [userPhoto, setUserPhoto] = useState('')
  const [userBankData, setUserBankData] = useState('')
  const [regPercentage, setRegPercentage] = useState(0)
  const [bonus, setBonus] = useState('')

  const [value, setValue] = React.useState("");
  const { onCopy, hasCopied } = useClipboard(value);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  
    useEffect(() => {
      checkRegistrationSteps();

      if (user.userData?.profile_photo) {
        setUserPhoto(user.userData.profile_photo)
      }
      dispatch(getUserBankDetails()).then((response)=>{
        if(response.payload?.msg === '200'){
          setUserBankData(response.payload)
         }
        }).catch((error)=>{
          console.error('No bank data', error)
        });

      dispatch(getExchangeRate()).then((response)=>{
        setBonus(response.payload.bonus_rate)
        //console.log("bank data ", response.payload)
      }, [])
  
      
      
      // set user share ID for copying here
      setValue(`${user.appData?.app_name } is reliable for all virtual funds exchange, I use it in selling my Paypal, Payoneer and Bitcoin funds with high rate. 
              They have a good rate, start selling your funds with ${user.appData?.app_name}. 
              Use my ID ${user.userData?.tag_id} to join and get free cash back
              Visit https://ozaapp.com`)

    }, [user.userData.profile_photo])

  const ProfileRedirect = () =>{
    navigate('/user/signup-process');
  }

  useEffect(() => {
      if (user.userData?._id && userToken) {
        dispatch(
          fetchReferral({
            userID: user.userData._id,
            user_token: userToken,
            page: currentPage,
            pageSize: 5,
          })
        );
       }
    }, [dispatch, user, userToken, currentPage]);

    useEffect(() => {
      if (user.userData?._id && userToken) {
        dispatch(
          fetchDocument({
            userID: user.userData._id,
            user_token: userToken,
            page: docCurrentPage,
            pageSize: 5,
          })          
        );
        
      }
    }, [dispatch, user, userToken, docCurrentPage]);

    const checkRegistrationSteps = () =>{
            if ( user.userData.reg_stage1 === "Yes"
                && user.userData.reg_stage2 === "" 
                && user.userData.reg_stage3 === "" 
                && user.userData.reg_stage4 === "" 
                && user.userData.reg_stage5 ===""
                && user.userData.reg_stage6 === ""
              )
              {
                setRegPercentage(20)
              }
      else if ( user.userData.reg_stage1 === "Yes" 
                && user.userData.reg_stage2 === "Yes"
                && user.userData.reg_stage3 === "" 
                && user.userData.reg_stage4 === "" 
                && user.userData.reg_stage5 ===""
                && user.userData.reg_stage6 === ""
              )
              {
                setRegPercentage(35)
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
                setRegPercentage(55)
              }
      else if (user.userData.reg_stage1 === "Yes" 
                && user.userData.reg_stage2 === "Yes"
                && user.userData.reg_stage3 === "Yes" 
                && user.userData.reg_stage4 === "Yes" 
                && user.userData.reg_stage5 ===""
                && user.userData.reg_stage6 === ""
              )
              {
                setRegPercentage(75)
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
                setRegPercentage(85)
              }
              else if(user.userData.reg_stage1 === "Yes" 
                && user.userData.reg_stage2 === "Yes" 
                && user.userData.reg_stage3 === "Yes" 
                && user.userData.reg_stage4 === "Yes" 
                && user.userData.reg_stage5 ==="Yes" 
                && user.userData.reg_stage6 === "Yes"
              )
              {
              setRegPercentage(100)
              }
              
      
          }

    //console.log("pp ", regPercentage)
    //console.log("pp Data ", user)
    // Handle page change
      const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
          dispatch(setPage(newPage)); // Update page in Redux store
        }
      };

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
        <Banner
           banner={banner}
          avatar={user.userData?.profile_photo? userPhoto : avatar}
          name={user.userData?.display_name}
          job={'Tag ID: '+user.userData?.tag_id}
          alignSelf="start"
          />
        {/* <Storage
          gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
          used={25.6}
          total={50}
        /> */}
        <ProfileDataCard
          gridArea={{
            base: "3 / 1 / 2 / 2",
            lg: "1 / 2 / 2 / 4",
          }}
          alignSelf="stretch"
          minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
          pe='20px'
          pb={{ base: "100px", lg: "20px" }}
        />
      </Grid>
      <Text fontSize='16px' color='#aaa'> Account Percentage ({regPercentage})%</Text>
      {user.userData?.acct_approved_status ==='Approved' ? (
        <Progress colorScheme='green' size="sm" value={regPercentage} width={{ sm: '100%', base: "100%", lg: "30%" }} />
      ): <Progress colorScheme='yellow' size="sm" value={regPercentage} width={{ sm: '100%', base: "100%", lg: "30%" }} />}
      
        <Box mt={20} mb={10}>
        <Tabs index={selectedIndex} onChange={setSelectedIndex} variant="soft-rounded" variantColor="green">
          <TabList>
            <Tab>Bank Details</Tab>
            <Tab>Account Documents</Tab>
            <Tab>My Network</Tab>
          </TabList>
          <TabPanels>
            {/* Bank details */}
            
            <TabPanel>
            {selectedIndex === 0 && (
              <>
              {!dLoading && userBankData &&
              <Text color={textColor} mt='2px'
                fontSize="18px"
                fontWeight="700">
                  My Bank Details
              </Text>
                }
                {dLoading && <Text><Spinner color="#aaa" animationDuration="0.8s" size="lg" /> </Text>}

                {!dLoading && userBankData ?(
                <Box mt="20px" backgroundColor='#FFF' width={{ base: "100%", lg: "40%", md:'60%' }}>
                        {/* Pagination overlay loader */}
                        <Table variant="simple" color="gray.100" mt="12px">
                           <Tbody>
                              <Tr>
                              <Th borderColor={borderColor}>Account Name</Th>
                                <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                                  {userBankData?.bankDetail.bank_acct_name}
                              </Td>
                              </Tr>
                              <Tr>
                              <Th borderColor={borderColor}>Account Number</Th>
                                <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                                  {userBankData?.bankDetail.bank_acct_number}
                              </Td>
                              </Tr>
                              <Tr>
                              <Th borderColor={borderColor}>Bank Name</Th>
                                <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                                  {userBankData?.bankDetail.bank_name}
                              </Td>
                              </Tr>
                              <Tr>
                              <Th borderColor={borderColor}>Paypal Address</Th>
                                <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                                  {userBankData?.bankDetail.paypal_address}
                              </Td>
                              </Tr>
                              <Tr>
                              <Th borderColor={borderColor}>Payoneer Address</Th>
                                <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                                  {userBankData?.bankDetail.payoneer_address}
                              </Td>
                              </Tr>
                              <Tr>
                              <Th borderColor={borderColor}>Bitcoin Address</Th>
                                <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                                  {userBankData?.bankDetail.btc_address}
                              </Td>
                              </Tr>
                          </Tbody>
                        </Table>
                
                        {/* Pagination controls */}
                        
                </Box>
                ): !dLoading && 'No bank details available'}
              
              </>
              )}
            </TabPanel>
             
                {/* document uploaded */}
            
            <TabPanel>
              {selectedIndex === 1 && (
              <>
              {!docInitialLoading && documentData?.length && 
              <Text color={textColor} mt='2px'
                fontSize="18px"
                fontWeight="700">
                  My Uploaded Document Details
              </Text>
              }
              <Flex direction="column" w="100%" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
                {/* Display initial loading spinner */}
                {docInitialLoading && (
                  <Flex
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    bg="rgba(255, 255, 255, 0.8)"
                    justify="center"
                    align="center"
                    zIndex={10}
                  >
                    <Spinner size="xl" />
                  </Flex>
                )}

                {/* Content */}
                {!docInitialLoading && documentData ?(
                <Box position="relative" mt="20px" backgroundColor='#FFF' width={{ base: "100%", lg: "50%", md:'60%' }} >
                  {/* Pagination overlay loader */}
                  {documentLoading && !docInitialLoading && (
                    <Flex
                      position="absolute"
                      top={0}
                      left={0}
                      width="100%"
                      height="100%"
                      bg="rgba(255, 255, 255, 0.8)"
                      justify="center"
                      align="center"
                      zIndex={10}
                    >
                      <Spinner size="lg" />
                    </Flex>
                  )}

                  <Table variant="simple" color="gray.500" mt="12px">
                    <Thead>
                      <Tr>
                        <Th borderColor={borderColor}>Type</Th>
                        <Th borderColor={borderColor}>Status</Th>
                        <Th borderColor={borderColor}>Doc</Th>
                        <Th borderColor={borderColor}>Date</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {documentData?.map((doc) => (
                        <Tr key={doc._id}>
                          <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                            {doc.document_name}
                          </Td>
                          <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                            {doc.document_status}
                          </Td>
                          <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                            <a 
                            href={doc?.document_url} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            <Avatar
                              mx='auto'
                              src={doc?.document_url}
                              h='50px'
                              w='50px'
                              border='4px solid'
                              borderColor={borderColor}
                              cursor="pointer"
                            />
                            </a>
                          </Td>
                          <Td fontSize="sm" color={textColorSecondary} borderColor={borderColor}>
                            {moment(doc.createdOn).format('DD/MM/YYYY hh:mm:ss')}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>

                  {/* Pagination controls */}
                  <Flex justify="space-between" mt={4} mr='8px' ml='8px' mb='8px'>
                    <Button
                      onClick={() => handlePageChange(docCurrentPage - 1)}
                      disabled={docCurrentPage === 1 || docPaginationStatus === 'loading'}
                    >
                      Previous
                    </Button>
                    
                    <Button
                      onClick={() => handlePageChange(docCurrentPage + 1)}
                      disabled={docCurrentPage === docTotalPages || docPaginationStatus === 'loading'}
                    >
                      Next
                    </Button>
                  </Flex>
                </Box>
                ): !docInitialLoading && 'No document upload available'}
              </Flex>
              </>
              )}
            </TabPanel>
            
              {/* referral users details */}
            
            <TabPanel>
            {selectedIndex === 2 && (
              <>
              {!initialLoading && referralData.length && 
              <Text color={textColor} mt='2px'
                fontSize="18px"
                fontWeight="700">
                  My Referrals
              </Text>
              }
                <Flex direction="column" w="100%" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
                  {/* Display initial loading spinner */}
                  {initialLoading && (
                    <Flex
                      position="absolute"
                      top={0}
                      left={0}
                      width="100%"
                      height="100%"
                      bg="rgba(255, 255, 255, 0.8)"
                      justify="center"
                      align="center"
                      zIndex={10}
                    >
                      <Spinner size="xl" />
                    </Flex>
                  )}

                  {/* Content */}
                  {!initialLoading && referralData ?(
                  <Box position="relative" mt="20px" backgroundColor='#FFF' width={{ base: "100%", lg: "50%", md:'60%' }} >
                    {/* Pagination overlay loader */}
                    {paginationLoading && !initialLoading && (
                      <Flex
                        position="absolute"
                        top={0}
                        left={0}
                        width="100%"
                        height="100%"
                        bg="rgba(255, 255, 255, 0.8)"
                        justify="center"
                        align="center"
                        zIndex={10}
                      >
                        <Spinner size="lg" />
                      </Flex>
                    )}

                    <Table variant="simple" color="gray.500" mt="12px">
                      <Thead>
                        <Tr>
                          <Th borderColor={borderColor}>Name</Th>
                          <Th borderColor={borderColor}>Status</Th>
                          <Th borderColor={borderColor}>Date</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {referralData.map((referral) => (
                          <Tr key={referral._id}>
                            <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                              {referral.ref_userName}
                            </Td>
                            <Td fontSize="sm" color={textColor} borderColor={borderColor}>
                              {referral.ref_status}
                            </Td>
                            <Td fontSize="sm" color={textColorSecondary} borderColor={borderColor}>
                              {moment(referral.creditOn).format('DD/MM/YYYY hh:mm:ss')}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>

                    {/* Pagination controls */}
                    <Flex justify="space-between" mt={4} mr='8px' ml='8px' mb='8px'>
                      <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || paginationStatus === 'loading'}
                      >
                        Previous
                      </Button>
                      <Text>
                        Page {currentPage} of {totalPages}
                      </Text>
                      <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || paginationStatus === 'loading'}
                      >
                        Next
                      </Button>
                    </Flex>
                  </Box>
                  ): !initialLoading && 'No referral details available'}
                </Flex>
              </>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      
        </Box>
                
      {/* Share your ID */}
        <Box>
          <Alert
            status="info"
            flexDirection="column"
            justifyContent="center"
            textAlign="center"
            borderRadius={15}
            mb={5}
            mt={15}>
            <AlertDescription maxWidth="sm">
             Share your ID with your friends both earn {bonus? '$'+bonus: ''}
             
            </AlertDescription>
            <Flex align='center' mb={{ sm: "px", md: "10px",}} >
            
          <Button
            bg={'transparent'}
            size="md"
            border="2px"
            borderWidth={2}
            borderColor="#5363CE"
            _hover={{ bg: "#5363CE", color: "#fff" }}
              _active={{ bg: "#1D2667", color:'#FFF' }}
              _focus={{ bg: "#1D2667", color:'#FFF' }}
            fontWeight='500'
              fontSize='14px'
              py='20px'
              px='27'
              me='38px'
              mt={5}
              onClick={onCopy}>
            {hasCopied ? "Copied" : "Share"}
          </Button>
        </Flex>
          </Alert>
        </Box>
    </Box>
    
  );
}
