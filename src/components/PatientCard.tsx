import React, { useState, useMemo, useEffect } from 'react';
import { Patient, ClinicalNote } from '../types.ts';
import Button from './ui/Button.tsx';
import { useAppContext } from '../context/AppContext.tsx';
import { calculateAge } from '../constants.tsx';
import Modal from './ui/Modal.tsx';

interface PatientCardProps {
    patient: Patient;
    onUpdate: (patient: Patient) => void;
    onClose: () => void;
    onEdit: (patient: Patient) => void;
}

const DetailItem: React.FC<{ label: string; value: any }> = ({ label, value }) => {
    const renderValue = () => {
        if (value === null || typeof value === 'undefined' || value === '') {
            return 'N/A';
        }
        if (typeof value === 'boolean') {
            return value ? 'Sí' : 'No';
        }
        if (typeof value === 'string' || typeof value === 'number') {
            return value;
        }
        return <span className="text-red-500 italic">Dato no válido</span>;
    };

    return (
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-md text-gray-900">{renderValue()}</p>
        </div>
    );
};

const PatientCard: React.FC<PatientCardProps> = ({ patient, onUpdate, onClose, onEdit }) => {
    const { user, clinicalNotes } = useAppContext();
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    // Auto-dismiss notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const patientNotes = useMemo(() => {
        if (!Array.isArray(clinicalNotes)) return [];
        return clinicalNotes
            .filter(note => note && note.patientId === patient.id)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [clinicalNotes, patient.id]);

    const safeRender = (value: any, fallback: string | number = 'N/A') => {
        const type = typeof value;
        if (type === 'string' || type === 'number') {
            return value;
        }
        return fallback;
    };

    const cargo = user?.cargo || '';
    const canManage = cargo.toUpperCase().includes('JEFE') ||
        cargo.toUpperCase().includes('COORDINADOR') ||
        cargo.toUpperCase().includes('ADMINISTRATIVO') ||
        cargo.toUpperCase().includes('ESPECIALISTA');

    const notifyRequester = (action: string) => {
        const email = patient.ingresadoPor;
        console.log(`[SIMULACIÓN EMAIL] Enviando correo a: ${email}`);
        console.log(`[SIMULACIÓN EMAIL] Acción: ${action}`);
        return `Se ha enviado una notificación al correo: ${email}`;
    };

    const handleActivatePatient = () => {
        const updatedPatient = { ...patient, estado: 'Activo' as const };
        onUpdate(updatedPatient);

        const emailMsg = notifyRequester('ACTIVADO');
        setNotification({
            type: 'success',
            message: `✔ Paciente ACTIVADO correctamente. ${emailMsg}`
        });
    };

    const handleInactivatePatient = () => {
        const updatedPatient = { ...patient, estado: 'Inactivo' as const };
        onUpdate(updatedPatient);
        setIsStatusModalOpen(false);

        const emailMsg = notifyRequester('INACTIVADO');
        setNotification({
            type: 'success',
            message: `⚠ Paciente marcado como INACTIVO. ${emailMsg}`
        });
    };

    const handleOpenMap = () => {
        if (typeof patient.direccion === 'string' && patient.direccion) {
            const query = encodeURIComponent(patient.direccion);
            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
        }
    };

    const renderNoteContent = (note: ClinicalNote) => {
        return (
            <div className="mt-2 border-t pt-2 space-y-2">
                <div className="mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mb-2">
                        {note.tipo}
                    </span>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.note}</p>
                </div>

                {note.signosVitales && (
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        <strong className="font-medium">Signos Vitales:</strong>
                        <ul className="list-disc list-inside pl-4 text-gray-700 mt-1">
                            <li>TA: {note.signosVitales.tensionArterial}</li>
                            <li>FC: {note.signosVitales.frecuenciaCardiaca}</li>
                            <li>Temp: {note.signosVitales.temperatura}</li>
                            <li>Sat O2: {note.signosVitales.saturacionO2}</li>
                        </ul>
                    </div>
                )}

                {note.fotos && note.fotos.length > 0 && (
                    <div className="text-xs text-gray-600">
                        <strong className="font-medium">Fotografías adjuntas:</strong> {note.fotos.length}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6 relative">
            {/* Notification Banner */}
            {notification && (
                <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {notification.type === 'success'
                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        }
                    </svg>
                    <span className="font-medium">{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="ml-4 hover:bg-white/20 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-brand-blue">{safeRender(patient.nombreCompleto)}</h3>
                        <p className="text-sm text-gray-600">ID: {safeRender(patient.id)} | Edad: {calculateAge(patient.fechaNacimiento)} años</p>
                    </div>
                    <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${patient.estado === 'Activo' ? 'bg-green-100 text-green-800' :
                        patient.estado === 'Alta' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'}`}>
                        {safeRender(patient.estado)}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                <h4 className="col-span-full text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Datos de Identificación</h4>
                <DetailItem label="Tipo de Documento" value={patient.tipoDocumento} />
                <DetailItem label="Teléfono Móvil" value={patient.telefonoMovil} />
                <DetailItem label="Teléfono Fijo" value={patient.telefonoFijo} />
                <DetailItem label="Contacto de Emergencia" value={patient.contactoEmergencia} />
                <DetailItem label="Teléfono de Emergencia" value={patient.telefonoEmergencia} />
                <DetailItem label="Alérgico a Medicamentos" value={patient.alergicoMedicamentos} />
                {patient.alergicoMedicamentos && patient.alergiasInfo && <DetailItem label="Detalle Alergias" value={patient.alergiasInfo} />}
                {patient.direccion && (
                    <div className="col-span-full">
                        <p className="text-sm font-medium text-gray-500">Dirección</p>
                        <div className="flex items-center gap-4">
                            <p className="text-md text-gray-900">{safeRender(patient.direccion)}</p>
                            <button onClick={handleOpenMap} className="text-sm text-blue-600 hover:underline">Ver en mapa</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <h4 className="col-span-full text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Datos Clínicos</h4>
                <DetailItem label="Diagnóstico Principal" value={patient.diagnosticoPrincipal} />
                <div className="md:col-span-2"><DetailItem label="Programa" value={patient.programa} /></div>

                <div className="col-span-full">
                    <p className="text-sm font-medium text-gray-500">Tratamientos Activos</p>
                    <ul className="list-disc list-inside text-md text-gray-900">
                        {patient.tratamientos && typeof patient.tratamientos === 'object' && patient.tratamientos !== null && Object.entries(patient.tratamientos).filter(([_, active]) => active).map(([tratamiento]) => (
                            <li key={tratamiento}>{tratamiento}</li>
                        ))}
                    </ul>
                </div>

                {patient.wounds && patient.wounds.length > 0 && (
                    <div className="col-span-full">
                        <p className="text-sm font-medium text-gray-500">Heridas Registradas</p>
                        <p className="text-md text-gray-900">{patient.wounds.length} herida(s) en el sistema</p>
                        <button
                            onClick={() => {/* TODO: Navigate to wounds view */ }}
                            className="text-sm text-blue-600 hover:underline mt-1"
                        >
                            Ver detalles de heridas
                        </button>
                    </div>
                )}
            </div>

            <div className="border-t pt-4">
                <button
                    onClick={() => setIsHistoryVisible(!isHistoryVisible)}
                    className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-700 hover:text-brand-blue transition-colors"
                    aria-expanded={isHistoryVisible}
                >
                    <span>Historial de Notas Clínicas ({patientNotes.length})</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isHistoryVisible ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
                {isHistoryVisible && (
                    <div className="mt-4 space-y-4 max-h-60 overflow-y-auto pr-2 border-l-2 border-gray-100 pl-4">
                        {patientNotes.length > 0 ? (
                            patientNotes.map((note: ClinicalNote) => (
                                <div key={note.id} className="bg-gray-50 p-3 rounded-md border text-sm">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <p className="font-bold text-gray-800">{safeRender(note.authorName)}</p>
                                            <p className="text-xs text-gray-500">{safeRender(note.authorRole)}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{new Date(note.timestamp).toLocaleString('es-CO')}</span>
                                    </div>
                                    {renderNoteContent(note)}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic">No hay notas clínicas registradas para este paciente.</p>
                        )}
                    </div>
                )}
            </div>

            {canManage && (
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button variant="secondary" onClick={() => onEdit(patient)}>Editar</Button>
                    {patient.estado === 'Inactivo' && (
                        <Button onClick={handleActivatePatient}>Activar Paciente</Button>
                    )}
                    {patient.estado === 'Activo' && (
                        <Button variant="danger" onClick={() => setIsStatusModalOpen(true)}>Marcar Inactivo</Button>
                    )}
                </div>
            )}

            <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} title="Confirmar Inactivación">
                <div className="space-y-4">
                    <p className="text-gray-700">
                        ¿Está seguro de que desea marcar este paciente como inactivo? Podrá reactivarlo más tarde si es necesario.
                    </p>
                    <div className="flex justify-end gap-4">
                        <Button variant="secondary" onClick={() => setIsStatusModalOpen(false)}>Cancelar</Button>
                        <Button variant="danger" onClick={handleInactivatePatient}>Marcar Inactivo</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PatientCard;
