
import React from 'react';
import { AppProvider, useAppContext } from '../context/AppContext';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';

const AppContent: React.FC = () => {
    const { user } = useAppContext();
    return user ? <Dashboard /> : <Login />;
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
