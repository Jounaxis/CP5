import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('userToken');
    
    return !!token; 
};
    
export default function RotaProt () {
    const isAuth = isAuthenticated();
        
    if (!isAuth) {
        return <Navigate to="/" replace />; 
    }
        
    return <Outlet />;
};