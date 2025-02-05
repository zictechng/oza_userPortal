import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
const ProtectedRoutes = () =>{
const {userToken} = useSelector((state) => state.authUser)
    let isAuth = userToken;
    return isAuth ? <Outlet /> : <Navigate to={'auth/sign-in'} />;
}

export default ProtectedRoutes;