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

const HelpButton = ({ title, children }) => {
  const [visible, setVisible] = useState(false)
  const [portalNode, setPortalNode] = useState(null)

  useEffect(() => {
    setPortalNode(document.getElementById('help-button-portal'))
  }, [])

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
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: 600,
          borderColor: '#f9a825',
          color: '#7a5800',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#fff3cd'
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(249,168,37,0.3)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.boxShadow = 'none'
        }}
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
      >
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>
            <CIcon icon={cilLightbulb} className="me-2 text-warning" />
            {title}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="help-modal-content">
            {children}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Entendido
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )

  if (!portalNode) {
    return content // Fallback si no encuentra el portal
  }

  return ReactDOM.createPortal(content, portalNode)
}

export default HelpButton
