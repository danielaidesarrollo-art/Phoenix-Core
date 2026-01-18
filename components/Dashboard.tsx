

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import PatientList from './PatientList';
import HandoverForm from './HandoverForm';
import ScheduleView from './ScheduleView';
import ProfileView from './ProfileView';
import MapView from './MapView';
import RoutePlanner from './RoutePlanner';
import StaffManagement from './StaffManagement';
import ProductionOrderView from './ProductionOrderView'; // New Import
import DanielView from './Daniel/DanielView';

const Dashboard: React.FC = () => {
    const [activeView, setActiveView] = useState('dashboard');

    // Ensure that if the view state is ever invalid, it defaults back to the patient list.
    // This makes the navigation more robust and aligns with ensuring the patient list is the primary view.
    useEffect(() => {
        const validViews = ['dashboard', 'handover', 'schedule', 'profile', 'map', 'routes', 'staff', 'production', 'daniel'];
        if (!validViews.includes(activeView)) {
            setActiveView('dashboard');
        }
    }, [activeView]);

    useEffect(() => {
        import('../utils/safeCore.ts').then(m => m.SessionValidator.checkPulse());
    }, []);



    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <PatientList />;
            case 'handover':
                return <HandoverForm />;
            case 'schedule':
                return <ScheduleView />;
            case 'map':
                return <MapView />;
            case 'routes':
                return <RoutePlanner />;
            case 'production':
                return <ProductionOrderView />;
            case 'daniel':
                return <DanielView />;
            case 'profile':
                return <ProfileView />;
            case 'staff':
                return <StaffManagement />;
            default:
                // Render the patient list as a safe fallback while the useEffect corrects the state.
                return <PatientList />;
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar onNavigate={setActiveView} activeView={activeView} />
            <main className="flex-grow p-4 md:p-8">
                {renderView()}
            </main>
        </div>
    );
};

export default Dashboard;
