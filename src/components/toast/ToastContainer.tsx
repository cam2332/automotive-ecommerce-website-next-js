import { useEffect, useLayoutEffect, useState } from 'react'
import { useToastContext } from '../../context/ToastContext'
import ToastElement from './ToastElement'

const placements = {
  'bottom-left': 'bottom-0 left-0',
  'bottom-center': 'bottom-0 left-1/2 ml-[-200px]',
  'bottom-right': 'bottom-0 right-0',
  'top-left': 'top-0 left-0',
  'top-center': 'top-0 left-1/2 ml-[-200px]',
  'top-right': 'top-0 right-0',
}

function useWindowSize() {
  const [size, setSize] = useState([0, 0])

  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
    }
    updateSize()

    window.addEventListener('resize', updateSize)

    return () => window.removeEventListener('resize', updateSize)
  }, [])
  return size
}

function ToastContainer() {
  const screenSize = useWindowSize()
  const { placement, toasts } = useToastContext()
  const [localToasts, setLocalToasts] = useState(
    placement === 'bottom-left' ||
      placement === 'bottom-center' ||
      placement === 'bottom-right'
      ? [...toasts].reverse()
      : toasts
  )

  useEffect(() => {
    setLocalToasts(
      placement === 'bottom-left' ||
        placement === 'bottom-center' ||
        placement === 'bottom-right'
        ? [...toasts].reverse()
        : toasts
    )
  }, [toasts])

  return (
    <>
      <div
        className={`fixed
      ${
        screenSize[0] <= 640
          ? placements['bottom-center']
          : placements[placement]
      } 
      w-auto h-auto p-3 overflow-hidden z-[1000]`}>
        {placement === 'bottom-left' ||
        placement === 'bottom-center' ||
        placement === 'bottom-right'
          ? [...toasts]
              .reverse()
              .map((toast) => (
                <ToastElement
                  key={toast.id}
                  id={toast.id}
                  text={toast.text}
                  appearance={toast.appearance}
                  autoDismiss={toast.autoDismiss}
                  dismissDelay={toast.dismissDelay}
                  onDismiss={toast.onDismiss}
                />
              ))
          : toasts.map((toast) => (
              <ToastElement
                key={toast.id}
                id={toast.id}
                text={toast.text}
                appearance={toast.appearance}
                autoDismiss={toast.autoDismiss}
                dismissDelay={toast.dismissDelay}
                onDismiss={toast.onDismiss}
              />
            ))}
      </div>
    </>
  )
}

export default ToastContainer
