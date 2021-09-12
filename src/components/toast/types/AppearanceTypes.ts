import {
  IoCheckmarkSharp,
  IoAlertCircleOutline,
  IoWarningSharp,
  IoFlameSharp,
} from 'react-icons/io5'

type AppearanceTypes = 'error' | 'info' | 'success' | 'warning'

export const appearances = {
  error: {
    icon: 'IoFlameSharp', // IoFlameOutline , IoFlameSharp , IoHandLeftSharp , IoHandLeftOutline
    iconColor: 'white',
    textColor: '#bf2600',
    backgroundColor: '#FFEBE6',
    counterBackgroundColor: '#FF5630',
    counterForegroundColor: '#8f2e18',
    closeIconColor: '#bf260080',
  },
  info: {
    icon: 'IoInformationCircleSharp',
    iconColor: 'white',
    textColor: '#375180',
    backgroundColor: 'white',
    counterBackgroundColor: '#2684ff',
    counterForegroundColor: '#14488c',
    closeIconColor: '#37518080',
  },
  success: {
    icon: 'IoCheckmarkSharp',
    iconColor: 'white',
    textColor: '#247553',
    backgroundColor: '#e3fcef',
    counterBackgroundColor: '#36b37e',
    counterForegroundColor: '#1d6346',
    closeIconColor: '#24755380',
  },
  warning: {
    icon: 'IoWarningSharp',
    iconColor: 'white',
    textColor: '#ff8b00',
    backgroundColor: '#FFFAE6',
    counterBackgroundColor: '#FFAB00',
    counterForegroundColor: '#9e6a00',
    closeIconColor: '#ff8b0080',
  },
}

export default AppearanceTypes
