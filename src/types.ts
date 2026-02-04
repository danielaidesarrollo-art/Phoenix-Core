export interface Patient {
    id: string;
    tipoDocumento: string;
    nombreCompleto: string;
    fechaNacimiento: string;
    direccion?: string;
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
    diagnosticoEgreso?: string;
    clinicaEgreso?: string;
    programa: string;
    tratamientos?: { [key: string]: boolean };
    terapias?: { [key: string]: boolean } | Record<string, boolean>;
    oxigeno?: { dispositivo: string; litraje: number };
    antibiotico?: AntibioticTreatment;
    sondaInfo?: { tipo: string };
    heridaInfo?: { tipo: string; localizacion: string };
    glucometriaInfo?: { frecuencia: string };
    otrasTerapiasInfo?: string;
    estado: 'Activo' | 'Inactivo' | 'Alta' | 'Pendiente' | 'Aceptado' | 'Rechazado';
    ingresadoPor: string;
    fechaIngreso: string;
    wounds?: WoundRecord[];
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

export interface WoundRecord {
    id: string;
    patientId: string;
    tipo: string;
    localizacion: string;
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
    largo: number;
    ancho: number;
    profundidad: number;
    area?: number;
    tipoTejido: string;
    exudado: string;
    olor: 'Sin olor' | 'Leve' | 'Moderado' | 'Fétido';
    bordes: 'Regulares' | 'Irregulares' | 'Macerados' | 'Fibróticos';
    dolor: number;
    signosInfeccion: boolean;
    infeccionDetalles?: string;
    pushScore?: number;
    fotos: string[];
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
    objetivoTerapeutico: string;
    aposito: string;
    frecuenciaCuracion: string;
    desbridamiento: boolean;
    desbridamientoTipo?: string;
    terapiaAdicional?: string[];
    antibioticos?: string[];
    analgesicos?: string[];
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
    woundId?: string;
    authorName: string;
    authorRole: string;
    timestamp: string;
    tipo: 'Evaluación' | 'Curación' | 'Seguimiento' | 'Complicación' | 'Alta';
    note: string;
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
    documento: string;
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

export interface HandoverNote {
    id: string;
    patientId: string;
    authorId: string;
    authorName: string;
    authorRole: string;
    timestamp: string;
    note: string;
    antibioticData?: any;
    antibioticStatus?: string;
    oxygenInfo?: string;
    labRequests?: string;
    referralInfo?: string;
    dischargeOrders?: string;
    ivAccessInfo?: string;
    phlebitisScale?: number;
    pressureUlcersInfo?: string;
    administracionMedicamentos?: string;
    curaciones?: string;
    manejoSondas?: string;
    tomaGlucometrias?: string;
    soporteNutricional?: string;
    estadoPiel?: string;
    signosVitales?: {
        tensionArterial: string;
        frecuenciaCardiaca: string;
        frecuenciaRespiratoria: string;
        temperatura: string;
        saturacionO2: string;
    };
    fisioterapia?: any;
    terapiaOcupacional?: any;
    fonoaudiologia?: any;
}
