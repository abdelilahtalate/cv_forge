import { useEffect, useRef } from 'react'
import { CVForgeWebSocket } from '@/services/websocket'

export function useWebSocket(url: string | null, onMessage: (data: string) => void) {
  const wsRef = useRef<CVForgeWebSocket | null>(null)

  useEffect(() => {
    if (!url) return
    const ws = new CVForgeWebSocket()
    ws.connect(url, onMessage)
    wsRef.current = ws
    return () => ws.disconnect()
  }, [url, onMessage])

  return wsRef
}
