import React, { useState } from 'react';
import polarisAuth from '../services/polarisAuth';

interface PasswordRecoveryProps {
    onBack: () => void;
}

const PasswordRecovery: React.FC<PasswordRecoveryProps> = ({ onBack }) => {
    const [step, setStep] = useState<'request' | 'verify' | 'reset'>('request');
    const [documento, setDocumento] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await polarisAuth.recoverPassword(documento);

        if (result.success) {
            setSuccess('Código de verificación enviado a su correo registrado.');
            setStep('verify');
        } else {
            setError(result.error || 'Error al solicitar código.');
        }

        setLoading(false);
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (newPassword.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        setLoading(true);

        const result = await polarisAuth.resetPassword(documento, code, newPassword);

        if (result.success) {
            setSuccess('¡Contraseña restablecida exitosamente! Ahora puede iniciar sesión.');
            setTimeout(() => onBack(), 3000);
        } else {
            setError(result.error || 'Error al restablecer contraseña.');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0"></div>
            <div className="absolute inset-0 opacity-30 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600 blur-[120px]"></div>
            </div>

            <div className="w-full max-w-md p-8 relative z-10">
                <div className="glass-panel rounded-2xl p-8 shadow-2xl border border-white/10 backdrop-blur-xl bg-white/10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-blue-500 mb-4 shadow-lg shadow-purple-500/30">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            Recuperar Contraseña
                        </h2>
                        <p className="mt-2 text-blue-200 text-sm font-medium">
                            {step === 'request' && 'Ingrese su documento para recibir un código'}
                            {step === 'verify' && 'Ingrese el código recibido'}
                            {step === 'reset' && 'Cree su nueva contraseña'}
                        </p>
                    </div>

                    {step === 'request' && (
                        <form className="space-y-6" onSubmit={handleRequestCode}>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">
                                    Documento de Identidad
                                </label>
                                <input
                                    type="text"
                                    value={documento}
                                    onChange={(e) => setDocumento(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    placeholder="Ingrese su documento"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 text-sm">
                                    {success}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold disabled:opacity-50"
                            >
                                {loading ? 'Enviando...' : 'Enviar Código'}
                            </button>
                        </form>
                    )}

                    {step === 'verify' && (
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep('reset'); }}>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">
                                    Código de Verificación
                                </label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-center text-2xl tracking-widest"
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold"
                            >
                                Verificar Código
                            </button>
                        </form>
                    )}

                    {step === 'reset' && (
                        <form className="space-y-6" onSubmit={handleResetPassword}>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">
                                    Nueva Contraseña
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">
                                    Confirmar Contraseña
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 text-sm">
                                    {success}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold disabled:opacity-50"
                            >
                                {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            onClick={onBack}
                            className="text-sm text-blue-300 hover:text-white transition-colors"
                        >
                            ← Volver al inicio de sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordRecovery;
