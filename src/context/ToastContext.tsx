import React, { createContext, useContext, useState } from 'react'
// eslint-disable-next-line import/no-cycle
import ToastContainer from '../components/toast/ToastContainer'
import Placement from '../components/toast/types/Placement'
import Toast, { ToastInput } from '../components/toast/types/Toast'

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

type ToastContextProps = {
  toasts: Toast[]
  addToast: (toast: ToastInput) => string
  removeToast: (id: string) => void
  removeAllToasts: () => void
  placement: Placement
  setPlacement: (placement: Placement) => void
}

export const ToastContext = createContext({} as ToastContextProps)

// eslint-disable-next-line react/prop-types
const ToastProvider: React.FC = ({ children }): React.ReactElement => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [placement, setPlacement] = useState<Placement>('bottom-left')

  return (
    <ToastContext.Provider
      value={{
        toasts: toasts,
        addToast: (toast) => {
          const id = uuidv4()
          setToasts((toasts) => [...toasts, { ...toast, id: id }])
          return id
        },
        removeToast: (id: string) => {
          const toast = toasts.find((toast) => toast.id === id)
          if (toast && toast.onDismiss) {
            toast.onDismiss()
          }
          setToasts((toasts) => toasts.filter((toast) => toast.id !== id))
        },
        removeAllToasts: () => setToasts([]),
        placement: placement,
        setPlacement: (placement: Placement) => {
          setPlacement(placement)
        },
      }}>
      <ToastContainer></ToastContainer>
      {children}
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const state = useContext(ToastContext)

  if (state === undefined) {
    throw new Error('useToastContext must be used within an ToastProvider')
  }

  return state
}

export default ToastProvider
