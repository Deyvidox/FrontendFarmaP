import React, { useEffect, useState, useCallback } from 'react'
import '../../css/common/ToastNotification.css'

/**
 * ToastNotification – Componente de notificaciones que baja desde la parte superior.
 *
 * Props:
 *  - show:    boolean  — si debe mostrarse
 *  - message: string   — texto del mensaje
 *  - type:    'success' | 'danger' | 'warning' | 'info'
 *  - duration: number  — ms antes de auto-cerrar (default 4500)
 *  - onClose: función  — callback al cerrar
 */
const ToastNotification = ({ show, message, type = 'info', duration = 4500, onClose }) => {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  const handleClose = useCallback(() => {
    setExiting(true)
    setTimeout(() => {
      setVisible(false)
      setExiting(false)
      if (onClose) onClose()
    }, 350)
  }, [onClose])

  useEffect(() => {
    if (show) {
      setExiting(false)
      setVisible(true)

      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [show, duration, handleClose])

  if (!visible) return null

  const icons = {
    success: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    danger: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  }

  const labels = {
    success: 'Éxito',
    danger: 'Error',
    warning: 'Advertencia',
    info: 'Información',
  }

  return (
    <div className={`fp-toast fp-toast--${type} ${exiting ? 'fp-toast--exit' : 'fp-toast--enter'}`} role="alert" aria-live="polite">
      <div className="fp-toast__icon">
        {icons[type] || icons.info}
      </div>
      <div className="fp-toast__body">
        <span className="fp-toast__label">{labels[type] || 'Notificación'}</span>
        <span className="fp-toast__message">{message}</span>
      </div>
      <button className="fp-toast__close" onClick={handleClose} aria-label="Cerrar notificación">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div className="fp-toast__progress" style={{ animationDuration: `${duration}ms` }} />
    </div>
  )
}

export default ToastNotification
