import React from 'react';
import Card from '../ui/Card';
import { useAppContext } from '../../context/AppContext';

const DanielView: React.FC = () => {
    const { patients } = useAppContext();
    const woundPatients = patients.filter(p => p.programa === 'Clínica de Heridas');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">DANIEL AI - Wound Care</h1>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                    {woundPatients.length} Pacientes en Clínica de Heridas
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Análisis Clínico">
                    <p className="text-gray-600 mb-4">IA Avanzada para diagnóstico y seguimiento de heridas.</p>
                    <div className="space-y-2">
                        {woundPatients.map(p => (
                            <div key={p.id} className="flex justify-between text-sm border-b pb-1">
                                <span>{p.nombreCompleto}</span>
                                <span className="text-blue-600 font-medium">Analizar</span>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card title="Progreso de Heridas">
                    <p className="text-gray-600">Visualiza tendencias de cicatrización a lo largo del tiempo.</p>
                    <div className="mt-4 h-32 bg-gray-50 rounded flex items-center justify-center border-dashed border-2 text-gray-400">
                        [Gráfico de Progreso]
                    </div>
                </Card>
                <Card title="Planes de Tratamiento">
                    <p className="text-gray-600">Recomendaciones automatizadas basadas en protocolos internacionales.</p>
                    <button className="mt-4 w-full bg-brand-accent text-white py-2 rounded shadow hover:bg-brand-lightblue transition-colors">
                        Generar Recomendaciones
                    </button>
                </Card>
            </div>
        </div>
    );
};

export default DanielView;
