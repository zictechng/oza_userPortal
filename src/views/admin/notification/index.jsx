import { 
    Box, 
    Grid, 
    Button, 
    Flex,
    Spinner
} from "@chakra-ui/react";
  
  // Custom components
  import NotificationForm from "views/admin/notification/NotificationList";
  // Assets
  import React, {useEffect} from "react";
  import { useSelector, useDispatch } from 'react-redux';
  import { getNotificationHistory, clearNotifications, setPage, resetPage } from "storeMtg/notificationSlice";
  
  export default function Overview() {
    const dispatch = useDispatch();
    const { user, userToken } = useSelector((state) => state.authUser);
    //const { notificationData } = useSelector((state) => state.notifications);

    const {
        notificationData,
        currentPage,
        totalPages,
        paginationStatus,
        initialLoading,
        paginationLoading,
      } = useSelector((state) => state.notifications);

      // Fetch history data on load and when currentPage changes
        useEffect(() => {
          if (user?.userData?._id && userToken) {
            dispatch(
              getNotificationHistory({
                userID: user.userData._id,
                user_token: userToken,
                page: currentPage,
                pageSize: 10,
              })
            );
          }
        }, [dispatch, user, userToken, currentPage]);
       // Handle page change
        const handlePageChange = (newPage) => {
          if (newPage > 0 && newPage <= totalPages) {
            dispatch(setPage(newPage)); // Update page in Redux store
          }
        };

  // this will reset the page to start from page 1 when it first loads
        useEffect(() => {
          return () => {
            dispatch(clearNotifications());
            dispatch(resetPage());
          };
        }, [dispatch]);

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
              
          <Box position="relative" mt="10px">
              {initialLoading && (
                <Flex
                  position="fixed"
                  top={0}
                  left={0}
                  width="100%"
                  height="100vh"
                  bg="rgba(255, 255, 255, 0.8)"
                  justify="center"
                  align="center"
                  zIndex={10}>
                  <Spinner size="lg" />
              </Flex>
              )}
          
              {paginationLoading && !initialLoading && (
              <Flex
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100vh"
                bg="rgba(255, 255, 255, 0.8)"
                justify="center"
                align="center"
                zIndex={10}>
                <Spinner size="lg" />
              </Flex>
              )}
              <NotificationForm
                receivedData={notificationData}
                action={handlePageChange}
                currentPage={currentPage}
                paginationStatus={paginationStatus}
                totalPages={totalPages}
                paginationLoading={paginationLoading}
                initialLoading={initialLoading}
                minH={{ base: "auto", lg: "220px", "2xl": "165px" }}
                pe='20px'
                pb={{ base: "100px", lg: "20px" }}
              />
          </Box>
            
              
        </Box>
         
      </Box>
    );
  }
  