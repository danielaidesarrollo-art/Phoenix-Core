import React from 'react';
import { AppProvider } from './context/AppContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { useAppContext } from './context/AppContext';
import { HUDOverlay } from './components/shared/HUDOverlay';

const AppContent: React.FC = () => {
    const { user } = useAppContext();
    return user ? <Dashboard /> : <Login />;
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <div className="relative">
                <HUDOverlay
                    title="PHOENIX CLINICAL HUD"
                    metrics={[
                        { label: 'Wounds Tracked', value: 12 },
                        { label: 'Astra Confidence', value: 94, unit: '%' }
                    ]}
                />
                <AppContent />
            </div>
        </AppProvider>
    );
};

export default App;
