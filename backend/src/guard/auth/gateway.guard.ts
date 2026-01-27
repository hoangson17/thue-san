import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class GatewayGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const authHeader = client.handshake.headers.authorization;

    if (!authHeader) throw new UnauthorizedException();

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException();

    const decode = this.authService.verifyToken(token);
    if (!decode) throw new UnauthorizedException();

    // blacklist
    const blackList = await this.redis.get(`blacklist_${decode.jti}`);
    if (blackList) throw new UnauthorizedException();

    const user = await this.authService.profile(decode.userId);
    if (!user || user.deletedAt) throw new UnauthorizedException();

    const device = await this.redis.get(`Device_${user.id}`);
    if (device !== decode.jti) throw new UnauthorizedException();

    client.data.user = {
      id: user.id,
      role: user.role,
    };

    return true;
  }
}
