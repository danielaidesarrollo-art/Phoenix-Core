
export interface User {
    documento: string;
    nombre: string;
    cargo: string;
    correo: string;
    password?: string;
    turnoInicio?: string;
    turnoFin?: string;
    maxPacientes?: number;
}

export interface Patient {
    id: string;
    tipoDocumento: string;
    nombreCompleto: string;
    fechaNacimiento: string;
    direccion: string;
    coordinates?: { lat: number; lng: number };
    telefonoFijo: string;
    telefonoMovil: string;
    cuidadorPrincipal: string;
    telefonoCuidador: string;
    alergicoMedicamentos: boolean;
    alergiasInfo?: string;
    clinicaEgreso: string;
    diagnosticoEgreso: string;
    programa: string;
    terapias: Record<string, boolean>;
    estado: 'Pendiente' | 'Aceptado' | 'Rechazado';
    ingresadoPor: string;
    fechaIngreso: string;
    oxigeno?: { dispositivo: string; litraje: number };
    sondaInfo?: { tipo: string };
    heridaInfo?: { tipo: string; localizacion: string };
    glucometriaInfo?: { frecuencia: string };
    otrasTerapiasInfo?: string;
    antibiotico?: {
        medicamento: string;
        miligramos: number;
        frecuenciaHoras: number;
        fechaInicio: string;
        fechaTerminacion: string;
        diaActual: number;
        diasTotales: number;
    };
}

export interface HandoverNote {
    id: string;
    patientId: string;
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
    phlebitisScale?: string;
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
