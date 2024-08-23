import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';  // Sử dụng uuid để tạo ID duy nhất

@WebSocketGateway({ path: '/ws' })
export class WebRTCGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {

  private logger = new Logger('WebRTCGateway');
  clients: Map<WebSocket, string> = new Map();  // Sử dụng Map để lưu WebSocket và ID tương ứng

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.logger.log('Máy chủ WebSocket đã được khởi động');
  }

  handleConnection(client: WebSocket) {
    const clientId = uuidv4();  // Tạo ID duy nhất cho mỗi client
    this.clients.set(client, clientId);  // Lưu client và ID của họ
    this.logger.log(`Client kết nối với ID: ${clientId}. Tổng số client: ${this.clients.size}`);

    // Xử lý khi client gửi dữ liệu
    client.on('message', (message) => {
      const senderId = this.clients.get(client);  // Lấy ID của client gửi tin
      this.logger.log(`Nhận tin nhắn từ Client ID: ${senderId} - Tin nhắn: ${message}`);
      this.handleSignalingMessage(senderId, message.toString());
    });

    // Xử lý khi client ngắt kết nối
    client.on('close', () => {
      this.handleDisconnect(client);
    });
  }

  handleDisconnect(client: WebSocket) {
    const clientId = this.clients.get(client);
    this.clients.delete(client);  // Xóa client đã ngắt kết nối khỏi danh sách
    this.logger.log(`Client với ID: ${clientId} đã ngắt kết nối. Tổng số client: ${this.clients.size}`);
  }

  private handleSignalingMessage(senderId: string, message: string) {
    try {
      const parsedMessage = JSON.parse(message);
      
      switch (parsedMessage.type) {
        case 'offer':
        case 'answer':
        case 'candidate':
          // Chuyển tiếp tín hiệu WebRTC cho các client khác
          this.broadcast(senderId, message);
          break;
        case 'stream-data':  // Khi nhận dữ liệu stream từ client
          this.handleStreamData(senderId, parsedMessage);
          break;
        default:
          this.logger.log(`Loại tin nhắn không xác định: ${parsedMessage.type}`);
      }
    } catch (error) {
      this.logger.error(`Lỗi khi phân tích tin nhắn dgg: ${error.message}`);
    }
  }

  private broadcast(senderId: string, message: string) {
    // Gửi tin nhắn đến tất cả các client trừ người gửi
    this.clients.forEach((clientId, client) => {
      if (clientId !== senderId && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  private handleStreamData(senderId: string, message: any) {
    // Xử lý dữ liệu stream từ client và phát lại
    this.logger.log(`Nhận stream data từ Client ID: ${senderId}`);
    // Bạn có thể lưu trữ hoặc xử lý dữ liệu stream tại đây nếu cần, ví dụ lưu trữ cho việc phát lại

    // Phát lại stream cho tất cả các client khác
    this.clients.forEach((clientId, client) => {
      if (clientId !== senderId && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'stream-data',
          senderId: senderId,
          data: message.data,  // Dữ liệu stream
        }));
      }
    });
  }
}
