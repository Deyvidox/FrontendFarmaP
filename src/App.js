import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'

import './css/farmapatria-theme.css'
import './scss/style.scss'
import './scss/examples.scss'

//Páginas públicas
const Login = React.lazy(() => import('./components/login/Login'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

//Contenedor principal 
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>

          {/* 🔓 RUTAS PÚBLICAS */}
          <Route path="/login" element={<Login />} />
          <Route path="/500" element={<Page500 />} />

          {/* 🔹 RUTA PRINCIPAL */}
          <Route path="/" element={<Login />} />

          {/* 🔐 TODAS LAS RUTAS PROTEGIDAS VAN AQUÍ */}
          {/* INCLUYENDO APPOINTMENTS */}
          <Route path="/*" element={<DefaultLayout />} />

          {/* ❌ RUTA 404 */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App