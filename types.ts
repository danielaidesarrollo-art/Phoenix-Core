export interface Patient {
    id: string;
    tipoDocumento: string;
    nombreCompleto: string;
    fechaNacimiento: string;
    direccion: string;
    coordinates?: { lat: number, lng: number };
    telefonoFijo?: string;
    telefonoMovil: string;
    cuidadorPrincipal: string;
    telefonoCuidador: string;
    alergicoMedicamentos: boolean;
    alergiasInfo?: string;
    clinicaEgreso: string;
    diagnosticoEgreso: string;
    programa: string;
    terapias: { [key: string]: boolean };
    oxigeno?: { dispositivo: string, litraje: number };
    antibiotico?: AntibioticTreatment;
    sondaInfo?: { tipo: string };
    heridaInfo?: { tipo: string, localizacion: string };
    glucometriaInfo?: { frecuencia: string };
    otrasTerapiasInfo?: string;
    estado: 'Aceptado' | 'Rechazado' | 'Pendiente';
    ingresadoPor: string;
    fechaIngreso: string;
}

export interface AntibioticTreatment {
    medicamento: string;
    fechaInicio: string;
    fechaTerminacion: string;
    miligramos: number;
    frecuenciaHoras: number;
    diasTotales: number;
    diaActual: number;
}

export interface HandoverNote {
    id: string;
    patientId: string;
    authorName: string;
    authorRole: string;
    timestamp: string;
    note?: string;
    antibioticData?: {
        action: string;
        medicamento?: string;
        dosisMg?: number;
        frecuenciaHoras?: number;
        diasTratamiento?: number;
    };
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

export interface User {
    id?: string;
    documento?: string;
    nombre: string;
    correo: string;
    cargo: string;
    rol?: 'ADMIN' | 'USER';
    password?: string;
    turnoInicio?: string;
    turnoFin?: string;
    maxPacientes?: number;
}
