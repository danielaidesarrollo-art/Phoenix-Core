import React, { useState, useEffect } from 'react';
import Navbar from './Navbar.tsx';
import PatientList from './PatientList.tsx';
import ProfileView from './ProfileView.tsx';
import DanielView from './Daniel/DanielView.tsx';
import WoundRegistry from './WoundRegistry.tsx';

import { useAppContext } from '../context/AppContext.tsx';
import Login from './Login.tsx';

const Dashboard: React.FC = () => {
    const { user } = useAppContext();
    const [activeView, setActiveView] = useState('dashboard');

    // Ensure that if the view state is ever invalid, it defaults back to the patient list.
    useEffect(() => {
        const validViews = ['dashboard', 'wounds', 'daniel', 'profile'];
        if (!validViews.includes(activeView)) {
            setActiveView('dashboard');
        }
    }, [activeView]);

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <PatientList />;
            case 'wounds':
                return <WoundRegistry />;
            case 'daniel':
                return <DanielView />;
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