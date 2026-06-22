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
      style={{ 
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        borderRight: 'none'
      }}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader 
        className="border-bottom" 
        style={{ 
          borderColor: 'rgba(255,255,255,0.06) !important',
          background: 'transparent',
          padding: '16px'
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
              justifyContent: 'center',
              padding: '0'
            }}
          >
            <img 
              src={logoCompleto} 
              alt="FarmaPatria" 
              style={{ 
                width: '100%',
                maxWidth: '180px',
                height: 'auto',
                objectFit: 'contain',
                filter: 'brightness(1.1)'
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
          borderColor: 'rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.15)'
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