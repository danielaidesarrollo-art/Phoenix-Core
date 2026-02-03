import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import PatientList from './PatientList';
import ProfileView from './ProfileView';
import DanielView from './Daniel/DanielView';
import WoundRegistry from './WoundRegistry';
import WoundClinicConsole from './WoundClinic/WoundClinicConsole';
import HandoverForm from './HandoverForm';
import ScheduleView from './ScheduleView';
import StaffManagement from './StaffManagement';
import ProductionOrderView from './ProductionOrderView';
import { useAppContext } from '../context/AppContext';
import Login from './Login';

const Dashboard: React.FC = () => {
    const { user } = useAppContext();
    const [activeView, setActiveView] = useState('dashboard');

    useEffect(() => {
        const validViews = ['dashboard', 'wounds', 'daniel', 'profile', 'handover', 'schedule', 'staff', 'production', 'woundclinic'];
        if (!validViews.includes(activeView)) {
            setActiveView('dashboard');
        }
    }, [activeView]);

    useEffect(() => {
        // Polaris Session Pulse Check
        import('../utils/safeCore').then(m => m.SessionValidator?.checkPulse?.()).catch(() => { });
    }, []);

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <PatientList />;
            case 'wounds':
                return <WoundRegistry />;
            case 'handover':
                return <HandoverForm />;
            case 'schedule':
                return <ScheduleView />;
            case 'production':
                return <ProductionOrderView />;
            case 'daniel':
                return <DanielView />;
            case 'woundclinic':
                return <WoundClinicConsole />;
            case 'staff':
                return <StaffManagement />;
            case 'profile':
                return <ProfileView />;
            default:
                return <PatientList />;
        }
    }

    if (!user) {
        return <Login />;
    }

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* Gradient Orb Background (Fixed) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/10 blur-[100px]"></div>
            </div>

            <Navbar onNavigate={setActiveView} activeView={activeView} />

            <main className="relative z-10 max-w-7xl mx-auto p-4 md:p-6 pb-20">
                <div className="glass-card p-6 min-h-[calc(100vh-140px)]">
                    {renderView()}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
