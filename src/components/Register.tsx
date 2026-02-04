import React, { useState } from 'react';
import { User } from '../types.ts';
import Input from './ui/Input.tsx';
import Button from './ui/Button.tsx';
import { ROLES_CLINICOS as ROLES_ASISTENCIALES } from '../constants.tsx';
import Select from './ui/Select.tsx';
import { useAppContext } from '../context/AppContext.tsx';

interface RegisterProps {
    onBack: () => void;
}

const Register: React.FC<RegisterProps> = ({ onBack }) => {
    const { users, addUser } = useAppContext();

    const [documento, setDocumento] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [institucion, setInstitucion] = useState('');
    const [cargo, setCargo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Las claves no coinciden.');
            return;
        }

        if (users.some((u: User) => u.documento === documento || u.correo === correo)) {
            setError('El documento o correo ya está registrado.');
            return;
        }

        const newUser: User = { documento, nombre, correo, institucion, cargo, password };

        try {
            addUser(newUser);
            setSuccess('¡Registro exitoso! Ahora puede iniciar sesión.');

            // Clear form
            setDocumento('');
            setNombre('');
            setCorreo('');
            setInstitucion('');
            setCargo('');
            setPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado durante el registro.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0"></div>
            <div className="absolute inset-0 opacity-30 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600 blur-[120px]"></div>
            </div>

            <div className="w-full max-w-2xl p-8 relative z-10">
                <div className="glass-panel rounded-2xl p-8 shadow-2xl border border-white/10 backdrop-blur-xl bg-white/10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center mb-4">
                            <img
                                src="/polaris-logo.jpg"
                                alt="POLARIS IAM"
                                className="w-32 h-32 rounded-2xl shadow-2xl shadow-blue-500/50"
                            />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            Registro de Colaborador
                        </h2>
                        <p className="mt-2 text-blue-200 text-sm font-medium">
                            Powered by POLARIS - Guiding Innovation
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">Nombres y Apellidos</label>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Nombre completo"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">Número de Documento</label>
                                <input
                                    type="text"
                                    value={documento}
                                    onChange={e => setDocumento(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Documento"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">Correo Electrónico</label>
                                <input
                                    type="email"
                                    value={correo}
                                    onChange={e => setCorreo(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="ejemplo@correo.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">Institución</label>
                                <input
                                    type="text"
                                    value={institucion}
                                    onChange={e => setInstitucion(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Centro de salud"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">Cargo</label>
                                <select
                                    value={cargo}
                                    onChange={e => setCargo(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                                    required
                                >
                                    <option value="" className="bg-slate-800">Seleccione su cargo</option>
                                    {ROLES_ASISTENCIALES.map(role => (
                                        <option key={role} value={role} className="bg-slate-800">{role}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">Contraseña</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                {success}
                            </div>
                        )}

                        <div className="flex flex-col gap-4 pt-4">
                            <button
                                type="submit"
                                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                Registrarse ahora
                            </button>
                            <button
                                type="button"
                                onClick={onBack}
                                className="w-full py-3 text-sm text-blue-300 hover:text-white transition-colors"
                            >
                                Volver a Inicio de Sesión
                            </button>
                        </div>
                    </form>
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

export default Register;
