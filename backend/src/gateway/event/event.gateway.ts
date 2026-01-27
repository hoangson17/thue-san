// fileName: event.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards, Logger } from '@nestjs/common'; // Thêm Logger
import { Server, Socket } from 'socket.io';
import { GatewayGuard } from 'src/guard/auth/gateway.guard';
import { ChatService } from 'src/modules/chat/chat.service';

@UseGuards(GatewayGuard)
@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*' },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  private logger = new Logger('ChatGateway');

  constructor(private readonly chatService: ChatService) {}

  // Log khi có kết nối để debug
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('user-join')
async userJoin(@ConnectedSocket() client: Socket) {
  const user = client.data.user;
  const convo = await this.chatService.getOrCreateConversation(user.id);
  client.join(`conversation:${convo.id}`);

  const messages = await this.chatService.getMessages(convo.id);
  client.emit('message-list', messages);

  // Chỉ báo Admin khi có yêu cầu mới thực sự
  if (convo.status === 'waiting') {
    this.server.emit('new-waiting-conversation', convo);
  }
}

  @SubscribeMessage('user-send')
  async userSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() content: string,
  ) {
    const user = client.data.user;
    if (!user) return; // <-- FIX

    const convo = await this.chatService.getOrCreateConversation(user.id);

    const msg = await this.chatService.createMessage(
      convo.id,
      'user',
      user.id,
      content,
    );

    this.server.to(`conversation:${convo.id}`).emit('new-message', msg);
  }

@SubscribeMessage('admin-join')
async adminJoin(@ConnectedSocket() client: Socket) {
  const conversations = await this.chatService.getAllConversations();
  // Sửa: Gửi đúng tên event mà AdminChat.tsx đang chờ
  client.emit('conversation-list', conversations); 
}

  @SubscribeMessage('admin-claim')
  async adminClaim(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: number,
  ) {
    const admin = client.data.user;
    if (!admin) return; // <-- FIX

    await this.chatService.claimConversation(conversationId, admin.id);

    const room = `conversation:${conversationId}`;
    client.join(room);

    await this.chatService.markUserMessagesAsRead(conversationId);

    const messages = await this.chatService.getMessages(conversationId);
    client.emit('message-list', messages);

    this.server.emit('conversation-claimed', {
      conversationId,
      adminId: admin.id,
    });
  }

  @SubscribeMessage('admin-send')
  async adminSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: number; content: string },
  ) {
    const admin = client.data.user;
    if (!admin) return; // <-- FIX

    const msg = await this.chatService.createMessage(
      payload.conversationId,
      'admin',
      admin.id,
      payload.content,
    );

    this.server
      .to(`conversation:${payload.conversationId}`)
      .emit('new-message', msg);
  }
}