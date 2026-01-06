import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { WoundRecord, Patient } from '../types.ts';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import Modal from './ui/Modal.tsx';
import Input from './ui/Input.tsx';
import Select from './ui/Select.tsx';
import { Icons, WOUND_TYPES, WOUND_LOCATIONS, WOUND_TREATMENTS } from '../constants.tsx';

const WoundRegistry: React.FC = () => {
    const { patients, wounds, addWound, updateWound } = useAppContext();
    const [isNewWoundModalOpen, setIsNewWoundModalOpen] = useState(false);
    const [selectedWound, setSelectedWound] = useState<WoundRecord | null>(null);
    const [filterPatient, setFilterPatient] = useState<string>('Todos');
    const [filterStatus, setFilterStatus] = useState<string>('Todos');

    // New wound form state
    const [newWound, setNewWound] = useState({
        patientId: '',
        tipo: '',
        localizacion: '',
        fechaDeteccion: new Date().toISOString().split('T')[0],
        estado: 'Abierta' as 'Abierta' | 'En Tratamiento' | 'Cerrada' | 'Complicada'
    });

    const filteredWounds = useMemo(() => {
        return wounds.filter(wound => {
            const patientMatch = filterPatient === 'Todos' || wound.patientId === filterPatient;
            const statusMatch = filterStatus === 'Todos' || wound.estado === filterStatus;
            return patientMatch && statusMatch;
        });
    }, [wounds, filterPatient, filterStatus]);

    const handleCreateWound = () => {
        if (!newWound.patientId || !newWound.tipo || !newWound.localizacion) {
            alert('Por favor complete todos los campos requeridos');
            return;
        }

        const wound: WoundRecord = {
            id: `W${Date.now()}`,
            patientId: newWound.patientId,
            tipo: newWound.tipo,
            localizacion: newWound.localizacion,
            fechaDeteccion: newWound.fechaDeteccion,
            estado: newWound.estado,
            assessments: [],
            evolution: []
        };

        addWound(wound);
        setIsNewWoundModalOpen(false);
        setNewWound({
            patientId: '',
            tipo: '',
            localizacion: '',
            fechaDeteccion: new Date().toISOString().split('T')[0],
            estado: 'Abierta'
        });
    };

    const getPatientName = (patientId: string) => {
        const patient = patients.find(p => p.id === patientId);
        return patient?.nombreCompleto || 'Paciente Desconocido';
    };

    const getWoundStatusColor = (estado: string) => {
        switch (estado) {
            case 'Abierta': return 'bg-red-100 text-red-800';
            case 'En Tratamiento': return 'bg-yellow-100 text-yellow-800';
            case 'Cerrada': return 'bg-green-100 text-green-800';
            case 'Complicada': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Registro de Heridas</h1>
                <Button onClick={() => setIsNewWoundModalOpen(true)}>
                    {Icons.Plus}
                    Registrar Nueva Herida
                </Button>
            </div>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    id="filter-patient"
                    label="Filtrar por Paciente"
                    value={filterPatient}
                    onChange={(e) => setFilterPatient(e.target.value)}
                >
                    <option value="Todos">Todos los Pacientes</option>
                    {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.nombreCompleto}</option>
                    ))}
                </Select>

                <Select
                    id="filter-status"
                    label="Filtrar por Estado"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="Todos">Todos los Estados</option>
                    <option value="Abierta">Abierta</option>
                    <option value="En Tratamiento">En Tratamiento</option>
                    <option value="Cerrada">Cerrada</option>
                    <option value="Complicada">Complicada</option>
                </Select>
            </div>

            {/* New Wound Modal */}
            <Modal
                isOpen={isNewWoundModalOpen}
                onClose={() => setIsNewWoundModalOpen(false)}
                title="Registrar Nueva Herida"
            >
                <div className="space-y-4">
                    <Select
                        id="patient-select"
                        label="Paciente *"
                        value={newWound.patientId}
                        onChange={(e) => setNewWound({ ...newWound, patientId: e.target.value })}
                        required
                    >
                        <option value="">Seleccione un paciente</option>
                        {patients.filter(p => p.estado === 'Activo').map(p => (
                            <option key={p.id} value={p.id}>{p.nombreCompleto} - {p.id}</option>
                        ))}
                    </Select>

                    <Select
                        id="wound-type"
                        label="Tipo de Herida *"
                        value={newWound.tipo}
                        onChange={(e) => setNewWound({ ...newWound, tipo: e.target.value })}
                        required
                    >
                        <option value="">Seleccione tipo</option>
                        {WOUND_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </Select>

                    <Select
                        id="wound-location"
                        label="Localización *"
                        value={newWound.localizacion}
                        onChange={(e) => setNewWound({ ...newWound, localizacion: e.target.value })}
                        required
                    >
                        <option value="">Seleccione localización</option>
                        {WOUND_LOCATIONS.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </Select>

                    <Input
                        id="detection-date"
                        type="date"
                        label="Fecha de Detección *"
                        value={newWound.fechaDeteccion}
                        onChange={(e) => setNewWound({ ...newWound, fechaDeteccion: e.target.value })}
                        required
                    />

                    <div className="flex gap-2 justify-end mt-6">
                        <Button onClick={() => setIsNewWoundModalOpen(false)} className="bg-gray-500 hover:bg-gray-600">
                            Cancelar
                        </Button>
                        <Button onClick={handleCreateWound}>
                            Registrar Herida
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Wounds List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWounds.length > 0 ? filteredWounds.map(wound => (
                    <Card key={wound.id} className="cursor-pointer hover:shadow-xl transition-shadow" onClick={() => setSelectedWound(wound)}>
                        <div className="space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg text-brand-blue">{wound.tipo}</p>
                                    <p className="text-sm text-gray-500">{getPatientName(wound.patientId)}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getWoundStatusColor(wound.estado)}`}>
                                    {wound.estado}
                                </span>
                            </div>

                            <div className="border-t pt-3 space-y-1 text-sm">
                                <p><strong className="text-gray-600">Localización:</strong> {wound.localizacion}</p>
                                <p><strong className="text-gray-600">Detección:</strong> {new Date(wound.fechaDeteccion).toLocaleDateString('es-CO')}</p>
                                <p><strong className="text-gray-600">Evaluaciones:</strong> {wound.assessments.length}</p>
                                {wound.fechaCierre && (
                                    <p><strong className="text-gray-600">Cierre:</strong> {new Date(wound.fechaCierre).toLocaleDateString('es-CO')}</p>
                                )}
                            </div>
                        </div>
                    </Card>
                )) : (
                    <p className="text-gray-500 col-span-full text-center mt-8">No se encontraron heridas registradas.</p>
                )}
            </div>

            {/* Wound Detail Modal */}
            {selectedWound && (
                <Modal
                    isOpen={!!selectedWound}
                    onClose={() => setSelectedWound(null)}
                    title={`Herida: ${selectedWound.tipo} - ${selectedWound.localizacion}`}
                >
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="font-bold text-brand-blue mb-2">Información del Paciente</p>
                            <p><strong>Nombre:</strong> {getPatientName(selectedWound.patientId)}</p>
                            <p><strong>ID:</strong> {selectedWound.patientId}</p>
                        </div>

                        <div className="space-y-2">
                            <p><strong>Tipo:</strong> {selectedWound.tipo}</p>
                            <p><strong>Localización:</strong> {selectedWound.localizacion}</p>
                            <p><strong>Estado:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getWoundStatusColor(selectedWound.estado)}`}>{selectedWound.estado}</span></p>
                            <p><strong>Fecha de Detección:</strong> {new Date(selectedWound.fechaDeteccion).toLocaleDateString('es-CO')}</p>
                            {selectedWound.fechaCierre && (
                                <p><strong>Fecha de Cierre:</strong> {new Date(selectedWound.fechaCierre).toLocaleDateString('es-CO')}</p>
                            )}
                        </div>

                        <div className="border-t pt-4">
                            <p className="font-bold mb-2">Evaluaciones Registradas: {selectedWound.assessments.length}</p>
                            {selectedWound.assessments.length === 0 && (
                                <p className="text-gray-500 text-sm">No hay evaluaciones registradas aún.</p>
                            )}
                        </div>

                        <div className="border-t pt-4">
                            <p className="font-bold mb-2">Evolución Fotográfica: {selectedWound.evolution.length}</p>
                            {selectedWound.evolution.length === 0 && (
                                <p className="text-gray-500 text-sm">No hay fotografías de evolución registradas.</p>
                            )}
                        </div>

                        <div className="flex gap-2 justify-end mt-6">
                            <Button onClick={() => setSelectedWound(null)} className="bg-gray-500 hover:bg-gray-600">
                                Cerrar
                            </Button>
                            <Button onClick={() => {
                                // TODO: Navigate to wound assessment/treatment view
                                alert('Funcionalidad de evaluación en desarrollo');
                            }}>
                                Evaluar Herida
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default WoundRegistry;
