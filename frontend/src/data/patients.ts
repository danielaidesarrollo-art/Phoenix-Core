import { Patient } from '../types';

export const getInitialPatients = (): Patient[] => {
  const now = new Date();
  return [
    {
      id: '12345678',
      tipoDocumento: 'Cédula de Ciudadanía',
      nombreCompleto: 'Juan Pérez García',
      fechaNacimiento: '1980-05-15',
      direccion: 'Calle Falsa 123, Bogotá',
      coordinates: { lat: 4.7110, lng: -74.0721 },
      telefonoFijo: '6012345678',
      telefonoMovil: '3001234567',
      cuidadorPrincipal: 'Maria Gonzalez',
      telefonoCuidador: '3017654321',
      alergicoMedicamentos: false,
      clinicaEgreso: 'Clínica La Colina',
      diagnosticoEgreso: 'Neumonía adquirida en la comunidad',
      programa: 'Virrey solis en Casa Hospitalario',
      terapias: { "atencion (visita) domiciliaria, por medicina general": true },
      estado: 'Pendiente',
      ingresadoPor: 'luisagn@virreysolisips.com.co',
      fechaIngreso: new Date(new Date().setDate(now.getDate() - 5)).toISOString(),
    },
    {
      id: '87654321',
      tipoDocumento: 'Cédula de Ciudadanía',
      nombreCompleto: 'Ana Rodríguez Mesa',
      fechaNacimiento: '1955-11-20',
      direccion: 'Avenida Siempre Viva 742, Bogotá',
      coordinates: { lat: 4.75, lng: -74.05 },
      telefonoMovil: '3109876543',
      telefonoFijo: '',
      cuidadorPrincipal: 'Carlos Rodríguez',
      telefonoCuidador: '3114567890',
      alergicoMedicamentos: true,
      alergiasInfo: 'Alergia a la Penicilina',
      clinicaEgreso: 'Fundación Cardioinfantil',
      diagnosticoEgreso: 'EPOC Exacerbado',
      programa: 'Virrey solis en Casa Crónico',
      terapias: { "atencion (visita) domiciliaria, por fisioterapia": true, "Oxígeno": true },
      oxigeno: { dispositivo: 'Cánula nasal', litraje: 2 },
      estado: 'Aceptado',
      ingresadoPor: 'anagc@virreysolisips.com.co',
      fechaIngreso: new Date(new Date().setDate(now.getDate() - 10)).toISOString(),
    }
  ];
};

export const initialPatients = getInitialPatients();