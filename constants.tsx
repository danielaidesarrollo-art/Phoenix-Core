import React from 'react';
import {
    Users,
    Calendar,
    MapPin,
    User,
    LayoutDashboard,
    ClipboardList,
    Settings,
    Plus,
    Search,
    CheckCircle,
    XCircle,
    Clock,
    ShieldCheck,
    Package,
    Home,
    Clipboard,
    Route,
    ClipboardCheck,
    LogOut
} from 'lucide-react';

export const Icons = {
    Home: <Home size={20} />,
    Dashboard: <LayoutDashboard size={20} />,
    Patients: <Users size={20} />,
    Schedule: <Calendar size={20} />,
    Map: <MapPin size={20} />,
    Profile: <User size={20} />,
    Handover: <ClipboardList size={20} />,
    Clipboard: <Clipboard size={20} />,
    Route: <Route size={20} />,
    ClipboardCheck: <ClipboardCheck size={20} />,
    Production: <Package size={20} />,
    Settings: <Settings size={20} />,
    Plus: <Plus size={20} />,
    Search: <Search size={20} />,
    Success: <CheckCircle size={20} />,
    Error: <XCircle size={20} />,
    Pending: <Clock size={20} />,
    Safe: <ShieldCheck size={20} />,
    Logout: <LogOut size={20} />,
    Users: <Users size={20} />,
};

export const DOCUMENT_TYPES = ['CC', 'TI', 'CE', 'RC', 'PEP', 'PPT'];

export const CLINICAS_ORIGEN = [
    'Clínica Santa María',
    'Hospital Universitario',
    'Fundación Valle del Lili',
    'Hospital El Tunal',
    'Clínica Colombia',
    'Hospital San Ignacio'
];

export const PROGRAMAS = [
    'Clínica de Heridas',
    'Hospitalización Domiciliaria',
    'Cuidado Paliativo',
    'Terapia Física',
    'Terapia Respiratoria'
];

export const TERAPIAS_HOSPITALARIO = {
    'Aplicación de terapia antibiótica': false,
    'Oxígeno': false,
    'Manejo de Sondas': false,
    'curación mayor en casa por enfermería': false,
    'Toma de glucometrías': false,
    'Terapia Física': false,
    'Terapia Respiratoria': false
};

export const TERAPIAS_CRONICO = {
    'Manejo de Sondas': false,
    'curación mayor en casa por enfermería': false,
    'Toma de glucometrías': false,
    'Terapia Física': false,
    'Soporte Nutricional': false
};

export const TERAPIAS_PALIATIVO = {
    'Manejo de Dolor': false,
    'Acompañamiento Psicológico': false,
    'Cuidado de Heridas': false,
    'Soporte Nutricional': false
};

export const ANTIBIOTICOS = [
    'Vancomicina',
    'Ceftriaxona',
    'Meropenem',
    'Piperacilina Tazobactam',
    'Clindamicina',
    'Amoxicilina'
];

export const OXIGENO_DISPOSITIVOS = [
    'Cánula Nasal',
    'Máscara Simple',
    'Máscara con Reservorio',
    'Concentrador de Oxígeno',
    'Cilindro de Oxígeno'
];

export const SONDA_TIPOS = [
    'Sonda Vesical (Foley)',
    'Sonda Nasogástrica',
    'Sonda de Gastrostomía',
    'Cistostomía'
];

export const GLUCOMETRIA_FRECUENCIAS = [
    'Cada 6 horas',
    'Cada 8 horas',
    'Cada 12 horas',
    'Diario',
    'En ayunas'
];

export const GUIA_INFUSION_ANTIBIOTICOS = [
    { antibiotico: 'Vancomicina', vehiculo: 'SSN 0.9%', volumen: '250 ml', tiempo: '120 min' },
    { antibiotico: 'Ceftriaxona', vehiculo: 'SSN 0.9%', volumen: '100 ml', tiempo: '30 min' },
    { antibiotico: 'Meropenem', vehiculo: 'SSN 0.9%', volumen: '100 ml', tiempo: '60 min' }
];

export const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

// Route Planning Constants
export const EXCLUDED_FROM_ROUTES = [
    'ADMIN',
    'COORDINADOR GENERAL',
    'DIRECTOR',
    'SECRETARIA'
];

export const SERVICE_ROLE_MAPPING: Record<string, string[]> = {
    'Aplicación de terapia antibiótica': ['AUXILIAR DE ENFERMERIA'],
    'Oxígeno': ['AUXILIAR DE ENFERMERIA', 'MEDICO DOMICILIARIO'],
    'Manejo de Sondas': ['AUXILIAR DE ENFERMERIA', 'MEDICO DOMICILIARIO'],
    'curación mayor en casa por enfermería': ['AUXILIAR DE ENFERMERIA'],
    'Toma de glucometrías': ['AUXILIAR DE ENFERMERIA'],
    'Terapia Física': ['FISIOTERAPEUTA'],
    'Terapia Respiratoria': ['TERAPEUTA RESPIRATORIO', 'FISIOTERAPEUTA'],
    'Soporte Nutricional': ['NUTRICIONISTA'],
    'Manejo de Dolor': ['MEDICO DOMICILIARIO'],
    'Acompañamiento Psicológico': ['PSICOLOGO'],
    'Cuidado de Heridas': ['AUXILIAR DE ENFERMERIA', 'MEDICO DOMICILIARIO']
};

// Zone Restrictions
export const EXCLUDED_ZONES = [
    "Zona Norte - Restricción Médica",
    "Sector Industrial Delta",
    "Área de Cuarentena"
];

// API Configuration
export const API_BASE_URL = 'http://localhost:8000/api';

// Map Configuration
export const MAP_CENTER_DEFAULT = { lat: 4.624335, lng: -74.063644 };
