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
    LogOut,
    Eye,
    EyeOff,
    Milestone,
    Lock,
    Filter,
    ChevronDown,
    X
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
    Route: <Milestone size={20} />,
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
    Eye: <Eye size={20} />,
    EyeOff: <EyeOff size={20} />,
    Lock: <Lock size={20} />,
    Filter: <Filter size={20} />,
    ChevronDown: <ChevronDown size={20} />,
    Close: <X size={20} />,
};

export const DOCUMENT_TYPES = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'PA', label: 'Pasaporte' },
    { value: 'RC', label: 'Registro Civil' },
    { value: 'PEP', label: 'Permiso Especial de Permanencia' },
    { value: 'PPT', label: 'Permiso por Protección Temporal' }
];

export const CLINICAS_ORIGEN = [
    'Clínica Santa María',
    'Hospital Universitario',
    'Fundación Valle del Lili',
    'Hospital El Tunal',
    'Clínica Colombia',
    'Hospital San Ignacio',
    'Clínica San Juan',
    'Hospital Central',
    'Clínica del Norte',
    'Clínica del Sur'
];

export const PROGRAMAS = [
    'Clínica de Heridas Agudas',
    'Clínica de Heridas Crónicas',
    'Úlceras por Presión',
    'Pie Diabético',
    'Úlceras Venosas',
    'Quemaduras',
    'Heridas Quirúrgicas',
    'Padre',
    'Amor',
    'Gracia',
    'Fé',
    'Esperanza'
];

export const WOUND_TREATMENTS = {
    'Curación Avanzada': false,
    'Desbridamiento': false,
    'Terapia de Presión Negativa (VAC)': false,
    'Apósitos Hidrocoloides': false,
    'Apósitos con Plata': false,
    'Terapia Compresiva': false,
    'Injertos de Piel': false,
    'Terapia con Oxígeno Hiperbárico': false
};

export const WOUND_TYPES = [
    'Úlcera por Presión',
    'Úlcera Venosa',
    'Úlcera Arterial',
    'Pie Diabético',
    'Quemadura',
    'Herida Quirúrgica',
    'Traumática',
    'Otra'
];

export const WOUND_LOCATIONS = [
    'Sacro',
    'Talón',
    'Trocánter',
    'Maléolo',
    'Pie',
    'Pierna',
    'Brazo',
    'Otra'
];

export const ANTIBIOTICOS = [
    'Vancomicina',
    'Ceftriaxona',
    'Meropenem',
    'Piperacilina Tazobactam',
    'Clindamicina',
    'Amoxicilina'
];

export const OXIGENO_DISPOSITIVOS = [
    { value: 'CANULA', label: 'Cánula Nasal' },
    { value: 'MASCARA', label: 'Máscara Simple' },
    { value: 'VENTURI', label: 'Mascara Venturi' },
    { value: 'RESERVORIO', label: 'Máscara con Reservorio' },
    { value: 'CONCENTRADOR', label: 'Concentrador de Oxígeno' },
    { value: 'CILINDRO', label: 'Cilindro de Oxígeno' }
];

export const SONDA_TIPOS = [
    { value: 'VESICAL', label: 'Sonda Vesical' },
    { value: 'NASOGASTRICA', label: 'Sonda Nasogástrica' },
    { value: 'GASTROSTOMIA', label: 'Sonda de Gastrostomía' },
    { value: 'CISTOSTOMIA', label: 'Cistostomía' }
];

export const GLUCOMETRIA_FRECUENCIAS = [
    { value: 'AYUNAS', label: 'En Ayunas' },
    { value: 'POSTPRANDIAL', label: 'Post-prandial' },
    { value: 'CADA_6_HORAS', label: 'Cada 6 horas' },
    { value: 'CADA_8_HORAS', label: 'Cada 8 horas' },
    { value: 'CADA_12_HORAS', label: 'Cada 12 horas' },
    { value: 'DIARIO', label: 'Diario' }
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

// API Configuration
export const API_BASE_URL = 'http://localhost:8000/api';

// Roles Clínicos - Clínica de Heridas
export const ROLES_CLINICOS = [
    'MÉDICO ESPECIALISTA EN HERIDAS',
    'ENFERMERO(A) ESPECIALIZADO',
    'AUXILIAR DE ENFERMERÍA',
    'NUTRICIONISTA',
    'FISIOTERAPEUTA',
    'CIRUJANO PLÁSTICO'
];

export const ROLES_ASISTENCIALES = [
    'MÉDICO DOMICILIARIO',
    'ENFERMERO(A) JEFE PAD ADMINISTRATIVO',
    'AUXILIAR DE ENFERMERÍA',
    'FISIOTERAPEUTA',
    'TERAPEUTA OCUPACIONAL',
    'FONOAUDIÓLOGO',
    'NUTRICIONISTA',
    'PSICÓLOGO',
    'TRABAJADOR SOCIAL'
];

// Wound Assessment Scales
export const PUSH_SCALE = {
    length_width: [0, 1, 2, 3, 4, 5],
    exudate: ['Ninguno', 'Escaso', 'Moderado', 'Abundante'],
    tissue_type: ['Cerrado', 'Tejido Epitelial', 'Tejido de Granulación', 'Esfacelo', 'Tejido Necrótico']
};

export const BRADEN_SCALE = {
    sensory_perception: [1, 2, 3, 4],
    moisture: [1, 2, 3, 4],
    activity: [1, 2, 3, 4],
    mobility: [1, 2, 3, 4],
    nutrition: [1, 2, 3, 4],
    friction_shear: [1, 2, 3]
};

// Auditfarma Emails
export const AUDITFARMA_EMAILS = [
    'auditoria@auditfarma.com',
    'produccion@auditfarma.com',
    'admin@auditfarma.com',
    'pedidos@audifarma.com.co',
    'soporte@audifarma.com.co'
];

// Medicamentos de Alto Riesgo
export const MEDICAMENTOS_ALTO_RIESGO = [
    'VANCOMICINA',
    'MEROPENEM',
    'IMIPENEM',
    'COLISTINA',
    'LINEZOLID',
    'DAPTOMICINA',
    'Insulina',
    'Warfarina',
    'Heparina',
    'Metotrexato'
];

// Terapias por Programa
export const TERAPIAS_HOSPITALARIO = {
    'Aplicación de terapia antibiótica': true,
    'Oxígeno': false,
    'Manejo de Sondas': false,
    'Toma de glucometrías': false,
    'Curación de heridas': false,
    'Terapia física': false,
    'Terapia respiratoria': false
};

export const TERAPIAS_CRONICO = {
    'Visita médica': true,
    'Enfermería': true,
    'Terapia física': false,
    'Terapia respiratoria': false,
    'Terapia ocupacional': false,
    'Fonoaudiología': false,
    'Nutrición': false,
    'Psicología': false,
    'Trabajo social': false
};

export const TERAPIAS_PALIATIVO = {
    'Visita médica': true,
    'Enfermería': true,
    'Manejo del dolor': true,
    'Psicología': true,
    'Apoyo espiritual': false,
    'Trabajo social': false
};

export const EXCLUDED_FROM_ROUTES = [
    'ADMINISTRADOR',
    'SOPORTE',
    'COORDINADOR'
];

export const SERVICE_ROLE_MAPPING: Record<string, string[]> = {
    'VISITA MÉDICA': ['MÉDICO DOMICILIARIO', 'MÉDICO ESPECIALISTA EN HERIDAS'],
    'ENFERMERÍA': ['AUXILIAR DE ENFERMERÍA', 'ENFERMERO(A) JEFE PAD ADMINISTRATIVO'],
    'APLICACIÓN DE TERAPIA ANTIBIÓTICA': ['AUXILIAR DE ENFERMERÍA'],
    'FISIOTERAPIA': ['FISIOTERAPEUTA'],
    'TERAPIA RESPIRATORIA': ['FISIOTERAPEUTA'],
    'TERAPIA OCUPACIONAL': ['TERAPEUTA OCUPACIONAL'],
    'FONOAUDIOLOGÍA': ['FONOAUDIÓLOGO'],
    'NUTRICIÓN': ['NUTRICIONISTA'],
    'PSICOLOGÍA': ['PSICÓLOGO'],
    'TRABAJO SOCIAL': ['TRABAJADOR SOCIAL']
};
