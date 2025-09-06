/* eslint-disable */

import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Stack,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  Input,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Icon,
  InputRightElement,
  InputGroup,
} from '@chakra-ui/react';

import React, {useState, useEffect} from 'react';
import { MdAccountCircle, MdBlock, MdLock } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { passwordUpdateData, resetMessages } from 'storeMtg/passwordUpdateSlice';
import { accountPinUpdateData, resetAccountState } from 'storeMtg/pinUpdateSlice';
import { deactivateAccountData, resetDeactivateState } from 'storeMtg/deactivateAccountSlice';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

export default function TopCreatorTable(props) {
  const { tableData } = props;
  const dispatch = useDispatch()
  const toast = useToast();
  
  const {dataLoading} = useSelector((state) => state.passwordUpdate)
  const {acctLoading,} = useSelector((state) => state.accountPin)
  const {deleteLoading,} = useSelector((state) => state.deactivateAccount)

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = "gray.400";
  const [errors, setErrors] = useState(false);
  const [errorMessages, setErrorMessages] = useState("");
  const [newPin, setNewPin] = useState('');

  const [passFormData, setPassFormData] = useState({
    password: '',
    confirm_password: '',
  });

  const handlePassChange = (e) => {
    const { name, value } = e.target;
    setPassFormData({
      ...passFormData,
      [name]: value,
    });
  };

  // show pass visibility in the form
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const handleClickCOnfirm = () => setShowConfirm(!showConfirm);

  // password update function here
  const handlePassSubmit = () => {
     if(passFormData.password === undefined || passFormData.password ==='')
    {
      setErrors(true)
      setErrorMessages("Password Required")
      return false
    }
    if(passFormData.confirm_password === undefined || passFormData.confirm_password ==='')
    {
      setErrors(true)
      setErrorMessages("Confirm Password Required")
      return
    }
    else if(passFormData.confirm_password !== passFormData.password)
      {
        setErrors(true)
        setErrorMessages("Confirm Password do not match, try again")
        return
      }
      else{
        dispatch(passwordUpdateData(passFormData))
      .then((result) => {
        if (result.meta.requestStatus === 'fulfilled' || result.payload.msg ==='201') {
          onCloseRevocationModal()
          // Success case
          // reset global state
          dispatch(resetMessages());
          // reset input fields
            setPassFormData({
              password: '',
              confirm_password: '',
            });
            // show success message
            toast({
              title: "Success!",
              description: "Password updated successfully.",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
        } else {
          // Failure case
            console.error('Error:', result.payload || 'Something went wrong');
            toast({
              title: "error!",
              description: "Something went wrong, try again.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
        }
      })
      .catch((error) => {
        console.error('Unexpected error:', error);
      });
      }

    
  };

  // account pin update function here
  const handleAccountPinSubmit = () => {
    if(newPin === undefined || newPin ==='')
   {
     setErrors(true)
     setErrorMessages("New Pin Required")
     return false
   } else{
       dispatch(accountPinUpdateData({pin: newPin}))
     .then((result) => {
       if (result.meta.requestStatus === 'fulfilled' || result.payload.msg ==='201') {
        onCloseRevocationModalAcct()
         // Success case
         //console.log('Success:', result.payload);
         // reset global state
         dispatch(resetAccountState());
         // reset input fields
          setNewPin('')
           // show success message
           toast({
             title: "Success!",
             description: "Pin updated successfully.",
             status: "success",
             duration: 5000,
             isClosable: true,
             position: "top",
           });
       } else {
         // Failure case
           console.error('Error:', result.payload || 'Something went wrong');
           toast({
             title: "error!",
             description: "Something went wrong, try again.",
             status: "error",
             duration: 5000,
             isClosable: true,
             position: "top",
           });
       }
     })
     .catch((error) => {
       console.error('Unexpected error:', error);
     });
     }
  };

  // account pin update function here
  const handleDeactivateAccountSubmit = () => {
     dispatch(deactivateAccountData())
     .then((result) => {
       if (result.meta.requestStatus === 'fulfilled' || result.payload.msg ==='200') {
        onCloseAccount()
         //console.log('Success:', result.payload);
         // reset global state
         dispatch(resetDeactivateState());
           // show success message
           toast({
             title: "Success!",
             description: "Your account has been deactivated successfully.",
             status: "success",
             duration: 5000,
             isClosable: true,
             position: "top",
           });
       } else {
         // Failure case
           console.error('Error:', result.payload || 'Something went wrong');
           toast({
             title: "error!",
             description: "Something went wrong, try again.",
             status: "error",
             duration: 5000,
             isClosable: true,
             position: "top",
           });
       }
     })
     .catch((error) => {
       console.error('Unexpected error:', error);
     });
  };

  // reset account pin state
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Reset password modal state
  const {
    isOpen: isRevocationModalOpen,
    onOpen: onOpenRevocationModal,
    onClose: onCloseRevocationModal,
  } = useDisclosure();

// disable account profile sate
  const {
    isOpen: isCloseAccountOpen,
    onOpen: onOpenCloseAccount,
    onClose: onCloseAccount,
  } = useDisclosure();

  // Account Pin Reset account state
  const {
    isOpen: isRevocationModalOpenAcct,
    onOpen: onOpenRevocationModalAcct,
    onClose: onCloseRevocationModalAcct,
  } = useDisclosure();

  // const initialRef = React.useRef();
  // const finalRef = React.useRef();

  const initialRefPass = React.useRef();
  const finalRefPass = React.useRef();

  const cancelRef = React.useRef()

  const initialRefPassAcct = React.useRef();
  const finalRefPassAcct = React.useRef();

  
  return (
    <Flex
      direction="column"
      w="100%"
      overflowX={{ lg: 'hidden' }}
    >
      <Flex
        align={{ sm: 'flex-start', lg: 'center' }}
        justify="space-between"
        w="100%"
        px="22px"
        pb="20px"
        mb="10px"
        boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)"
      >
        <Text color={textColor} fontSize="xl" fontWeight="600">
         Others
        </Text>
        {/* <Button variant="action">See all</Button> */}
      </Flex>
        <Box ml={5}>
            <Stack isInline 
              fontSize="sm"
              mb="20px">
                <MdLock size={25} color='#aaa'/>
                <FormLabel><Link to='#' onClick={onOpenRevocationModal}>Reset Password</Link></FormLabel>
                
            </Stack>
            <Stack isInline
                fontSize="sm"
                mb="20px">
                <MdAccountCircle size={25} color='#aaa'/>
                <FormLabel><Link to='#' onClick={onOpenRevocationModalAcct}>Account Pin</Link></FormLabel>
           </Stack>
            
            <Stack isInline>
                <MdBlock size={25} color='#aaa'/>
                <FormLabel><Link to='#' onClick={onOpenCloseAccount}>Block Account </Link></FormLabel>
             </Stack>
      </Box>

        {/* Account Pin Update Modal  */}
      <Modal
        initialFocusRef={initialRefPassAcct}
        finalFocusRef={finalRefPassAcct}
        isOpen={isRevocationModalOpenAcct}
        onClose={onClose}
        >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset Pin</ModalHeader>
          <Text px={5} color={'gray.500'}>We recommend you update your account pin regularly and do not share it with any one</Text>
              {errors &&  
                <Alert status="error" mt={2}>
                    <AlertIcon />
                    <AlertTitle mr={2}>
                      Error!
                    </AlertTitle>
                  <AlertDescription>
                      {errorMessages}
                  </AlertDescription>
                  
                  <CloseButton position="absolute" right="8px" top="8px" onClick={() => setErrors(false)}/>
                </Alert>
                }
          <ModalCloseButton  onClick={onCloseRevocationModalAcct}/>
          <ModalBody pb={6}>
            <FormControl mt={5}>
              <FormLabel>New Pin</FormLabel>
              <Input ref={initialRefPassAcct} placeholder="Enter your new pin"
              onChange={(e) => setNewPin(e.target.value)}
              value={newPin} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} bg={'#1D2667'} color='#fff' _hover={{ bg: "#5363CE", color: "#fff" }}
            onClick={() => handleAccountPinSubmit()}>
            {acctLoading ? <Text><Spinner color="white.500" animationDuration="0.8s" size="sm" /> Processing</Text> : 'Update'}
            </Button>
            <Button onClick={onCloseRevocationModalAcct}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* password update modal */}
      <Modal
        initialFocusRef={initialRefPass}
        finalFocusRef={finalRefPass}
        isOpen={isRevocationModalOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset Password</ModalHeader>
          <Text px={5} color={'gray.500'}>Enter new details to reset your password</Text>
            {errors &&  
            <Alert status="error" mt={2}>
                <AlertIcon />
                <AlertTitle mr={2}>
                  Error!
                </AlertTitle>
              <AlertDescription>
                  {errorMessages}
              </AlertDescription>
              
              <CloseButton position="absolute" right="8px" top="8px" onClick={() => setErrors(false)}/>
            </Alert>
            }
          <ModalCloseButton onClick={onCloseRevocationModal}/>
          <ModalBody pb={6}>
            <FormControl mt={5}>
              <FormLabel>New Password</FormLabel>
                <InputGroup size='md'>
                    <Input ref={initialRefPass} placeholder="Enter your new password"
                    value={passFormData.password}
                    name="password"
                    type={show ? "text" : "password"}
                    onChange={handlePassChange} />
                <InputRightElement display='flex' alignItems='center' mt='4px'>
                    <Icon
                      color={textColorSecondary}
                      _hover={{ cursor: "pointer" }}
                      as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                      onClick={handleClick}
                    />
                </InputRightElement>
              </InputGroup>
              
            </FormControl>
            <FormControl mt={5}>
              <FormLabel>Confirm New Password</FormLabel>
              <InputGroup size='md'>
                <Input placeholder="Confirm new password" 
                name="confirm_password"
                type={showConfirm ? "text" : "password"}
                value={passFormData.confirm_password}
                onChange={handlePassChange}/>
                <InputRightElement display='flex' alignItems='center' mt='4px'>
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={showConfirm ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClickCOnfirm}
                  />
                </InputRightElement>
              </InputGroup>
              
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} bg={'#1D2667'} color='#fff' _hover={{ bg: "#5363CE", color: "#fff" }}
              onClick={() => handlePassSubmit()}>
            {dataLoading ? <Text><Spinner color="white.500" animationDuration="0.8s" size="sm" /> Processing</Text> : 'Update'}
            </Button>
            <Button onClick={onCloseRevocationModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

            {/* Deactivate account modal */}
          <AlertDialog
            isOpen={isCloseAccountOpen}
            leastDestructiveRef={cancelRef}
            onClose={onCloseAccount}
          >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Profile
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete/block your profile? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseAccount}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={() => handleDeactivateAccountSubmit()} ml={3}>
              {deleteLoading ? <Text><Spinner color="white.500" animationDuration="0.8s" size="sm" /> Processing</Text> : 'Yes, Delete'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}
