export class SocketClient {
    private static instance: SocketClient | null;
    private constructor() {
        
    }
    public static getInstance(): SocketClient {
        if (!SocketClient.instance) {
            SocketClient.instance = new SocketClient()
        }
        return SocketClient.instance
    }
}
