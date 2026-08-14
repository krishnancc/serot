import { Navigate } from "react-router-dom";
import LoginPage from '../auth/LoginPage';
import RequestResetPassword from '../auth/Request_Reset_Password';
import ResetPassword from '../auth/Reset_Pasword';
import SignupPage from '../auth/SignupPage';
import VerifySignup from '../auth/VerifySignup';
import Dashboard from '../pages/Dashboard';
import Genealogy from "../pages/Genealogy";
import Purchase from "../pages/Purchase";
import Rewards from "../pages/Rewards";
import Settings from "../pages/Settings";
import Wallet from "../pages/Wallet";

import PersonalDetails from "../pages/Settings/PersonalDetails";
import Security from "../pages/Settings/Security";
import Support from "../pages/Settings/Support";
import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';

const MainRoutes = [
    // {
    //     path: "/",
    //     element: <Navigate to="/dashboard" replace />,
    // },
    // {
    //     path: "/dashboard",
    //     element: (
    //         <ProtectedRoute>
    //             <Dashboard />
    //         </ProtectedRoute>
    //     ),
    // },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard",
        element: <Navigate to="/" replace />,
    },
    {
        path: "/purchase",
        element: (
            <ProtectedRoute>
                <Purchase />
            </ProtectedRoute>
        ),
    },
    {
        path: "/genealogy",
        element: (
            <ProtectedRoute>
                <Genealogy />
            </ProtectedRoute>
        ),
    },
    {
        path: "/wallet",
        element: (
            <ProtectedRoute>
                <Wallet />
            </ProtectedRoute>
        ),
    },
    {
        path: "/reward",
        element: (
            <ProtectedRoute>
                <Rewards />
            </ProtectedRoute>
        ),
    },
    {
        path: "/settings",
        element: (
            <ProtectedRoute>
                <Settings />
            </ProtectedRoute>
        ),
    },
    {
        path: "/settings/personal",
        element: (
            <ProtectedRoute>
                <PersonalDetails />
            </ProtectedRoute>
        ),
    },
    {
        path: "/settings/security",
        element: (
            <ProtectedRoute>
                <Security />
            </ProtectedRoute>
        ),
    },
    {
        path: "/settings/support",
        element: (
            <ProtectedRoute>
                <Support />
            </ProtectedRoute>
        ),
    },
    {
        path: '/signin',
        element: (
            <GuestRoute>
                <LoginPage />
            </GuestRoute>
        ),
    },
    {
        path: '/signup',
        element: (
            <GuestRoute>
                <SignupPage />
            </GuestRoute>
        ),
    },
    {
        path: '/verify-signup',
        element: (
            <GuestRoute>
                <VerifySignup />
            </GuestRoute>
        ),
    },
    {
        path: '/request-password-reset',
        element: (
            <GuestRoute>
                <RequestResetPassword />
            </GuestRoute>
        ),
    },
    {
        path: '/reset-password',
        element: (
            <GuestRoute>
                <ResetPassword />
            </GuestRoute>
        ),
    },

];

export default MainRoutes;