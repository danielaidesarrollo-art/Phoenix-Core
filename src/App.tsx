import React, { useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SiriusAuditBanner from './components/SiriusAuditBanner';
import PWAInstallPrompt from './components/PWAInstallPrompt';

const AppContent: React.FC = () => {
    const { user } = useAppContext();

    return (
        <>
            {/* PWA Install Prompt - shows when app is not installed */}
            <PWAInstallPrompt />

            {/* Main Content */}
            {user ? (
                <>
                    {/* SIRIUS Audit Banner - shows after login */}
                    <SiriusAuditBanner position="bottom" />
                    <Dashboard />
                </>
            ) : (
                <Login />
            )}
        </>
    );
};

function App() {
    useEffect(() => {
        // Register Service Worker for PWA functionality
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('/sw.js')
                    .then((registration) => {
                        console.log('✅ Service Worker registered:', registration.scope);
                    })
                    .catch((error) => {
                        console.error('❌ Service Worker registration failed:', error);
                    });
            });
        }

        // Add PWA install prompt listener
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            console.log('📱 PWA install prompt available');
        });

        // Detect if app is installed
        window.addEventListener('appinstalled', () => {
            console.log('✅ Phoenix Core PWA installed successfully');
        });
    }, []);

    return (
        <AppProvider>
            <div className="App min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
                <AppContent />
            </div>
        </AppProvider>
    );
}

export default App;
