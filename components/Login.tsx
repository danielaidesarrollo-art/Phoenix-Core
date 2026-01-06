
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import Input from './ui/Input.tsx';
import Button from './ui/Button.tsx';
import { Icons } from '../constants.tsx';
import Register from './Register.tsx';

const Login: React.FC = () => {
    const [documento, setDocumento] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    // Fix: Destructure properties directly from useAppContext as the 'state' object is no longer part of the context type.
    const { setUser, users } = useAppContext();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!users || users.length === 0) {
            setError("No se encontraron datos de usuario. Por favor, regístrese o contacte a soporte.");
            return;
        }

        const user = users.find(u => u.documento === documento && u.password === password);

        if (user) {
            setUser(user);
        } else {
            setError('Documento o clave incorrecta.');
        }
    };

    if (isRegistering) {
        return <Register onBackToLogin={() => setIsRegistering(false)} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0"></div>
            <div className="absolute inset-0 opacity-30 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600 blur-[120px]"></div>
            </div>

            <div className="w-full max-w-md p-8 relative z-10">
                <div className="glass-panel rounded-2xl p-8 shadow-2xl border border-white/10 backdrop-blur-xl bg-white/10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 mb-4 shadow-lg shadow-blue-500/30">
                            <span className="text-3xl text-white">P</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            Phoenix Core
                        </h2>
                        <p className="mt-2 text-blue-200 text-sm font-medium">
                            Sistema Integral de Gestión Clínica
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">Documento de Identidad</label>
                            <input
                                id="documento"
                                type="text"
                                value={documento}
                                onChange={(e) => setDocumento(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Ingrese su documento"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Ingresar al Sistema
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <button onClick={() => setIsRegistering(true)} className="text-sm text-blue-300 hover:text-white transition-colors">
                            ¿Nuevo colaborador? <span className="font-semibold underline decoration-blue-400 decoration-2 underline-offset-2">Crear cuenta</span>
                        </button>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <p className="text-white/30 text-xs">
                        Powered by <strong>DANIEL AI</strong> &copy; 2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;