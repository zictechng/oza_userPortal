import './assets/css/App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState, useEffect } from 'react';
import ProtectedRoutes from 'storeMtg/protectedRoute';
import { useAppContext } from 'contexts/AppContext';
import { useDispatch } from 'react-redux';
import { setSsoAuth } from 'storeMtg/authSlice';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const { appName } = useAppContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── SSO: runs before any route guard, before PersistGate blocks ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ssoParam = params.get('sso');
    if (!ssoParam) return;

    // Strip the token from URL immediately
    window.history.replaceState({}, '', window.location.pathname);

    try {
      const payload = JSON.parse(atob(ssoParam));
      if (payload?.msg === '200' && payload?.token) {
        // Write to localStorage FIRST so redux-persist rehydrates with this data
        localStorage.setItem('authUserData', JSON.stringify(payload));
        // Dispatch synchronous reducer to set Redux state right now
        dispatch(setSsoAuth(payload));
        // Navigate to dashboard
        navigate('/user', { replace: true });
      }
    } catch (e) {
      console.warn('SSO token invalid or expired');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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