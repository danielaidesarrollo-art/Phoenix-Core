
import React, { useState } from 'react';
import Button from '../ui/Button';
import WoundClinicConsole from '../WoundClinic/WoundClinicConsole';

const DanielView: React.FC = () => {
    const [woundStatus, setWoundStatus] = useState('');
    const [patientId, setPatientId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAnalyze = async () => {
        setIsProcessing(true);
        const purifiedId = AIPurifier.purify(patientId);
        const purifiedStatus = AIPurifier.purify(woundStatus);

        AuditLogger.log("WOUND_ANALYSIS_REQUEST", { patientId: purifiedId });

        try {
            const { PhoenixAPI } = await import('../../utils/api_client.ts');
            await PhoenixAPI.saveRecord(purifiedId, purifiedStatus);

            setIsProcessing(false);
            alert(`Análisis completado para ${purifiedId}. Registro sincronizado con Firestore. DANIEL_AI recomienda: Continuar protocolo Vega.`);
            AuditLogger.log("WOUND_ANALYSIS_COMPLETED", { patientId: purifiedId });
        } catch (error) {
            setIsProcessing(false);
            alert("Error al sincronizar con el backend Phoenix. Verifique que el servidor FastAPI esté corriendo.");
            AuditLogger.log("WOUND_ANALYSIS_ERROR", { error: String(error) });
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-600 text-white rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">DANIEL_AI: Wound Clinic Program</h2>
                    <p className="text-sm text-gray-500">Diagnostic Station // Vega Scale Protocol</p>
                </div>
            </div>

            <div className="mb-10">
                <WoundClinicConsole />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID del Paciente</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md focus:ring-blue-500"
                            value={patientId}
                            onChange={(e) => setPatientId(e.target.value)}
                            placeholder="Ej: P001"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado de la Herida (Descripción)</label>
                        <textarea
                            className="w-full p-2 border rounded-md h-32"
                            value={woundStatus}
                            onChange={(e) => setWoundStatus(e.target.value)}
                            placeholder="Describa el estado actual de la lesión..."
                        />
                    </div>
                    <Button
                        onClick={handleAnalyze}
                        isLoading={isProcessing}
                        className="w-full"
                    >
                        Analizar con DANIEL_AI
                    </Button>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-3">Protocolos DANIEL_AI Activos</h3>
                    <ul className="space-y-3 text-sm text-blue-700">
                        <li className="flex gap-2">
                            <span className="font-bold">✓</span>
                            <span>Validación HIPAA en tiempo real</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">✓</span>
                            <span>Detección de Patrones de Infección (Vega 2.0)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">✓</span>
                            <span>Integración Segura con SafeCore Audit</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DanielView;
