import { cn } from '@/lib/cn'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'

export interface ToastMessage {
  id: string
  title: string
  description?: string
}

interface ToastContextValue {
  showToast(message: Omit<ToastMessage, 'id'>): void
  dismissToast(id: string): void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: PropsWithChildren) {
  const [messages, setMessages] = useState<ToastMessage[]>([])
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>())
  const nextIdRef = useRef(1)

  const dismissToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id)
    if (timer) clearTimeout(timer)
    timersRef.current.delete(id)
    setMessages((current) => current.filter((message) => message.id !== id))
  }, [])

  const showToast = useCallback(
    (message: Omit<ToastMessage, 'id'>) => {
      const id = `toast-${nextIdRef.current++}`
      setMessages((current) => [...current, { ...message, id }])
      timersRef.current.set(
        id,
        setTimeout(() => dismissToast(id), 5_000),
      )
    },
    [dismissToast],
  )

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => clearTimeout(timer))
      timersRef.current.clear()
    },
    [],
  )

  const value = useMemo<ToastContextValue>(
    () => ({ dismissToast, showToast }),
    [dismissToast, showToast],
  )

  return (
    <ToastContext value={value}>
      {children}
      <div className="ui-toast-region" aria-live="polite" aria-atomic="true">
        {messages.map((message) => (
          <div key={message.id} role="status" className={cn('ui-toast')}>
            <p className="ui-toast__title">{message.title}</p>
            {message.description ? (
              <p className="ui-toast__description">{message.description}</p>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext>
  )
}

// O hook depende do provider para que os feedbacks vivam no shell da aplicação.
// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)

  if (!context) throw new Error('useToast deve ser usado dentro de ToastProvider.')

  return context
}
