import React, { useState } from 'react';
import polarisAuth from '../services/polarisAuth';

interface FingerprintAuthProps {
    documento: string;
    mode: 'register' | 'login';
    onSuccess: () => void;
    onCancel: () => void;
}

const FingerprintAuth: React.FC<FingerprintAuthProps> = ({ documento, mode, onSuccess, onCancel }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'requesting' | 'success'>('idle');

    const handleWebAuthn = async () => {
        setLoading(true);
        setError('');
        setStatus('requesting');

        try {
            if (mode === 'register') {
                // WebAuthn Registration
                if (!window.PublicKeyCredential) {
                    throw new Error('WebAuthn no soportado en este navegador');
                }

                const challenge = new Uint8Array(32);
                window.crypto.getRandomValues(challenge);

                const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
                    challenge,
                    rp: {
                        name: "Phoenix Core",
                        id: window.location.hostname,
                    },
                    user: {
                        id: new TextEncoder().encode(documento),
                        name: documento,
                        displayName: documento,
                    },
                    pubKeyCredParams: [
                        { alg: -7, type: "public-key" },  // ES256
                        { alg: -257, type: "public-key" } // RS256
                    ],
                    authenticatorSelection: {
                        authenticatorAttachment: "platform",
                        userVerification: "required",
                    },
                    timeout: 60000,
                    attestation: "direct"
                };

                const credential = await navigator.credentials.create({
                    publicKey: publicKeyCredentialCreationOptions
                }) as PublicKeyCredential;

                if (credential) {
                    // En producción, enviar credential a POLARIS
                    const biometricData = {
                        type: 'fingerprint' as const,
                        data: JSON.stringify({
                            id: credential.id,
                            rawId: Array.from(new Uint8Array(credential.rawId)),
                            type: credential.type
                        })
                    };

                    const result = await polarisAuth.verifyBiometric(documento, biometricData);

                    if (result.success) {
                        setStatus('success');
                        setTimeout(() => onSuccess(), 1000);
                    } else {
                        throw new Error(result.error || 'Error al registrar huella');
                    }
                }
            } else {
                // WebAuthn Authentication
                if (!window.PublicKeyCredential) {
                    throw new Error('WebAuthn no soportado en este navegador');
                }

                const challenge = new Uint8Array(32);
                window.crypto.getRandomValues(challenge);

                const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
                    challenge,
                    timeout: 60000,
                    userVerification: "required",
                    rpId: window.location.hostname,
                };

                const assertion = await navigator.credentials.get({
                    publicKey: publicKeyCredentialRequestOptions
                }) as PublicKeyCredential;

                if (assertion) {
                    const biometricData = {
                        type: 'fingerprint' as const,
                        data: JSON.stringify({
                            id: assertion.id,
                            rawId: Array.from(new Uint8Array(assertion.rawId)),
                            type: assertion.type
                        })
                    };

                    const result = await polarisAuth.verifyBiometric(documento, biometricData);

                    if (result.success) {
                        setStatus('success');
                        setTimeout(() => onSuccess(), 1000);
                    } else {
                        throw new Error(result.error || 'Error al verificar huella');
                    }
                }
            }
        } catch (err: any) {
            console.error('WebAuthn error:', err);
            if (err.name === 'NotAllowedError') {
                setError('Autenticación cancelada por el usuario.');
            } else if (err.name === 'NotSupportedError') {
                setError('Este dispositivo no soporta autenticación biométrica.');
            } else {
                setError(err.message || 'Error en autenticación biométrica.');
            }
            setStatus('idle');
        }

        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md p-6 mx-4">
                <div className="glass-panel rounded-2xl p-8 shadow-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-600 mb-4 shadow-lg shadow-purple-500/30">
                            {status === 'success' ? (
                                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                                </svg>
                            )}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {mode === 'register' ? 'Registrar Huella' : 'Autenticación Biométrica'}
                        </h3>
                        <p className="text-purple-200 text-sm">
                            {status === 'idle' && (mode === 'register'
                                ? 'Configure su huella dactilar o Face ID'
                                : 'Use su huella o Face ID para autenticarse')}
                            {status === 'requesting' && 'Esperando autenticación...'}
                            {status === 'success' && '¡Autenticación exitosa!'}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Fingerprint Animation */}
                        <div className="flex justify-center">
                            <div className={`relative w-32 h-32 ${status === 'requesting' ? 'animate-pulse' : ''}`}>
                                <svg className="w-full h-full text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z" />
                                </svg>
                                {status === 'requesting' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-full border-4 border-purple-500 rounded-full animate-ping"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                            <p className="text-purple-100 text-sm leading-relaxed">
                                <strong>Dispositivos compatibles:</strong><br />
                                • Touch ID (Mac/iPhone/iPad)<br />
                                • Face ID (iPhone/iPad)<br />
                                • Windows Hello (Windows 10/11)<br />
                                • Lector de huellas Android
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleWebAuthn}
                                disabled={loading || status === 'success'}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Autenticando...' : mode === 'register' ? '🔐 Registrar' : '🔓 Autenticar'}
                            </button>
                            <button
                                onClick={onCancel}
                                disabled={loading}
                                className="px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FingerprintAuth;
