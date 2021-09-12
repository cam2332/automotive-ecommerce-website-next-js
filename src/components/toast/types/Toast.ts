import AppearanceTypes from './AppearanceTypes'
import Placement from './Placement'

export default interface Toast {
  id: string
  text: string
  appearance: AppearanceTypes
  autoDismiss: boolean
  dismissDelay: number
  onDismiss?: () => void
}

export type ToastInput = Omit<Toast, 'id'>
