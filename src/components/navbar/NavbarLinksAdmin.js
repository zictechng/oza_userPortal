// Chakra Imports
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  useColorMode,
  Spinner,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
// Custom Components
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import PropTypes from 'prop-types';
import React , {useState} from 'react';
// Assets
import { MdNotificationsNone} from 'react-icons/md';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import routes from 'routes';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { NavLink, useNavigate } from "react-router-dom";

import { authUserLogout } from "storeMtg/authSlice";

export default function HeaderLinks(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [errors, setErrors] = useState(false);
	const [errorMessages, setErrorMessages] = useState("");

  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.400', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );
  const {loading, user} = useSelector((state) => state.authUser)

  // disable account profile sate
    const {
      isOpen: isCloseAccountOpen,
      onOpen: onOpenCloseAccount,
      onClose: onCloseAccount,
    } = useDisclosure();

  const cancelRef = React.useRef()

  // call logout method here 
      const submitLogout  = () =>{
        dispatch(authUserLogout(user.userData?._id)).then((response)=>{
        console.log("Auth User Logout ", response.payload.status);
        
        if(response.payload?.status === 500){
          setErrors(true)
          setErrorMessages("Error: " + response.payload)
         }
        else if(response.payload?.msg ==='200'){
          localStorage.removeItem("authUserData"); // Clear localStorage
          navigate('/auth/sign-in')
        }
        else{
          setErrors(true)
          setErrorMessages(response.payload?.message)
        }
        })
      }

  return (
    <Flex
      w={{ sm: 'auto', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="20px"
      
      boxShadow={shadow}>
       <Flex w={{ base: "150px", md: "150px" }}
          alignItems={{ xl: 'center', sm: 'center'}}
          
          margin={{ top: '10px', bottom: '10px', xl: '10px' }}
          height="38px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              fontSize="sm"
              fontWeight="700"
              color={'gray.400'}
              me="15px">
              &nbsp; {user.userData?.display_name}
            </Text>
          </Flex>
      
      <SidebarResponsive routes={routes} />

      {/* <Flex display={{ sm: "flex", xl: "none" }} alignItems='center'>
      <Menu>
        <MenuButton p="0px" >
          <Icon
            mt="6px"
            as={MdHomeFilled}
            color={navbarIcon}
            w="25px"
            h="25px"
            me="10px"
          />
        </MenuButton>
      </Menu>

      <Menu>
        <MenuButton p="0px">
          <Icon
            mt="6px"
            as={MdBarChart}
            color={navbarIcon}
            w="25px"
            h="25px"
            me="10px"
          />
        </MenuButton>
      </Menu>

      <Menu>
        <MenuButton p="0px">
          <Icon
            mt="6px"
            as={MdRestore}
            color={navbarIcon}
            w="25px"
            h="25px"
            me="10px"
          />
        </MenuButton>
      </Menu>

      <Menu>
        <MenuButton p="0px">
          <Icon
            mt="6px"
            as={MdPersonOutline}
            color={navbarIcon}
            w="25px"
            h="25px"
            me="10px"
          />
        </MenuButton>
      </Menu>

      <Menu>
        <MenuButton p="0px">
          <Icon
            mt="6px"
            as={MdHelpOutline}
            color={navbarIcon}
            w="25px"
            h="25px"
            me="10px"
          />
        </MenuButton>
      </Menu>

      <Menu>
        <MenuButton p="0px">
          <Icon
            mt="6px"
            as={MdSettings}
            color={navbarIcon}
            w="25px"
            h="25px"
            me="10px"
          />
        </MenuButton>
      </Menu>
      </Flex> */}
      

      <Menu>
        <Link to="/user/notifications">
        <MenuButton p="0px">
          <Icon
            mt="6px"
            as={MdNotificationsNone}
            color={navbarIcon}
            w="18px"
            h="18px"
            me="10px"
          />
        </MenuButton>
        </Link>
        
      </Menu>

      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={toggleColorMode}
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>
      <Menu>
        <MenuButton p="0px">
          {user.userData?.profile_photo ?
          <Avatar
            _hover={{ cursor: 'pointer' }}
            src={user.userData?.profile_photo}
            color="white"
            name={user.userData?.display_name}
            bg="#11047A"
            size="sm"
            w="40px"
            h="40px"
          />
          :
          <Avatar
            _hover={{ cursor: 'pointer' }}
            color="white"
            name={user.userData?.display_name}
            bg="#11047A"
            size="sm"
            w="40px"
            h="40px"
          />
          }
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none">
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
            &nbsp;{user.userData?.email}
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
              <Link to={'/user/profile'}>
                <MenuItem
                  _hover={{ bg: 'none' }}
                  _focus={{ bg: 'none' }}
                  borderRadius="8px"
                  px="14px">
                  <Text fontSize="16px">Profile</Text>
                </MenuItem>
            </Link>
            
            <Link to={'/user/settings'}>
              <MenuItem
                _hover={{ bg: 'none' }}
                _focus={{ bg: 'none' }}
                borderRadius="8px"
                px="14px">
                <Text fontSize="16px">Settings</Text>
              </MenuItem>
            </Link>
            
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color="red.400"
              borderRadius="8px"
              px="14px"
            onClick={onOpenCloseAccount}
            >
              <Text fontSize="sm"> Logout</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>

       {/* Logout modal */}
          <AlertDialog
            isOpen={isCloseAccountOpen}
            leastDestructiveRef={cancelRef}
            onClose={onCloseAccount}
          >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Logout
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to logout ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseAccount}>
                No, Cancel
              </Button>
              <Button colorScheme='red' onClick={() => submitLogout()} ml={3}
                disabled={loading}>
              {loading ? <Text><Spinner color="white.500" animationDuration="0.8s" size="sm" /> Wait..</Text> : 'Yes, Logout'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
