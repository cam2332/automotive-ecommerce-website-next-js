import React, { useState, useEffect, useRef } from 'react'
import * as IoIcons from 'react-icons/io5'
import { IoCloseSharp } from 'react-icons/io5'
import tw from 'tailwind-styled-components'
import { useToastContext } from '../../context/ToastContext'
import { appearances } from './types/AppearanceTypes'
import Toast from './types/Toast'

function ToastElement(props: Toast) {
  const toastContext = useToastContext()
  const [state, setState] = useState<
    'hidden' | 'showing' | 'hiding' | 'visible'
  >('hidden')
  const icon = IoIcons[appearances[props.appearance].icon]
  const [counterHeightPercentage, setCounterHeightPercentage] = useState(100)
  const [counterMsLeft, setCounterMsLeft] = useState(props.dismissDelay)
  const [counterPaused, setCounterPaused] = useState(false)
  const [height, setHeight] = useState<number | string>('auto')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHeight(containerRef.current.getBoundingClientRect().height)
    setTimeout(() => {
      setState('visible')
    }, 1)

    return () => {
      setState('hidden')
    }
  }, [])

  useEffect(() => {
    let counter: NodeJS.Timeout
    if (props.autoDismiss) {
      counter = setInterval(() => {
        if (!counterPaused) {
          setCounterHeightPercentage((height) => height - 0.8)
          setCounterMsLeft((msLeft) => msLeft - props.dismissDelay / 125)
          if (counterMsLeft < 0) {
            clearInterval(counter)
            dismiss()
            return
          }
        }
      }, props.dismissDelay / 125)
    } else {
      setCounterHeightPercentage(0)
    }

    return () => {
      clearInterval(counter)
    }
  }, [counterPaused, counterMsLeft])

  const dismiss = () => {
    setState('hidden')
    setInterval(() => {
      setHeight(
        (height) => typeof height === 'number' && Math.max(0, height - 15)
      )
    }, 20)
    setTimeout(() => {
      toastContext.removeToast(props.id)
    }, 500)
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setCounterPaused(true)}
      onMouseLeave={() => setCounterPaused(false)}
      style={{
        backgroundColor: appearances[props.appearance].backgroundColor,
        height: height,
        margin: height > 0 ? 8 : 0,
      }}
      className={`flex flex-row w-[360px] z-[1000] rounded shadow-lg transition-all opacity-[1] duration-500
      ${
        state === 'visible' &&
        (toastContext.placement === 'top-right' ||
          toastContext.placement === 'bottom-right' ||
          toastContext.placement === 'top-center' ||
          toastContext.placement === 'bottom-center') &&
        'translate-x-[0px]'
      } ${
        state === 'hidden' &&
        (toastContext.placement === 'top-left' ||
          toastContext.placement === 'bottom-left')
          ? 'translate-x-[-384px] opacity-[0]'
          : state === 'hidden' &&
            (toastContext.placement === 'top-right' ||
              toastContext.placement === 'bottom-right')
          ? 'translate-x-[384px] opacity-[0]'
          : state === 'hidden' &&
            (toastContext.placement === 'top-center' ||
              toastContext.placement === 'bottom-center') &&
            'opacity-[0]'
      }`}>
      <CounterContainer
        style={{
          backgroundColor: appearances[props.appearance].counterBackgroundColor,
        }}>
        <CounterBackground
          style={{
            backgroundColor:
              appearances[props.appearance].counterForegroundColor,
            height: counterHeightPercentage + '%',
          }}></CounterBackground>
        <Icon>{React.createElement(icon)}</Icon>
      </CounterContainer>
      <Content style={{ color: appearances[props.appearance].textColor }}>
        {props.text}
      </Content>
      <CloseIconWrapper>
        <CloseIcon
          style={{ color: appearances[props.appearance].closeIconColor }}
          onClick={() => dismiss()}
        />
      </CloseIconWrapper>
    </div>
  )
}

const CounterContainer = tw.div`
  relative
 	flex
 	justify-center
 	flex-shrink-0
 	h-auto
 	text-lg
 	text-white
 	rounded-l
 	w-7
`
const CounterBackground = tw.div`
  absolute
 	bottom-0
 	w-full
 	bg-gray-300
`
const Icon = tw.div`
  absolute
 	my-2
`
const Content = tw.div`
  flex-grow
 	w-auto
 	h-full
 	p-2
 	px-3
 	text-sm
 	leading-6
 	rounded-l
`
const CloseIconWrapper = tw.div`
  flex-shrink-0
 	w-auto
 	h-full
 	p-2
 	px-3
 	text-sm
 	rounded-l
`
const CloseIcon = tw(IoCloseSharp)`
  text-lg
 	cursor-pointer
`
export default ToastElement
