import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'

// sidebar nav config
import navigation from '../_nav'

// ✅ IMPORTAR LAS IMÁGENES DESDE ASSETS
import logoCompleto from '../../src/assets/images/menu.png'      // Logo completo

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      style={{ backgroundColor: '#1f1498' }}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader 
        className="border-bottom" 
        style={{ 
          borderColor: '#2a20b0 !important',
          backgroundColor: '#1f1498',
          padding: '12px 16px' // Aumentado el padding
        }}
      >
        <CSidebarBrand to="/" style={{ width: '100%' }}>
          {/* ✅ LOGO COMPLETO - más grande y ocupando todo el espacio */}
          <div 
            className="sidebar-brand-full" 
            style={{ 
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center', // Centrado horizontal
              padding: '0'
            }}
          >
            <img 
              src={logoCompleto} 
              alt="FarmaPatria" 
              style={{ 
                width: '100%', // Ocupa el 100% del ancho disponible
                maxWidth: '180px', // Tamaño máximo
                height: 'auto',
                objectFit: 'contain'
              }} 
            />
          </div>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          style={{ color: '#ffffff' }}
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      
      <AppSidebarNav items={navigation} />
      
      <CSidebarFooter 
        className="border-top d-none d-lg-flex" 
        style={{ 
          borderColor: '#2a20b0 !important',
          backgroundColor: '#3a31a1'
        }}
      >
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)