// Chakra imports
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
    Flex,
    Text,
    Box,
    Button,
    Spinner,
    Icon
  } from "@chakra-ui/react";
  // Custom components
  import Card from "components/card/Card.js";
  import React from "react";
  import moment from 'moment';
  
  // Assets
  
  export default function NotificationList(props) {
    const {receivedData, action, currentPage, paginationStatus, totalPages, paginationLoading, initialLoading} = props;


    console.log("I got this ", receivedData)
    return (
      <Card mb='20px' p='20px'>
        
        <Flex px="3px" mb="8px" justifyContent="space-between" align="center">
          <Text
          fontSize={{ sm: '14px', lg: '16px'}}
          py={1.5}
          color="gray.400">
          Notifications
          </Text>
      </Flex>
          {totalPages > 1 && 
          <Flex justify="flex-end" align="center" mr="8px" ml="8px" gap="8px">
            {!initialLoading ? 
            <>
            <Button
              onClick={() => action(currentPage - 1)}
              disabled={currentPage === 1 || paginationStatus === 'loading'}
            >
              <Box as={ChevronLeftIcon} boxSize="20px" color="#222" />
            </Button>
            <Text>Page {currentPage} of {totalPages}</Text>
            <Button
              onClick={() => action(currentPage + 1)}
              disabled={currentPage === totalPages || paginationStatus === 'loading'}
            >
              <Box as={ChevronRightIcon} boxSize="20px" color="#222" />
            </Button>
            </> :''} 
            
          </Flex>
          }
        {receivedData?.map((data) =>(
        <Box
        backgroundColor={'#FBFBFB'}
        opacity={6}
        borderRadius={5}
        mb={5}
        mt={15}>
        <Flex justifyContent='flex-start'alignItems='flex-start' ml={3}>
            <Text fontSize={{ sm: '14px', lg: '16px'}}
                py={1.5}
                color="gray.600">
                {data?.alert_name}
            </Text>
         </Flex>

        <Flex justifyContent='flex-start'alignItems='flex-start' ml={3}>
           
            <Text fontSize={{ sm: '14px', lg: '16px'}}
                py={1.5}
                color="gray.600">
                  {data?.alert_nature}
            </Text>
        </Flex>
        <Flex justifyContent='flex-end'alignItems='flex-end'>
            <Text fontSize={{ sm: '14px', lg: '16px'}}
                py={1.5}
                color="gray.400"
                mr={5}>
                {moment(data?.alert_date).format("YYYY/MM/DD hh:mm:ss")}
            </Text>
        </Flex>
        </Box>
        ))}
        {/* Pagination controls */}
          {totalPages > 1 ? 
            <Flex justify="space-between" mt={4} mr='8px' ml='8px'>
              <Button
                onClick={() => action(currentPage - 1)}
                disabled={currentPage === 1 || paginationStatus === 'loading'}
              >
                Previous
              </Button>
              <Text>
                {!paginationLoading && !initialLoading ? 'Page '+currentPage +' of ' +totalPages  :''} 
                {paginationLoading && totalPages > 1 ? <Spinner boxSize="30px" speed="0.65s" color="255, 255, 255, 0.8" /> : ''}
              </Text>
                <Button
                onClick={() => action(currentPage + 1)}
                disabled={currentPage === totalPages || paginationStatus === 'loading'}
                >
                Next
              </Button>
            </Flex>
            :''}
        {/* <Alert
        backgroundColor={'#FBFBFB'}
        opacity={6}
        borderRadius={5}
        mb={5}
        mt={15}>
        <AlertDescription maxWidth="sm">
        <AlertTitle>Ken Sent</AlertTitle>
        Share your ID with your friends both earn $20
        <Text  fontSize={{ sm: '14px', lg: '16px'}}
            justifyContent='flex-end'
            alignItems='flex-end'
          py={1.5}
          color="gray.400">date</Text>
        </AlertDescription>
            
        </Alert>
        */}
      </Card>
    );
  }
  