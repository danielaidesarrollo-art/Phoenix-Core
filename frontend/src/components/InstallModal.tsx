import React from 'react';

interface InstallModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="glass-panel p-8 rounded-3xl max-w-md w-full border border-cyan-500/30 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    ✕
                </button>

                <div className="text-center">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
                        Install Phoenix
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">
                        Scan this code with your mobile device to access the clinic dashboard instantly.
                    </p>

                    <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-2xl shadow-cyan-500/20">
                        <img
                            src="/qr-code.png"
                            alt="Scan to Install"
                            className="w-48 h-48 rounded-lg"
                        />
                    </div>

                    <div className="space-y-3 text-left bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="flex items-start gap-3">
                            <span className="text-xl">🍎</span>
                            <div>
                                <div className="text-sm font-bold text-gray-200">iOS (Safari)</div>
                                <div className="text-xs text-gray-400">Tap 'Share' → 'Add to Home Screen'</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-xl">🤖</span>
                            <div>
                                <div className="text-sm font-bold text-gray-200">Android (Chrome)</div>
                                <div className="text-xs text-gray-400">Tap 'Menu' → 'Install App'</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                        <button className="flex-1 bg-cyan-500/10 text-cyan-400 py-3 rounded-xl text-sm font-bold border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors">
                            Copy Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstallModal;
