import { useSelector } from 'react-redux';

// Simply reads from Redux — no API call here
// App.js polling keeps this always fresh
export default function useAppStatus() {
  return useSelector(state => state.appStatus);
}