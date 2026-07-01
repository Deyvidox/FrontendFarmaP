import React from 'react'

// LOGIN Y USUARIOS
const Login = React.lazy(() => import('./components/login/Login'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const UserRegister = React.lazy(() => import('./components/users/UserRegister'))
const Users = React.lazy(() => import('./components/users/Users'))
const UserStats = React.lazy(() => import('./components/users/UserStats'))
// MEDICAMENTOS
const MedicamentoRegistrar = React.lazy(() => import('./components/medicamentos/MedicamentoRegistrar'))
const MedicamentoCatalogo = React.lazy(() => import('./components/medicamentos/MedicamentoCatalogo'))
const MedicamentoAlertas = React.lazy(() => import('./components/medicamentos/MedicamentoAlertas'))
const MedicamentoInventario = React.lazy(() => import('./components/medicamentos/MedicamentoInventario'))
// BENEFICIARIOS
const Beneficiaries = React.lazy(() => import('./components/beneficiarios/Beneficiaries'))
const BeneficiaryRegister = React.lazy(() => import('./components/beneficiarios/BeneficiaryRegister'))

const Donations = React.lazy(() => import('./components/donaciones/Donations'));
const Requests = React.lazy(() => import('./components/donaciones/Requests'));
const Deliveries = React.lazy(() => import('./components/entregas/Deliveries'));
const DonationRegister = React.lazy(() => import('./components/donaciones/DonationRegister'));
const RequestRegister = React.lazy(() => import('./components/donaciones//RequestRegister'));
const DeliveryRegister = React.lazy(() => import('./components/entregas/DeliveryRegister'));
const Donors = React.lazy(() => import('./components/donantes/Donors'));
const Providers = React.lazy(() => import('./components/proveedores/Providers'));

const routes = [
  // LOGIN
  { path: '/', exact: true, name: 'Login', element: Login },
  { path: '/login', name: 'Login', element: Login },

  // PRIVADAS
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/users/register', name: 'Register User', element: UserRegister },
  { path: '/users/list', name: 'Users', element: Users },
  { path: '/users/panel', name: 'Users Stats', element: UserStats },

   // MEDICAMENTOS
  { path: '/medicamentos/registrar', name: 'Registrar Medicamento', element: MedicamentoRegistrar },
  { path: '/medicamentos/catalogo', name: 'Catálogo de Medicamentos', element: MedicamentoCatalogo },
  { path: '/medicamentos/alertas', name: 'Alertas de Vencimiento', element: MedicamentoAlertas },
  { path: '/medicamentos/inventario', name: 'Inventario de Medicamentos', element: MedicamentoInventario },
    // BENEFICIARIOS 
  { path: '/beneficiarios/lista', name: 'Lista de Beneficiarios', element: Beneficiaries },
  { path: '/beneficiarios/registrar', name: 'Registrar Beneficiario', element: BeneficiaryRegister },

  // DONACIONES
  { path: '/donaciones/lista', name: 'Donaciones', element: Donations },
  { path: '/donaciones/nueva', name: 'Nueva Donación', element: DonationRegister },
  { path: '/donaciones/donantes', name: 'Gestión de Donantes', element: Donors },
  // SOLICITUDES
  { path: '/solicitudes/lista', name: 'Solicitudes', element: Requests },
  { path: '/solicitudes/nueva', name: 'Nueva Solicitud', element: RequestRegister },
  { path: '/solicitudes/proveedores', name: 'Gestión de Proveedores', element: Providers },
  // ENTREGAS
  { path: '/entregas/lista', name: 'Entregas', element: Deliveries },
  { path: '/entregas/nueva', name: 'Nueva Entrega', element: DeliveryRegister },
]

export default routes
