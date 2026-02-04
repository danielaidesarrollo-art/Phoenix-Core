import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsInstalled(true);
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Show again after 24 hours
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    };

    if (isInstalled || !showPrompt) return null;

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
            <div className="glass-panel rounded-2xl p-6 shadow-2xl border border-cyan-500/30 bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-xl animate-slide-down">
                <div className="flex items-start gap-4">
                    {/* Phoenix Icon */}
                    <div className="flex-shrink-0">
                        <img
                            src="/phoenix-logo.jpg"
                            alt="Phoenix Core"
                            className="w-16 h-16 rounded-xl shadow-lg shadow-cyan-500/30"
                        />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-1">
                            Instalar Phoenix Core
                        </h3>
                        <p className="text-blue-200 text-sm mb-4">
                            Accede más rápido instalando la aplicación en tu dispositivo
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={handleInstall}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transform hover:-translate-y-0.5 transition-all"
                            >
                                Instalar
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="px-4 py-2.5 rounded-lg bg-white/10 text-white font-medium text-sm hover:bg-white/20 transition-colors"
                            >
                                Ahora no
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PWAInstallPrompt;
