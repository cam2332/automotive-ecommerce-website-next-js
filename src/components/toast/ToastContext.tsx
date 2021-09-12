import { createContext, useContext, useState } from 'react'
import ToastContainer from './ToastContainer'
import Placement from './types/Placement'
import Toast, { ToastInput } from './types/Toast'

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
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
