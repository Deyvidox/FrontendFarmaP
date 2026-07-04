import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilMedicalCross,
  cilExternalLink,
  cilWarning,
  cilGroup,
  cilHeart,
  cilList,
  cilTruck,
  cilCalendar,
  cilChart,
  cilClipboard,
  cilNotes,
  cilPaw,
  cilStorage,
  cilUserPlus,
  cilPencil,
  cilPlus,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUserFollow,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Panel de control',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Gestión',
  },

{
  component: CNavGroup,
  name: 'Usuarios',
  icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Registrar Usuario',
      to: '/users/register',
      icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Lista de Usuarios',
      to: '/users/list',
      icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Panel de Usuario',
      to: '/users/panel',
      icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
    },
  ],
},
{
  component: CNavGroup,
  name: 'Beneficiarios',
  icon: <CIcon icon={cilHeart} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Registrar Beneficiario',
      to: '/beneficiarios/registrar',
      icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Lista de Beneficiarios',
      to: '/beneficiarios/lista',
      icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    },
  ],
},
{
  component: CNavGroup,
  name: 'Medicamentos',
  icon: <CIcon icon={cilMedicalCross} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Registrar Medicamento',
      to: '/medicamentos/registrar',
      icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Catálogo',
      to: '/medicamentos/catalogo',
      icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Alertas de Vencimiento',
      to: '/medicamentos/alertas',
      icon: <CIcon icon={cilWarning} customClassName="nav-icon" />,
    },
  ],
},
{
  component: CNavGroup,
  name: 'Donaciones',
  icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Lista de Donaciones',
      to: '/donaciones/lista',
      icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Nueva Donación',
      to: '/donaciones/nueva',
      icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Gestión de Donantes',
      to: '/donaciones/donantes',
      icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
    },
  ],
},
{
  component: CNavGroup,
  name: 'Solicitudes',
  icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Lista de Solicitudes',
      to: '/solicitudes/lista',
      icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Nueva Solicitud',
      to: '/solicitudes/nueva',
      icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Gestión de Proveedores',
      to: '/solicitudes/proveedores',
      icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
    },
  ],
},
{
  component: CNavGroup,
  name: 'Entregas',
  icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Programación Entregas',
      to: '/entregas/lista',
      icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Nueva Entrega',
      to: '/entregas/nueva',
      icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
    },
  ],
},
  {
      component: CNavItem,
      name: 'Inventario',
      to: '/medicamentos/inventario',
      icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
    },
]

export default _nav
