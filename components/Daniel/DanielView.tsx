import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import Card from '../ui/Card.tsx';
import Button from '../ui/Button.tsx';
import Modal from '../ui/Modal.tsx';
import { woundAnalysisService, WoundAnalysisResult } from '../../services/woundAnalysis.service.ts';
import { WoundRecord, WoundAssessment } from '../../types.ts';
import { Icons } from '../../constants.tsx';

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

    const activePatients = patients.filter(p => p.estado === 'Activo');
    const patientWounds = wounds.filter(w => w.patientId === selectedPatient);

    const toggleARMode = async () => {
        if (!isARMode) {
            if (!isBioCoreAuthenticated) {
                const bioData = prompt("Biometric Signature Required (BioCore). Enter 'auth' to proceed:");
                if (!bioData || !await validateBioCoreAuth(bioData)) {
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
                ctx.scale(-1, 1); // Flip back to normal for analysis
                ctx.drawImage(videoRef.current, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                        setSelectedImage(file);
                        setImagePreview(URL.createObjectURL(blob));
                        // Auto-analyze after capture
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

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage) {
            setError('Por favor selecciona una imagen');
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            const result = await woundAnalysisService.analyzeWoundImage(selectedImage);
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
            profundidad: 0, // Not measured from image
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
            // Update existing wound
            const wound = wounds.find(w => w.id === selectedWound);
            if (wound) {
                updateWound({
                    ...wound,
                    assessments: [...wound.assessments, assessment],
                });
            }
        } else {
            // Create new wound
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

        // Add clinical note
        addClinicalNote({
            id: `N${Date.now()}`,
            patientId: selectedPatient,
            woundId: assessment.woundId,
            authorName: 'DANIEL AI',
            authorRole: 'Sistema de IA',
            timestamp: new Date().toISOString(),
            tipo: 'Evaluación',
            nota: `Análisis automático de herida:\n- Tipo: ${analysisResult.woundType}\n- Severidad: ${analysisResult.severity}\n- Recomendaciones: ${analysisResult.recommendations.join(', ')}`,
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
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">DANIEL AI - Wound Care</h1>
                    <p className="text-gray-600 mt-1">Análisis Multimodal con Google Gemini & Med-Gemma</p>
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

            {/* AR Mode Overlay */}
            {isARMode && (
                <div className="fixed inset-0 z-50 bg-black">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="camera-feed"
                    />

                    <div className="hud-overlay">
                        {/* Top Bar: Patient & Security */}
                        <div className="flex justify-between w-full">
                            <div className="hud-corner hud-glass hud-accent-border">
                                <div className="text-xs uppercase opacity-80 mb-1">Paciente Triage</div>
                                <div className="text-lg font-bold">
                                    {selectedPatient ? activePatients.find(p => p.id === selectedPatient)?.nombreCompleto : 'No seleccionado'}
                                </div>
                                <div className="text-xs opacity-60">ID: {selectedPatient || '---'}</div>
                            </div>

                            <div className="hud-corner hud-glass text-right">
                                <div className="flex items-center justify-end gap-2 mb-1 text-xs">
                                    <img src="/assets/biocore_logo.jpg" alt="BioCore Logo" className="h-6 w-6 rounded-full border border-white/40" />
                                    <span className="font-bold tracking-wider">POLARIS SECURE</span>
                                </div>
                                {user && (
                                    <div className="text-sm font-medium">{user.nombre}</div>
                                )}
                                <div className="text-[10px] opacity-70">{user?.cargo}</div>
                            </div>
                        </div>

                        {/* Bottom Bar: Analysis & Actions */}
                        <div className="flex justify-between items-end w-full">
                            <div className="hud-corner">
                                {analysisResult && (
                                    <div className="hud-glass hud-accent-border animate-fade-in">
                                        <div className="text-xs uppercase opacity-80 mb-2">Resumen IA</div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>Severidad: <span className="text-yellow-400 font-bold">{analysisResult.severity}</span></div>
                                            <div>Confianza: <span className="text-blue-400 font-bold">{analysisResult.confidence}%</span></div>
                                            <div className="col-span-2">Tipo: <span className="font-bold">{analysisResult.woundType}</span></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="hud-corner flex justify-end gap-3 pointer-events-auto">
                                <button
                                    onClick={toggleARMode}
                                    className="p-4 rounded-full bg-red-600/60 backdrop-blur-md border border-white/20 text-white hover:bg-red-700/80 transition-all"
                                >
                                    {Icons.EyeOff}
                                </button>
                                <button
                                    onClick={captureImageFromAR}
                                    disabled={isAnalyzing}
                                    className="p-6 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white hover:bg-white/40 transition-all scale-110"
                                >
                                    {isAnalyzing ? (
                                        <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-4 border-white" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Central Sight Mask (Virtual Crosshair) */}
                    <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-16 h-16 border-2 border-white/20 rounded-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-white/40 rounded-full" />
                        </div>
                    </div>
                </div>
            )}

            {/* Main Analysis Section (only show if not in AR) */}
            {!isARMode && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left: Image Upload & Analysis */}
                        <Card title="📸 Análisis de Imagen">
                            <div className="space-y-4">
                                {/* Patient Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Seleccionar Paciente
                                    </label>
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
                                            <option key={p.id} value={p.id}>
                                                {p.nombreCompleto} ({p.id})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Wound Selection (optional) */}
                                {selectedPatient && patientWounds.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Herida Existente (opcional)
                                        </label>
                                        <select
                                            value={selectedWound}
                                            onChange={(e) => setSelectedWound(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">-- Nueva herida --</option>
                                            {patientWounds.map(w => (
                                                <option key={w.id} value={w.id}>
                                                    {w.tipo} - {w.localizacion} ({w.estado})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cargar Imagen de Herida
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="mt-4">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-64 object-contain border-2 border-gray-300 rounded-lg"
                                        />
                                    </div>
                                )}

                                {/* Error Display */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                        {error}
                                    </div>
                                )}

                                {/* Analyze Button */}
                                <Button
                                    onClick={handleAnalyze}
                                    disabled={!selectedImage || isAnalyzing}
                                    className="w-full"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Analizando con IA...
                                        </>
                                    ) : (
                                        <>
                                            {Icons.Search}
                                            Analizar Herida con IA
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card>

                        {/* Right: Statistics & Info */}
                        <div className="space-y-4">
                            <Card title="🧬 Capacidades de Análisis">
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span><strong>Identificación de Tejido:</strong> Granulación, esfacelo, necrosis, epitelización</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span><strong>Mediciones:</strong> Estimación de dimensiones y área</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span><strong>Clasificación:</strong> Tipo de herida y severidad</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span><strong>Riesgo:</strong> Evaluación de infección</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span><strong>Recomendaciones:</strong> Apósitos y terapias con Med-Gemma</span>
                                    </li>
                                </ul>
                            </Card>

                            <Card title="📊 Estadísticas">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{wounds.length}</div>
                                        <div className="text-sm text-gray-600">Heridas Registradas</div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {wounds.reduce((sum, w) => sum + w.assessments.length, 0)}
                                        </div>
                                        <div className="text-sm text-gray-600">Evaluaciones Totales</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Analysis Results Modal */}
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="Resultados del Análisis con IA"
                    >
                        {analysisResult && (
                            <div className="space-y-6">
                                {/* Tissue Composition */}
                                <div>
                                    <h3 className="font-bold text-lg mb-3">Composición de Tejido</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Granulación (tejido sano)</span>
                                                <span className="font-bold">{analysisResult.tissueComposition.granulation}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${getTissueColor(analysisResult.tissueComposition.granulation)}`}
                                                    style={{ width: `${analysisResult.tissueComposition.granulation}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Esfacelo</span>
                                                <span className="font-bold">{analysisResult.tissueComposition.slough}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-yellow-500 h-2 rounded-full"
                                                    style={{ width: `${analysisResult.tissueComposition.slough}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Tejido Necrótico</span>
                                                <span className="font-bold">{analysisResult.tissueComposition.necrotic}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-black h-2 rounded-full"
                                                    style={{ width: `${analysisResult.tissueComposition.necrotic}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Measurements */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-3 rounded">
                                        <div className="text-sm text-gray-600">Largo</div>
                                        <div className="text-xl font-bold">{analysisResult.measurements.estimatedLength} cm</div>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded">
                                        <div className="text-sm text-gray-600">Ancho</div>
                                        <div className="text-xl font-bold">{analysisResult.measurements.estimatedWidth} cm</div>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded">
                                        <div className="text-sm text-gray-600">Área</div>
                                        <div className="text-xl font-bold">{analysisResult.measurements.estimatedArea} cm²</div>
                                    </div>
                                </div>

                                {/* Classification */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-600">Tipo de Herida</div>
                                        <div className="font-bold text-lg">{analysisResult.woundType}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Severidad</div>
                                        <div className={`font-bold text-lg ${analysisResult.severity === 'Leve' ? 'text-green-600' :
                                            analysisResult.severity === 'Moderada' ? 'text-yellow-600' :
                                                'text-red-600'
                                            }`}>{analysisResult.severity}</div>
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Recomendaciones de Tratamiento</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {analysisResult.recommendations.map((rec, idx) => (
                                            <li key={idx}>{rec}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Suggested Dressings */}
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Apósitos Sugeridos (Med-Gemma)</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResult.suggestedDressings.map((dressing, idx) => (
                                            <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                                {dressing}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Suggested Therapies */}
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Terapias Sugeridas</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResult.suggestedTherapies.map((therapy, idx) => (
                                            <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                                {therapy}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Confidence */}
                                <div className="bg-gray-50 p-3 rounded">
                                    <div className="text-sm text-gray-600 mb-1">Confianza del Análisis</div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${analysisResult.confidence}%` }}
                                            />
                                        </div>
                                        <span className="font-bold">{analysisResult.confidence}%</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 justify-end pt-4 border-t">
                                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button onClick={handleSaveAssessment} disabled={!selectedPatient}>
                                        Guardar Evaluación
                                    </Button>
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
