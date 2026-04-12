// WebSocket service stub — connect to a backend when ready
export class CVForgeWebSocket {
  private ws: WebSocket | null = null

  connect(url: string, onMessage: (data: string) => void) {
    this.ws = new WebSocket(url)
    this.ws.onmessage = (e) => onMessage(e.data as string)
  }

  send(data: string) {
    this.ws?.send(data)
  }

  disconnect() {
    this.ws?.close()
    this.ws = null
  }
}
