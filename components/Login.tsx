import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Input from './ui/Input';
import Button from './ui/Button';
import { Icons } from '../constants';
import Register from './Register';

const Login: React.FC = () => {
    const [documento, setDocumento] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
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

    const handlePolarisRedirect = () => {
        // Polaris (BioCore) URL integration
        window.location.href = 'http://localhost:5173';
    };

    if (isRegistering) {
        return <Register onBack={() => setIsRegistering(false)} />;
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
                            <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1" htmlFor="documento">Documento de Identidad</label>
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
                            <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1" htmlFor="password">Contraseña</label>
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

                        <Button
                            type="submit"
                            className="w-full py-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold"
                        >
                            Ingresar al Sistema
                        </Button>
                    </form>

                    <div className="mt-6 flex flex-col gap-4">
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-white/10"></div>
                            <span className="flex-shrink mx-4 text-white/40 text-xs font-bold uppercase tracking-widest">O</span>
                            <div className="flex-grow border-t border-white/10"></div>
                        </div>

                        <button
                            onClick={handlePolarisRedirect}
                            className="flex w-full h-14 items-center justify-center rounded-xl bg-blue-500/20 text-blue-100 font-bold text-sm border border-blue-400/30 hover:bg-blue-500/30 transition-all gap-3"
                        >
                            <span className="material-symbols-outlined font-bold text-xl">fingerprint</span>
                            Autenticar vía Polaris
                        </button>
                    </div>

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
