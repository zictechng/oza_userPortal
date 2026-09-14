import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoutes from 'storeMtg/protectedRoute';
import { useAppContext } from 'contexts/AppContext';
import { fetchAppStatus } from 'storeMtg/appStatusSlice';
import {
  Flex, Spinner, Text, Button,
} from '@chakra-ui/react';

const POLL_INTERVAL = 20 * 1000; // check every 30 seconds

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const { appName } = useAppContext();
  const dispatch = useDispatch();
  const { platformDown, message, loading, lastChecked } = useSelector(
    state => state.appStatus
  );

  useEffect(() => {
    if (appName) document.title = appName;
  }, [appName]);

  useEffect(() => {
    // Fetch immediately on mount
    dispatch(fetchAppStatus());

    // Then poll every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchAppStatus());
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [dispatch]);

  // Show spinner only on very first load (no data yet)
  if (loading && !lastChecked) {
    return (
      <ChakraProvider theme={currentTheme}>
        <Flex justify='center' align='center' minH='100vh' direction='column' gap='16px'>
          <Spinner size='xl' color='brand.500' thickness='4px' />
          <Text color='gray.500' fontSize='sm'>Loading...</Text>
        </Flex>
      </ChakraProvider>
    );
  }

  // Maintenance screen — shows instantly when Redux state updates
  if (platformDown) {
    return (
      <ChakraProvider theme={currentTheme}>
        <Flex justify='center' align='center' minH='100vh'
          direction='column' bg='gray.50' px='24px' textAlign='center'>
          <Text fontSize='64px' mb='16px'>🔧</Text>
          <Text fontSize='2xl' fontWeight='800' color='navy.700' mb='8px'>
            We'll be right back
          </Text>
          <Text color='gray.500' fontSize='md' maxW='400px' mb='24px'>
            {message || 'The platform is currently undergoing scheduled maintenance. Please check back shortly.'}
          </Text>
          <Button colorScheme='brand' borderRadius='12px'
            onClick={() => dispatch(fetchAppStatus())}>
            Try Again
          </Button>
        </Flex>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path='auth/*' element={<AuthLayout />} />
        <Route element={<ProtectedRoutes />}>
          <Route
            path='user/*'
            element={
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            }
          />
        </Route>
        <Route path='/' element={<Navigate to='/user' replace />} />
      </Routes>
    </ChakraProvider>
  );
}