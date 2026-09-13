import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState, useEffect } from 'react';
import ProtectedRoutes from 'storeMtg/protectedRoute';
import { useAppContext } from 'contexts/AppContext';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const { appName } = useAppContext();

  // Update browser title dynamically
  useEffect(() => {
    if (appName) document.title = appName;
  }, [appName]);

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route element={<ProtectedRoutes />}>
          <Route
            path="user/*"
            element={
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            }
          />
        </Route>
        <Route path="/" element={<Navigate to="/user" replace />} />
      </Routes>
    </ChakraProvider>
  );
}