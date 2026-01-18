
import React from 'react';
import {
    Home,
    Clipboard,
    Calendar,
    Map as MapIcon,
    Milestone,
    User as UserIcon,
    Users,
    ClipboardCheck,
    LogOut,
    Lock,
    Search,
    Filter,
    Plus,
    ChevronDown,
    X
} from 'lucide-react';

export const Icons = {
    Home: <Home size={20} />,
    Clipboard: <Clipboard size={20} />,
    Calendar: <Calendar size={20} />,
    Map: <MapIcon size={20} />,
    Route: <Milestone size={20} />,
    Profile: <UserIcon size={20} />,
    User: <UserIcon size={20} />,
    Users: <Users size={20} />,
    ClipboardCheck: <ClipboardCheck size={20} />,
    Logout: <LogOut size={20} />,
    Lock: <Lock size={20} />,
    Search: <Search size={20} />,
    Filter: <Filter size={20} />,
    Plus: <Plus size={20} />,
    ChevronDown: <ChevronDown size={20} />,
    Close: <X size={20} />
};

export const PROGRAMAS = [
    'Padre',
    'Amor',
    'Gracia',
    'Fé',
    'Esperanza'
];

export const DOCUMENT_TYPES = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'PA', label: 'Pasaporte' }
];

export const CLINICAS_ORIGEN = [
    'Clínica San Juan',
    'Hospital Central',
    'Clínica del Norte',
    'Clínica del Sur'
];

export const TERAPIAS_HOSPITALARIO = [
    'Terapia Física',
    'Terapia Respiratoria',
    'Terapia Ocupacional'
];

export const TERAPIAS_CRONICO = [
    'Cuidado Crónico Base',
    'Cuidado Crónico Avanzado'
];

export const TERAPIAS_PALIATIVO = [
    'Cuidado Paliativo',
    'Control de Síntomas'
];

export const ANTIBIOTICOS = [
    'Ceftriaxona',
    'Vancomicina',
    'Meropenem'
];

export const DIAGNOSTICOS = [
    'Infección de Vías Urinarias',
    'Neumonía',
    'Celulitis'
];

export const OXIGENO_DISPOSITIVOS = [
    { value: 'CANULA', label: 'Cánula Nasal' },
    { value: 'MASCARA', label: 'Máscara Simple' },
    { value: 'VENTURI', label: 'Mascara Venturi' },
    { value: 'RESERVORIO', label: 'Máscara con Reservorio' }
];

export const SONDA_TIPOS = [
    { value: 'VESICAL', label: 'Sonda Vesical' },
    { value: 'NASOGASTRICA', label: 'Sonda Nasogástrica' },
    { value: 'GASTROSTOMIA', label: 'Sonda de Gastrostomía' }
];

export const GLUCOMETRIA_FRECUENCIAS = [
    { value: 'AYUNAS', label: 'En Ayunas' },
    { value: 'POSTPRANDIAL', label: 'Post-prandial' },
    { value: 'CADA_6_HORAS', label: 'Cada 6 horas' },
    { value: 'CADA_8_HORAS', label: 'Cada 8 horas' }
];

export const GUIA_INFUSION_ANTIBIOTICOS = [
    'Guía 1',
    'Guía 2',
    'Guía 3'
];

export const EXCLUDED_FROM_ROUTES = [
    'Admin',
    'SuperUser'
];

export const SERVICE_ROLE_MAPPING = {
    'MEDICO': 'MEDICO DOMICILIARIO',
    'ENFERMERA': 'ENFERMERO(A) JEFE PAD'
};

export const ROLES_ASISTENCIALES = [
    'MEDICO DOMICILIARIO',
    'ENFERMERO(A) JEFE PAD',
    'AUXILIAR DE ENFERMERIA',
    'FISIOTERAPEUTA',
    'FONOAUDIOLOGO',
    'TERAPEUTA OCUPACIONAL',
    'NUTRICIONISTA',
    'PSICOLOGO',
    'TRABAJADOR SOCIAL'
];

export const AUDIFARMA_EMAILS = [
    'pedidos@audifarma.com.co',
    'soporte@audifarma.com.co'
];

export const MEDICAMENTOS_ALTO_RIESGO = [
    'Insulina',
    'Warfarina',
    'Heparina',
    'Metotrexato'
];

export const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};
