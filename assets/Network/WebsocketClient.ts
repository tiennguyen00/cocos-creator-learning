import { ProtoManager } from "../scripts/ProtoManager";

export class WebSocketClient {
  private static instance: WebSocketClient;
  private socket: WebSocket | null = null;
  private messageCallback?: (event: MessageEvent) => void;

  private constructor() {}

  public static getInstance(): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient();
    }
    return WebSocketClient.instance;
  }

  public connect(
    url: string,
    onMessageCallback?: (event: MessageEvent) => void
  ): void {
    if (this.socket) {
      this.socket.close();
    }
    this.socket = new WebSocket(url);
    this.socket.binaryType = "arraybuffer";
    this.messageCallback = onMessageCallback;

    this.socket.onopen = () => {
      console.log("WebSocket connected");
    };

    this.socket.onmessage = (event) => {
      if (this.messageCallback) {
        this.messageCallback(event);
      } else {
        console.log("Message from server:", event.data);
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected");
    };
  }

  public send(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.warn("WebSocket not connected");
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
