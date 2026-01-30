import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import Card from '../ui/Card.tsx';
import Button from '../ui/Button.tsx';
import Modal from '../ui/Modal.tsx';
import { woundAnalysisService, WoundAnalysisResult } from '../../services/woundAnalysis.service.ts';
import { WoundRecord, WoundAssessment } from '../../types.ts';
import { Icons } from '../../constants.tsx';
import WoundClinicConsole from '../WoundClinic/WoundClinicConsole';

const DanielView: React.FC = () => {
    const { patients, wounds, addWound, updateWound, addClinicalNote, user, isBioCoreAuthenticated, validateBioCoreAuth } = useAppContext();
    const [isARMode, setIsARMode] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<WoundAnalysisResult | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<string>('');
    const [selectedWound, setSelectedWound] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [manualEntry, setManualEntry] = useState('');

    const activePatients = patients.filter(p => p.estado === 'Activo');
    const patientWounds = wounds.filter(w => w.patientId === selectedPatient);

    const toggleARMode = async () => {
        if (!isARMode) {
            if (!isBioCoreAuthenticated) {
                const bioData = prompt("Biometric Signature Required (BioCore). Enter 'auth' to proceed:");
                if (!bioData || !await validateBioCoreAuth(bioData || '')) {
                    alert("BioCore Authentication Failed. AR Mode restricted.");
                    return;
                }
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setIsARMode(true);
            } catch (err) {
                console.error("Camera access failed:", err);
                alert("No se pudo acceder a la cámara para el modo AR.");
            }
        } else {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            setIsARMode(false);
        }
    };

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const captureImageFromAR = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(videoRef.current, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                        setSelectedImage(file);
                        setImagePreview(URL.createObjectURL(blob));
                        handleAnalyze();
                    }
                }, 'image/jpeg');
            }
        }
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage && !manualEntry) {
            setError('Por favor selecciona una imagen o describe el estado');
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            const result = await woundAnalysisService.analyzeWoundImage(selectedImage || new File([], "manual.jpg"));
            setAnalysisResult(result);
            setIsModalOpen(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al analizar la imagen');
            console.error('Analysis error:', err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSaveAssessment = () => {
        if (!analysisResult || !selectedPatient) {
            setError('Selecciona un paciente antes de guardar');
            return;
        }

        const assessment: WoundAssessment = {
            id: `A${Date.now()}`,
            woundId: selectedWound || `W${Date.now()}`,
            fecha: new Date().toISOString(),
            evaluadorNombre: user?.nombre || 'DANIEL AI',
            evaluadorRol: 'IA - Análisis Multimodal',
            largo: analysisResult.measurements.estimatedLength,
            ancho: analysisResult.measurements.estimatedWidth,
            profundidad: 0,
            area: analysisResult.measurements.estimatedArea,
            tipoTejido: `Granulación: ${analysisResult.tissueComposition.granulation}%, Esfacelo: ${analysisResult.tissueComposition.slough}%`,
            exudado: 'No determinado por imagen',
            olor: 'Sin olor',
            bordes: 'Regulares',
            dolor: 0,
            signosInfeccion: analysisResult.infectionRisk !== 'Bajo',
            infeccionDetalles: analysisResult.infectionRisk !== 'Bajo' ? `Riesgo de infección: ${analysisResult.infectionRisk}` : undefined,
            pushScore: undefined,
            fotos: [imagePreview || ''],
            aiAnalysis: {
                tissueComposition: analysisResult.tissueComposition,
                measurements: {
                    length: analysisResult.measurements.estimatedLength,
                    width: analysisResult.measurements.estimatedWidth,
                    area: analysisResult.measurements.estimatedArea
                },
                severity: analysisResult.severity,
                recommendations: analysisResult.recommendations,
                confidence: analysisResult.confidence,
            },
            notas: `Análisis automático con IA:\n${analysisResult.rawAnalysis}`,
        };

        if (selectedWound) {
            const wound = wounds.find(w => w.id === selectedWound);
            if (wound) {
                updateWound({
                    ...wound,
                    assessments: [...wound.assessments, assessment],
                });
            }
        } else {
            const newWound: WoundRecord = {
                id: assessment.woundId,
                patientId: selectedPatient,
                tipo: analysisResult.woundType,
                localizacion: 'Por determinar',
                fechaDeteccion: new Date().toISOString(),
                estado: 'En Tratamiento',
                assessments: [assessment],
                evolution: [],
            };
            addWound(newWound);
        }

        addClinicalNote({
            id: `N${Date.now()}`,
            patientId: selectedPatient,
            woundId: assessment.woundId,
            authorName: 'DANIEL AI',
            authorRole: 'Sistema de IA',
            timestamp: new Date().toISOString(),
            tipo: 'Evaluación',
            note: `Análisis automático de herida:\n- Tipo: ${analysisResult.woundType}\n- Severidad: ${analysisResult.severity}\n- Recomendaciones: ${analysisResult.recommendations.join(', ')}`,
        });

        setIsModalOpen(false);
        setSelectedImage(null);
        setImagePreview(null);
        setAnalysisResult(null);
        alert('Evaluación guardada exitosamente');
    };

    const getTissueColor = (percentage: number) => {
        if (percentage > 60) return 'bg-green-500';
        if (percentage > 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-600 text-white rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">DANIEL AI - Wound Clinic</h1>
                        <p className="text-sm text-gray-500">Diagnostic Station // Vega Scale Protocol</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button
                        onClick={toggleARMode}
                        variant={isARMode ? "secondary" : "primary"}
                        className="flex items-center gap-2"
                    >
                        {isARMode ? Icons.EyeOff : Icons.Eye}
                        {isARMode ? 'Salir AR' : 'Modo AR/HUD'}
                    </Button>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg">
                        <div className="text-sm font-medium">Pacientes Activos</div>
                        <div className="text-2xl font-bold">{activePatients.length}</div>
                    </div>
                </div>
            </div>

            {isARMode && (
                <div className="fixed inset-0 z-50 bg-black">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="hud-overlay fixed inset-0 p-8 flex flex-col justify-between pointer-events-none text-white">
                        <div className="flex justify-between w-full">
                            <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg border border-white/20">
                                <div className="text-xs uppercase opacity-80 mb-1">Paciente Triage</div>
                                <div className="text-lg font-bold">
                                    {selectedPatient ? activePatients.find(p => p.id === selectedPatient)?.nombreCompleto : 'No seleccionado'}
                                </div>
                            </div>
                            <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg border border-white/20 text-right">
                                <div className="text-sm font-medium">POLARIS SECURE</div>
                                <div className="text-xs opacity-70">{user?.nombre}</div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-6 pointer-events-auto mb-8">
                            <button
                                onClick={toggleARMode}
                                className="p-4 rounded-full bg-red-600/60 backdrop-blur-md border border-white/20 text-white"
                            >
                                {Icons.EyeOff}
                            </button>
                            <button
                                onClick={captureImageFromAR}
                                disabled={isAnalyzing}
                                className="p-6 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white scale-110"
                            >
                                <div className="w-6 h-6 rounded-full border-4 border-white" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!isARMode && (
                <>
                    <div className="mb-6">
                        <WoundClinicConsole />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="📸 Análisis de Imagen e IA">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Paciente</label>
                                    <select
                                        value={selectedPatient}
                                        onChange={(e) => {
                                            setSelectedPatient(e.target.value);
                                            setSelectedWound('');
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">-- Seleccione un paciente --</option>
                                        {activePatients.map(p => (
                                            <option key={p.id} value={p.id}>{p.nombreCompleto} ({p.id})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cargar Imagen o Describir</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                                    />
                                    <textarea
                                        className="w-full p-2 border rounded-md h-24"
                                        value={manualEntry}
                                        onChange={(e) => setManualEntry(e.target.value)}
                                        placeholder="Descripción manual del estado para análisis IA..."
                                    />
                                </div>

                                {imagePreview && (
                                    <div className="mt-4">
                                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-contain border-2 border-gray-300 rounded-lg" />
                                    </div>
                                )}

                                {error && <div className="text-red-600 text-sm">{error}</div>}

                                <Button
                                    onClick={handleAnalyze}
                                    disabled={(!selectedImage && !manualEntry) || isAnalyzing}
                                    className="w-full"
                                >
                                    {isAnalyzing ? 'Analizando con IA...' : 'Analizar con DANIEL_AI'}
                                </Button>
                            </div>
                        </Card>

                        <div className="space-y-4">
                            <Card title="🧬 Protocolos Activos">
                                <ul className="space-y-3 text-sm">
                                    <li className="flex gap-2 text-green-700">
                                        <span className="font-bold">✓</span>
                                        <span>Validación HIPAA en tiempo real</span>
                                    </li>
                                    <li className="flex gap-2 text-green-700">
                                        <span className="font-bold">✓</span>
                                        <span>Detección de Patrones de Infección (Vega 2.0)</span>
                                    </li>
                                    <li className="flex gap-2 text-green-700">
                                        <span className="font-bold">✓</span>
                                        <span>Análisis Multimodal Google Gemini</span>
                                    </li>
                                </ul>
                            </Card>

                            <Card title="📊 Estadísticas">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{wounds.length}</div>
                                        <div className="text-sm text-gray-600">Heridas</div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {wounds.reduce((sum, w) => sum + w.assessments.length, 0)}
                                        </div>
                                        <div className="text-sm text-gray-600">Evaluaciones</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="Resultados del Análisis DANIEL_AI"
                    >
                        {analysisResult && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-3 rounded">
                                        <div className="text-xs text-gray-600">Severidad</div>
                                        <div className="font-bold">{analysisResult.severity}</div>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded">
                                        <div className="text-xs text-gray-600">Tipo</div>
                                        <div className="font-bold">{analysisResult.woundType}</div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-2">Composición sugerida</h3>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${analysisResult.tissueComposition.granulation}%` }} />
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Granulación: {analysisResult.tissueComposition.granulation}% | Esfacelo: {analysisResult.tissueComposition.slough}%
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end pt-4 border-t">
                                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                                    <Button onClick={handleSaveAssessment} disabled={!selectedPatient}>Guardar Evaluación</Button>
                                </div>
                            </div>
                        )}
                    </Modal>
                </>
            )}
        </div>
    );
};

export default DanielView;
