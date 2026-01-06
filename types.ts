export interface Patient {
    id: string;
    tipoDocumento: string;
    nombreCompleto: string;
    fechaNacimiento: string;
    direccion?: string; // Optional for clinic patients
    coordinates?: { lat: number; lng: number };
    telefonoFijo?: string;
    telefonoMovil: string;
    contactoEmergencia?: string;
    telefonoEmergencia?: string;
    cuidadorPrincipal?: string;
    telefonoCuidador?: string;
    alergicoMedicamentos: boolean;
    alergiasInfo?: string;
    diagnosticoPrincipal?: string;
    diagnosticoEgreso?: string; // Match usage
    clinicaEgreso?: string;
    programa: string;
    tratamientos?: { [key: string]: boolean };
    terapias?: { [key: string]: boolean }; // From data
    oxigeno?: { dispositivo: string; litraje: number };
    antibiotico?: AntibioticTreatment;
    sondaInfo?: { tipo: string };
    heridaInfo?: { tipo: string; localizacion: string };
    glucometriaInfo?: { frecuencia: string };
    otrasTerapiasInfo?: string;
    estado: 'Activo' | 'Inactivo' | 'Alta' | 'Pendiente' | 'Aceptado';
    ingresadoPor: string;
    fechaIngreso: string;
    wounds?: WoundRecord[]; // Array of wounds for this patient
}

export interface AntibioticTreatment {
    medicamento: string;
    miligramos: number;
    frecuenciaHoras: number;
    diasTotales: number;
    fechaInicio: string;
    fechaTerminacion: string;
    diaActual?: number;
}


// Wound Management Types
export interface WoundRecord {
    id: string;
    patientId: string;
    tipo: string; // From WOUND_TYPES
    localizacion: string; // From WOUND_LOCATIONS
    fechaDeteccion: string;
    fechaCierre?: string;
    estado: 'Abierta' | 'En Tratamiento' | 'Cerrada' | 'Complicada';
    assessments: WoundAssessment[];
    treatmentPlan?: TreatmentPlan;
    evolution: WoundEvolution[];
}

export interface WoundAssessment {
    id: string;
    woundId: string;
    fecha: string;
    evaluadorNombre: string;
    evaluadorRol: string;
    // Measurements
    largo: number; // cm
    ancho: number; // cm
    profundidad: number; // cm
    area?: number; // cm² (calculated)
    // Tissue Assessment
    tipoTejido: string; // From PUSH_SCALE.tissue_type
    exudado: string; // From PUSH_SCALE.exudate
    olor: 'Sin olor' | 'Leve' | 'Moderado' | 'Fétido';
    bordes: 'Regulares' | 'Irregulares' | 'Macerados' | 'Fibróticos';
    // Pain & Infection
    dolor: number; // 0-10 scale
    signosInfeccion: boolean;
    infeccionDetalles?: string;
    // PUSH Score
    pushScore?: number;
    // Photos
    fotos: string[]; // URLs or base64
    // AI Analysis
    aiAnalysis?: WoundAnalysisResult;
    notas?: string;
}

export interface WoundAnalysisResult {
    tissueComposition: {
        granulation: number;
        slough: number;
        necrotic: number;
        epithelial: number;
    };
    measurements: {
        length: number;
        width: number;
        area: number;
    };
    severity: 'Leve' | 'Moderada' | 'Severa';
    recommendations: string[];
    confidence: number;
}

export interface TreatmentPlan {
    id: string;
    woundId: string;
    fechaCreacion: string;
    creadoPor: string;
    // Treatment Details
    objetivoTerapeutico: string;
    aposito: string;
    frecuenciaCuracion: string; // "Diario", "Cada 2 días", etc.
    desbridamiento: boolean;
    desbridamientoTipo?: string;
    terapiaAdicional?: string[]; // VAC, compresión, etc.
    // Medications
    antibioticos?: string[];
    analgesicos?: string[];
    // Follow-up
    proximaEvaluacion: string;
    instrucciones: string;
    activo: boolean;
}

export interface WoundEvolution {
    id: string;
    woundId: string;
    fecha: string;
    foto: string;
    mediciones: {
        largo: number;
        ancho: number;
        profundidad: number;
    };
    notas?: string;
}


export interface ClinicalNote {
    id: string;
    patientId: string;
    woundId?: string; // Optional link to specific wound
    authorName: string;
    authorRole: string;
    timestamp: string;
    tipo: 'Evaluación' | 'Curación' | 'Seguimiento' | 'Complicación' | 'Alta';
    nota: string;
    signosVitales?: {
        tensionArterial: string;
        frecuenciaCardiaca: string;
        temperatura: string;
        saturacionO2: string;
    };
    fotos?: string[];
}

export interface User {
    id?: string;
    documento?: string;
    nombre: string;
    correo: string;
    institucion?: string;
    cargo: string;
    rol?: 'ADMIN' | 'USER';
    password?: string;
    turnoInicio?: string;
    turnoFin?: string;
    maxPacientes?: number;
}
