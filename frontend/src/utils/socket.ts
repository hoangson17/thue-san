import { io, Socket } from "socket.io-client";

class SocketClient {
  private socket: Socket | null = null;

  connect(): Socket | null {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    if (!this.socket || this.socket.disconnected) {
      this.socket = io("http://localhost:3000/chat", {
        auth: { token },
        extraHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return this.socket;
  }

  // Ép kiểu trả về có thể là null
  getConnection(): Socket | null {
    return this.socket?.connected ? this.socket : this.connect();
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketClient = new SocketClient();