import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLightbulb } from '@coreui/icons'
import '../../css/help-button-overrides.css'

const HelpButton = ({ title = 'Ayuda / Manual de Usuario', children }) => {
  const [visible, setVisible] = useState(false)
  const [portalNode, setPortalNode] = useState(null)

  useEffect(() => {
    setPortalNode(document.getElementById('help-button-portal'))
  }, [])

  // Estilos base del botón que se adaptan al tema oscuro mediante variables CSS
  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: 600,
    borderColor: 'var(--fp-accent, #f59e0b)',
    color: 'var(--fp-accent, #f59e0b)',
    backgroundColor: 'transparent',
    transition: 'all 0.2s ease',
    boxShadow: 'none',
  }

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = 'var(--fp-warning-bg, rgba(245,158,11,0.15))'
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(245,158,11,0.3)'
  }

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent'
    e.currentTarget.style.boxShadow = 'none'
  }

  const content = (
    <>
      <CButton
        color="warning"
        variant="outline"
        shape="rounded-pill"
        size="sm"
        onClick={() => setVisible(true)}
        title="Ayuda / Manual de Usuario"
        className="help-btn"
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CIcon icon={cilLightbulb} size="sm" />
        Ayuda
      </CButton>

      <CModal
        size="lg"
        visible={visible}
        onClose={() => setVisible(false)}
        backdrop={true}
        keyboard={false}
        className="help-modal"
      >
        <CModalHeader onClose={() => setVisible(false)} className="help-modal-header">
          <CModalTitle>
            <CIcon icon={cilLightbulb} className="me-2 text-warning" />
            {title}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="help-modal-body">
          <div className="help-modal-content">
            {children}
          </div>
        </CModalBody>
        <CModalFooter className="help-modal-footer">
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Entendido
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )

  if (!portalNode) {
    return content // Fallback si el portal aún no existe
  }

  return ReactDOM.createPortal(content, portalNode)
}

export default HelpButton