
import React from 'react';
import { AppProvider, useAppContext } from '../context/AppContext';
import Dashboard from '../components/Dashboard';
import PolarisLogin from '../components/Auth/PolarisLogin';

const AppContent: React.FC = () => {
    const { user, login } = useAppContext();

    // Simulate login for Polaris workflow
    const handleLogin = (userData: any) => {
        login({ id: userData.id, nombre: 'Dr. Daniel', cargo: 'JEFE MEDICO' } as any);
    };

    return user ? <Dashboard /> : (
        <PolarisLogin
            onLogin={handleLogin}
            coreName="Phoenix"
            coreRole="Advanced Clinical Node"
        />
    );
};

function App() {
    return (
        <AppProvider>
            <div className="App min-h-screen bg-gray-50">
                <AppContent />
            </div>
        </AppProvider>
    );
}

export default App;
