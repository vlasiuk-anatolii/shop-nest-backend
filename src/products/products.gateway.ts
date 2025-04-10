import {
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    path: '/socket.io',
    transports: ['polling', 'websocket'],
  },
})
export class ProductsGateway {
  constructor(private readonly authService: AuthService) {}

  @WebSocketServer()
  private readonly server: Server;

  handleProductsUpdated() {
    this.server.emit('productsUpdated');
  }

  handleConnection(client: Socket) {
    try {
      const auth = client.handshake.auth.Authentication as
        | { value: string }
        | undefined;
      if (!auth || typeof auth.value !== 'string') {
        throw new WsException('Invalid authentication data');
      }
      this.authService.verifyToken(auth.value);
    } catch {
      throw new WsException('Unauthorized');
    }
  }
}
