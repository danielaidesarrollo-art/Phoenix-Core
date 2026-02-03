
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PolarisLogin - Universal Entrance Component for DANIEL_AI Ecosystem
 * Implements Directiva #13: Vigilancia y Autorización de Capital (Entrada Polaris)
 * 
 * Features:
 * - High-fidelity clinical biometric animations
 * - Professional Polaris Medico entrance
 * - Configurable transition to specific Core Identity
 */

interface PolarisLoginProps {
    onLogin: (userData: any) => void;
    coreName: string;         // e.g. "Phoenix"
    coreRole: string;         // e.g. "Advanced Clinical Node"
    systemName?: string;      // default: "Polaris Medico"
    portalDescription?: string; // default: "Secure Healthcare Portal"
}

const PolarisLogin: React.FC<PolarisLoginProps> = ({
    onLogin,
    coreName,
    coreRole,
    systemName = "Polaris Medico",
    portalDescription = "Secure Healthcare Portal"
}) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [isScanning, setIsScanning] = useState<'face' | 'finger' | null>(null);
    const [authSuccess, setAuthSuccess] = useState(false);
    const [userId, setUserId] = useState('');

    const startScan = (type: 'face' | 'finger') => {
        if (!userId && !isRegistering) {
            alert('Please enter your Professional ID');
            return;
        }
        setIsScanning(type);

        // Simulation of high-fidelity biometric scanning
        setTimeout(() => {
            setIsScanning(null);
            setAuthSuccess(true);

            // Core Identity Transition
            setTimeout(() => {
                onLogin({
                    id: userId || 'CLINICIAN-001',
                    nombre: 'User Access',
                    cargo: 'AUTHORIZED_PERSONNEL'
                });
            }, 2000);
        }, 3500);
    };

    return (
        <div className="min-h-screen bg-[#0a1128] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Directiva #8: Visual Background (HUD Ready) */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                {/* 1. Official Polaris Entrance */}
                <div className="flex flex-col items-center mb-12">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="w-24 h-24 mb-6 relative group"
                    >
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-400/30 transition-all"></div>
                        <img
                            src="/assets/polaris_medico_logo.png"
                            alt="Polaris Medico Logo"
                            className="w-full h-full object-contain relative z-10"
                            onError={(e) => {
                                // Fallback if image not found
                                e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/3063/3063176.png";
                            }}
                        />
                    </motion.div>
                    <h1 className="text-3xl font-light text-white tracking-widest uppercase">
                        {systemName.split(' ')[0]} <span className="font-bold text-blue-400">{systemName.split(' ')[1]}</span>
                    </h1>
                    <p className="text-blue-300/50 text-[10px] tracking-[0.3em] mt-3 uppercase font-mono">{portalDescription}</p>
                </div>

                {/* Login Container */}
                <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[9px] text-blue-400 font-bold uppercase tracking-[0.2em] mb-2 opacity-70">Professional Terminal ID</label>
                            <input
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="ID-2026-AUTH"
                                className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-white focus:border-blue-500/50 transition-all outline-none placeholder:text-white/10 text-sm font-mono"
                            />
                        </div>
                        {!isRegistering && (
                            <div>
                                <label className="block text-[9px] text-blue-400 font-bold uppercase tracking-[0.2em] mb-2 opacity-70">Encription Key</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-white focus:border-blue-500/50 transition-all outline-none placeholder:text-white/10 text-sm"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => startScan('face')}
                        className="w-full py-4 bg-blue-600/80 hover:bg-blue-600 rounded-xl text-white text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-lg active:scale-[0.98]"
                    >
                        {isRegistering ? 'Enroll Bio-Identity' : 'Request Access'}
                    </button>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-[9px] uppercase font-bold text-white/20 px-2 tracking-widest"><span className="bg-[#0a1128] px-4">Biometric Verification Required</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => startScan('face')}
                            className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-white/10 transition-all group"
                        >
                            <span className="material-symbols-outlined text-3xl text-blue-400 group-hover:scale-110 transition-transform">face_recognition</span>
                            <span className="text-[9px] text-white/40 uppercase tracking-widest group-hover:text-blue-300">Face ID</span>
                        </button>
                        <button
                            onClick={() => startScan('finger')}
                            className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-white/10 transition-all group"
                        >
                            <span className="material-symbols-outlined text-3xl text-blue-400 group-hover:scale-110 transition-transform">fingerprint</span>
                            <span className="text-[9px] text-white/40 uppercase tracking-widest group-hover:text-blue-300">Touch ID</span>
                        </button>
                    </div>

                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="w-full text-[9px] text-blue-400/40 hover:text-blue-400/80 uppercase tracking-widest transition-colors font-medium pt-2"
                    >
                        {isRegistering ? 'Back to Terminal Access' : 'New Personnel? Bio-Enrollment'}
                    </button>
                </div>
            </motion.div>

            {/* Scanning Overlay (Directiva #13 Biometrics) */}
            <AnimatePresence>
                {isScanning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
                    >
                        <div className="relative flex flex-col items-center">
                            <div className="w-72 h-72 border border-blue-500/20 rounded-full flex items-center justify-center relative overflow-hidden">
                                <motion.div
                                    initial={{ top: '0%' }}
                                    animate={{ top: '100%' }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] z-10"
                                />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 to-transparent animate-pulse"></div>
                                <span className="material-symbols-outlined text-9xl text-blue-400 opacity-80 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">
                                    {isScanning === 'face' ? 'face_recognition' : 'fingerprint'}
                                </span>
                            </div>

                            <div className="mt-12 text-center space-y-2">
                                <p className="text-white font-mono text-xs tracking-[0.5em] flex items-center justify-center gap-3">
                                    <span className="animate-spin h-2 w-2 rounded-full border-2 border-blue-400 border-t-transparent"></span>
                                    {isScanning === 'face' ? 'ANALYZING FACIAL MAP...' : 'CAPTURING DERMAL PATTERN...'}
                                </p>
                                <p className="text-blue-400/40 font-mono text-[9px] tracking-widest uppercase">Encryption Layer: ACTIVE</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Identity Transition (Directiva #13 Transition) */}
            <AnimatePresence>
                {authSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`fixed inset-0 z-[60] flex items-center justify-center ${coreName === 'Phoenix' ? 'bg-[#0a0e17]' : 'bg-gray-900'}`}
                    >
                        <div className="text-center relative">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', damping: 15 }}
                                className="mb-8"
                            >
                                <span className="material-symbols-outlined text-white text-8xl drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                    verified
                                </span>
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-4"
                            >
                                <h2 className="text-white text-4xl font-bold uppercase tracking-[0.4em]">
                                    Access <span className="text-blue-400">Granted</span>
                                </h2>

                                <div className="flex flex-col items-center gap-2 pt-8">
                                    <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-mono">Initializing Neural Connection...</p>
                                    <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
                                        <motion.div
                                            initial={{ left: '-100%' }}
                                            animate={{ left: '100%' }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                                        ></motion.div>
                                    </div>
                                    {coreName === 'Phoenix' && (
                                        <div className="w-24 h-24 mx-auto mb-4 bg-black rounded-full border border-white/20 overflow-hidden">
                                            <img
                                                src="/assets/phoenix_logo_official.jpg"
                                                alt="Phoenix Official"
                                                style={{ width: '100%', height: '100%', mixBlendMode: 'screen', filter: 'contrast(1.5)' }}
                                            />
                                        </div>
                                    )}
                                    <h3 className="text-white/80 text-lg font-light tracking-[0.5em] uppercase mt-6">
                                        Entering <span className="font-bold text-white">{coreName}</span> <span className="text-blue-400">Core</span>
                                    </h3>
                                    <p className="text-blue-400/60 text-[9px] tracking-[0.3em] uppercase font-mono">{coreRole}</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PolarisLogin;
