import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <CFooter className="px-4 py-3">
      <div className="w-100 text-center">
        <small className="text-muted">
          <strong>FarmaPatria</strong> &copy; {currentYear} | 
          Desarrollado por <strong>David Parra</strong>
        </small>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)