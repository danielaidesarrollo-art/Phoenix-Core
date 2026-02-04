
import React, { useState } from 'react';
import { Icons, API_BASE_URL } from '../constants';

const AdminView: React.FC = () => {
    const [downloading, setDownloading] = useState(false);

    const handleDownloadReport = async () => {
        setDownloading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/admin/report`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Phoenix_Clinical_Report_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Failed to download report:", error);
            alert("Error al descargar el informe operacional.");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    {Icons.Admin} Panel de Administración Operacional
                </h2>
                <button
                    onClick={handleDownloadReport}
                    disabled={downloading}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-sm">download</span>
                    {downloading ? "Generando..." : "Descargar Informe CSV"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AdminStatCard title="Total Pacientes" value="124" icon={Icons.Patients} color="blue" />
                <AdminStatCard title="Heridas Analizadas" value="842" icon={Icons.Healing} color="purple" />
                <AdminStatCard title="Cumplimiento Legal" value="99.2%" icon={Icons.Safe} color="green" />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200">
                    <h3 className="font-bold text-slate-700">Monitor de Operaciones DANIEL AI</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <LogEntry
                            time="Hace 2 min"
                            user="Dr. Daniel"
                            action="Diagnóstico IA Ejecutado"
                            details="Med-Gemma-2b validó úlcera grado 3 en Sacro."
                            status="success"
                        />
                        <LogEntry
                            time="Hace 15 min"
                            user="Enf. Sofia"
                            action="Captura Astra Multimodal"
                            details="Nube de puntos 3D sincronizada correctamente."
                            status="success"
                        />
                        <LogEntry
                            time="Hace 1 hora"
                            user="Sistema"
                            action="Sincronización SafeCore"
                            details="Tokens de seguridad renovados L3."
                            status="info"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminStatCard = ({ title, value, icon, color }: any) => {
    const colorClasses: any = {
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        green: 'bg-green-50 text-green-600'
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">{title}</p>
                    <p className="text-2xl font-bold text-slate-800">{value}</p>
                </div>
            </div>
        </div>
    );
};

const LogEntry = ({ time, user, action, details, status }: any) => {
    return (
        <div className="flex gap-4 items-start p-3 border-l-2 border-slate-100 hover:border-blue-400 hover:bg-slate-50 transition-all rounded-r-lg">
            <div className="text-[10px] text-slate-400 font-mono w-16 pt-1">
                {time}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 text-sm">{user}</span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">{action}</span>
                </div>
                <p className="text-slate-500 text-xs mt-1">{details}</p>
            </div>
            <div className={`w-2 h-2 rounded-full mt-2 ${status === 'success' ? 'bg-green-400' : 'bg-blue-400'}`}></div>
        </div>
    );
}

export default AdminView;
