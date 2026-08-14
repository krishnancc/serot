import { useRoutes } from 'react-router-dom';
import MainRoutes from './MainRoutes';

export default function Router() {
    return useRoutes(MainRoutes);
}