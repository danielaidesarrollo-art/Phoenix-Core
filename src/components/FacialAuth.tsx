import React, { useRef, useState, useEffect } from 'react';
import polarisAuth, { BiometricData } from '../services/polarisAuth';

interface FacialAuthProps {
    documento: string;
    mode: 'register' | 'login';
    onSuccess: () => void;
    onCancel: () => void;
}

const FacialAuth: React.FC<FacialAuthProps> = ({ documento, mode, onSuccess, onCancel }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturing, setCapturing] = useState(false);
    const [capturedImages, setCapturedImages] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            setError('No se pudo acceder a la cámara. Verifique los permisos.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImages(prev => [...prev, imageData]);

        if (capturedImages.length + 1 >= 3) {
            setCapturing(false);
        }
    };

    const handleSubmit = async () => {
        if (capturedImages.length < 3) {
            setError('Se requieren al menos 3 capturas faciales.');
            return;
        }

        setLoading(true);
        setError('');

        // En producción, aquí procesarías las imágenes con face-api.js
        // Por ahora, enviamos las imágenes base64
        const biometricData: BiometricData = {
            type: 'facial',
            data: JSON.stringify(capturedImages)
        };

        try {
            const result = await polarisAuth.verifyBiometric(documento, biometricData);

            if (result.success) {
                stopCamera();
                onSuccess();
            } else {
                setError(result.error || 'Error en verificación facial.');
            }
        } catch (err) {
            setError('Error al procesar reconocimiento facial.');
        }

        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl p-6 mx-4">
                <div className="glass-panel rounded-2xl p-8 shadow-2xl border border-cyan-500/30 bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-xl">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 mb-4 shadow-lg shadow-cyan-500/30">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {mode === 'register' ? 'Registro Facial' : 'Autenticación Facial'}
                        </h3>
                        <p className="text-cyan-200 text-sm">
                            {mode === 'register'
                                ? 'Capture su rostro desde 3 ángulos diferentes'
                                : 'Mire a la cámara para autenticarse'}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Video Preview */}
                        <div className="relative rounded-xl overflow-hidden bg-black">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-auto"
                            />
                            <canvas ref={canvasRef} className="hidden" />

                            {/* Face Overlay Guide */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-64 h-80 border-4 border-cyan-500/50 rounded-full"></div>
                            </div>
                        </div>

                        {/* Captured Images */}
                        {capturedImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-4">
                                {capturedImages.map((img, index) => (
                                    <div key={index} className="relative rounded-lg overflow-hidden border-2 border-green-500/50">
                                        <img src={img} alt={`Captura ${index + 1}`} className="w-full h-auto" />
                                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            ✓ {index + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Progress */}
                        <div className="text-center">
                            <p className="text-white text-sm mb-2">
                                Capturas: {capturedImages.length} / 3
                            </p>
                            <div className="w-full bg-white/10 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${(capturedImages.length / 3) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            {capturedImages.length < 3 ? (
                                <button
                                    onClick={captureImage}
                                    disabled={loading}
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
                                >
                                    📸 Capturar Rostro
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Verificando...' : '✓ Confirmar'}
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    stopCamera();
                                    onCancel();
                                }}
                                className="px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
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

export default FacialAuth;
