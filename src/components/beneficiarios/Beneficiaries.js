import React from 'react';
import { CContainer } from '@coreui/react';
import BeneficiaryList from "./BeneficiaryList";
import '../../css/beneficiarios/Beneficiaries.css';

const Beneficiaries = () => {
  // Datos quemados basados en Tbl_Beneficiario de tu DB
  const beneficiariosQuemados = [
    {
      id: 1,
      BenCedula: 'V-12345678',
      BenNombres: 'María José',
      BenApellidos: 'González Pérez',
      BenEdad: 68,
      BenGenero: 'F',
      Comunidad: 'Los Olivos',
      ComMunicipio: 'Sucre',
      BenTelefonoPersonal: '+58 412 1234567',
      BenEmail: 'mariaj@ejemplo.com',
      BenPersonasDependientes: 2,
      BenIngresosMensuales: 150.00,
      BenNivelPrioridad: 'ALTA',
      BenEstado: 'ACTIVO',
      BenFechaRegistro: '2024-01-15'
    },
    {
      id: 2,
      BenCedula: 'V-23456789',
      BenNombres: 'Carlos Manuel',
      BenApellidos: 'Rodríguez López',
      BenEdad: 45,
      BenGenero: 'M',
      Comunidad: 'El Valle',
      ComMunicipio: 'Libertador',
      BenTelefonoPersonal: '+58 414 2345678',
      BenEmail: 'carlosrl@ejemplo.com',
      BenPersonasDependientes: 3,
      BenIngresosMensuales: 200.00,
      BenNivelPrioridad: 'MEDIA',
      BenEstado: 'ACTIVO',
      BenFechaRegistro: '2024-01-20'
    },
    {
      id: 3,
      BenCedula: 'V-34567890',
      BenNombres: 'Ana Isabel',
      BenApellidos: 'Martínez García',
      BenEdad: 52,
      BenGenero: 'F',
      Comunidad: 'Petare',
      ComMunicipio: 'Sucre',
      BenTelefonoPersonal: '+58 416 3456789',
      BenEmail: 'anamg@ejemplo.com',
      BenPersonasDependientes: 1,
      BenIngresosMensuales: 180.50,
      BenNivelPrioridad: 'ALTA',
      BenEstado: 'ACTIVO',
      BenFechaRegistro: '2024-01-25'
    },
    {
      id: 4,
      BenCedula: 'V-45678901',
      BenNombres: 'Pedro Antonio',
      BenApellidos: 'Sánchez Díaz',
      BenEdad: 35,
      BenGenero: 'M',
      Comunidad: 'La Vega',
      ComMunicipio: 'Libertador',
      BenTelefonoPersonal: '+58 424 4567890',
      BenEmail: 'pedrosd@ejemplo.com',
      BenPersonasDependientes: 0,
      BenIngresosMensuales: 250.00,
      BenNivelPrioridad: 'BAJA',
      BenEstado: 'ACTIVO',
      BenFechaRegistro: '2024-02-01'
    },
    {
      id: 5,
      BenCedula: 'V-56789012',
      BenNombres: 'Luisa Fernanda',
      BenApellidos: 'Hernández Castro',
      BenEdad: 60,
      BenGenero: 'F',
      Comunidad: 'Catia',
      ComMunicipio: 'Libertador',
      BenTelefonoPersonal: '+58 426 5678901',
      BenEmail: 'luisahc@ejemplo.com',
      BenPersonasDependientes: 2,
      BenIngresosMensuales: 120.00,
      BenNivelPrioridad: 'ALTA',
      BenEstado: 'INACTIVO',
      BenFechaRegistro: '2024-02-05'
    }
  ];

  return (
    <CContainer fluid className="beneficiaries-container">
      <BeneficiaryList beneficiaries={beneficiariosQuemados} />
    </CContainer>
  );
};

export default Beneficiaries;