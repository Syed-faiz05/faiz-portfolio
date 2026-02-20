import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

const AdminLayout = () => {
    // Auth check removed as requested


    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex font-sans">
            {/* Mobile Sidebar could be added here later */}
            <Sidebar />

            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                <Topbar />
                <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
