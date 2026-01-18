
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Input from './ui/Input';
import Button from './ui/Button';
import { Icons } from '../constants';
import Register from './Register';

const Login: React.FC = () => {
    const handlePolarisRedirect = () => {
        // In a real environment, this would redirect to the Polaris (BioCore) URL
        // with a return_url parameter. For this simulation, we'll open it in a new window/tab
        // or simply show the Polaris intent.
        window.location.href = 'http://localhost:5173'; // Assuming Polaris (BioCore) runs here
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1f2e] to-[#252b3d]">
            <div className="w-full max-w-md p-10 space-y-8 glass-panel rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                <div className="flex flex-col items-center">
                    <img src="/assets/logo.png" alt="Phoenix Logo" className="h-32 w-auto mb-8 drop-shadow-[0_0_20px_rgba(0,163,255,0.4)]" />
                    <h2 className="text-center text-4xl font-black text-white tracking-tight">
                        Phoenix Core
                    </h2>
                    <p className="mt-4 text-center text-sm text-blue-400 font-bold uppercase tracking-[0.25em]">
                        Wound Clinic Diagnostic Program
                    </p>
                </div>

                <div className="pt-8 space-y-6">
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
                        <p className="text-xs text-blue-200/70 leading-relaxed">
                            Security Policy: All access to Phoenix Core must be verified through the **Polaris Centralized Gateway**.
                        </p>
                    </div>

                    <button
                        onClick={handlePolarisRedirect}
                        className="group relative flex w-full h-16 items-center justify-center overflow-hidden rounded-xl bg-primary text-background-dark font-bold text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            <span className="material-symbols-outlined font-bold">fingerprint</span>
                            Authenticate via Polaris
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                    </button>

                    <div className="flex items-center justify-center gap-2 pt-4 opacity-40">
                        <span className="material-symbols-outlined text-xs">verified_user</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">L3 Compliance Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
