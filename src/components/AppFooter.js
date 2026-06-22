import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <CFooter className="px-4 py-3" style={{
      background: 'var(--fp-surface)',
      borderTop: '1px solid var(--fp-border)',
    }}>
      <div className="w-100 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <small style={{ color: 'var(--fp-text-muted)', fontSize: '0.82rem' }}>
          <strong style={{ color: 'var(--fp-primary)', fontWeight: 700 }}>FarmaPatria</strong> &copy; {currentYear} — Sistema de Gestión Farmacéutica
        </small>
        <small style={{ color: 'var(--fp-text-muted)', fontSize: '0.78rem' }}>
          Desarrollado por <strong style={{ color: 'var(--fp-text-secondary)' }}>David Parra</strong>
        </small>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)