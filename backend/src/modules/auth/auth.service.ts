import { InjectRedis } from '@nestjs-modules/ioredis';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { name } from 'ejs';
import Redis from 'ioredis';
import { Cart } from 'src/entities/cart.entity';
import { User } from 'src/entities/user.entity';
import Hash from 'src/utils/Hash';
import { Not, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
type GoogleParams = {
  client_id: string;
  redirect_uri: string;
  response_type: string;
  scope: string;
  access_type: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
    @InjectQueue('mailRegister') private mailQueue: Queue,
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  googleRedirect() {
    const params: GoogleParams = {
      client_id: process.env.GOOGLE_CLIENT_ID as string,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL as string,
      response_type: 'code',
      scope: 'email profile',
      access_type: 'offline',
    };

    const oAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(params).toString()}`;
    return oAuthUrl;
  }

  async googleCallback(code: string) {
    const url = `https://oauth2.googleapis.com/token`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_SECRET_ID,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code',
      }),
    });
    if (!response.ok) {
      return;
    }
    return response.json();
  }

  async googleLogin(accessToken: string) {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
    );
    const profileFromGoogle: unknown = await response.json();
    console.log(profileFromGoogle);
    const { email, name, picture } = profileFromGoogle as {
      email: string;
      name: string;
      picture: string;
    };
    let user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      user = await this.userRepository.save({
        name,
        email,
        avatar: picture,
        provider: 'google',
      });
      await this.mailQueue.add(
        'send-mail',
        {
          to: email,
          subject: 'Mail xác nhận đăng kí',
          content: {
            template: 'welcome',
            context: {
              name: name,
            },
          },
        },
        {
          delay: 3000,
          attempts: 3,
          backoff: 5000,
          removeOnFail: true,
        },
      );
      const cart = this.cartRepository.create({ user: user } as any);
      await this.cartRepository.save(cart);
    }
    return this.createToken(user);
  }

  // -------------------------------------------------

  facebookRedirect(): string {
    const params = new URLSearchParams({
      client_id: process.env.FACEBOOK_CLIENT_ID!,
      redirect_uri: process.env.FACEBOOK_CALLBACK_URL!,
      response_type: 'code',
      scope: 'email,public_profile',
    });
    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  async facebookCallback(code: string) {
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
        new URLSearchParams({
          client_id: process.env.FACEBOOK_CLIENT_ID!,
          client_secret: process.env.FACEBOOK_SECRET_ID!,
          redirect_uri: process.env.FACEBOOK_CALLBACK_URL!,
          code,
        }).toString(),
    );

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      throw new BadRequestException(`Facebook token error: ${error}`);
    }

    return await tokenResponse.json();
  }

  async facebookLogin(accessToken: string) {
    const userResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`,
    );

    if (!userResponse.ok) {
      const error = await userResponse.text();
      throw new BadRequestException(`Facebook user error: ${error}`);
    }

    const profile = await userResponse.json();
    const email = profile.email ?? `${profile.id}@facebook.com`;

    let user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      user = await this.userRepository.save({
        name: profile.name,
        email,
        avatar: profile.picture?.data?.url,
        provider: 'facebook',
      });
      await this.mailQueue.add(
        'send-mail',
        {
          to: email,
          subject: 'Mail xác nhận đăng kí',
          content: {
            template: 'welcome',
            context: {
              name: profile.name,
            },
          },
        },
        {
          delay: 3000,
          attempts: 3,
          backoff: 5000,
          removeOnFail: true,
        },
      );
      const cart = this.cartRepository.create({ user } as any);
      await this.cartRepository.save(cart);
    }

    return this.createToken(user);
  }

  async profile(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!user) {
      return false;
    }
    return user;
  }

  verifyToken = (token: string) => {
    try {
      const decode = this.jwtService.verify(token);
      return decode;
    } catch (error) {
      return null;
    }
  };

  verifyRefreshToken = (token: string) => {
    try {
      const decode = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
      return decode;
    } catch (error) {
      return null;
    }
  };

  async refreshToken(body: any) {
    const refreshToken = body.refreshToken;
    try {
      const decode = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
      const token = this.jwtService.sign({
        userId: decode.userId,
        email: decode.email,
        role: decode.role,
        jti: uuid(),
      });
      const jtiRefreshToken = decode.jti;
      const accessToken = await this.redis.get(
        `jwt_refresh_${jtiRefreshToken}`,
      );
      if (accessToken) {
        const now = Date.now() / 1000;
        const { exp, jtiAccessToken } = JSON.parse(accessToken);
        if (now < exp) {
          await this.redis.set(
            `jti_blacklist_${jtiAccessToken}`,
            jtiAccessToken,
            'EX',
            Math.round(exp - now),
          );
        }
      } else {
        return false;
      }
      return {
        accessToken: token,
        refreshToken,
      };
    } catch (error) {
      return false;
    }
  }

  async logout(jti: string, exp: number) {
    const diff = exp - Date.now() / 1000;
    await this.redis.set(`jti_blacklist_${jti}`, jti, 'EX', Math.round(diff));
    return { success: true };
  }

  async createToken(user: any) {
    const jtiAccessToken = uuid();
    const token = this.jwtService.sign({
      jti: jtiAccessToken,
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    const jtiRefreshToken = uuid();
    const refreshToken = this.jwtService.sign(
      {
        jti: jtiRefreshToken,
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRED as unknown as number,
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      },
    );
    //Thêm jti vào redis
    //jtiRefreshToken: jtiAccessToken
    //- decoded Access Token để lấy ra exp
    const { exp: expAccessToken } = this.verifyToken(token);
    //- decoded Refresh Token để lấy ra exp
    const { exp: expRefreshToken } = this.verifyRefreshToken(refreshToken);

    await this.redis.set(
      `jwt_refresh_${jtiRefreshToken}`,
      JSON.stringify({
        jtiAccessToken,
        exp: expAccessToken,
        userId: user.id,
      }),
      'EX',
      Math.round(expRefreshToken - Date.now() / 1000),
    );
    await this.redis.set(
      `Device_${user.id}`,
      jtiAccessToken,
      'EX',
      Math.round(expAccessToken - Date.now() / 1000),
    );
    await this.redis.keys(`jwt_refresh_*`);

    delete (user as any).password;

    return {
      accessToken: token,
      refreshToken,
      user,
    };
  }

  async register(body: any) {
    const { email, password, name, phone } = body;

    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
    const existingPhone = await this.userRepository.findOne({
      where: { phone },
    });

    if (existingEmail) throw new BadRequestException('Email đã được sử dụng');
    if (existingPhone)
      throw new BadRequestException('Số điện thoại đã được sử dụng');

    body.password = await Hash.make(password);

    const newUser = this.userRepository.create(body);
    const user = await this.userRepository.save(newUser);
    await this.mailQueue.add(
      'send-mail',
      {
        to: email,
        subject: 'Mail xác nhận đăng kí',
        content: {
          template: 'welcome',
          context: {
            name: name,
          },
        },
      },
      {
        delay: 3000,
        attempts: 3,
        backoff: 5000,
        removeOnFail: true,
      },
    );
    const cart = this.cartRepository.create({ user: user } as any);
    await this.cartRepository.save(cart);

    delete (user as any).password;
    return user;
  }

  async login(body: any) {
    const user = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (!user) {
      return false;
    }
    if (!Hash.compare(body.password, user.password)) {
      return false;
    }
    return this.createToken(user);
  }

  async testMail() {
    const job = await this.mailQueue.add(
      'send-mail',
      {
        to: 'tranhoangson03@gmail.com',
        subject: 'Email từ queue',
        content: 'welcome',
      },
      {
        delay: 3000,
        attempts: 3,
        backoff: 5000,
        removeOnFail: true,
      },
    );
    return job;
  }

  async forgotPassword(body: any) {
    const user = await this.userRepository.findOne({
      where: { email: body.email },
    });

    if (!user) return false;

    // Tạo mã xác nhận (6 chữ số)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu OTP vào Redis với key là email, thời gian hết hạn 5 phút
    await this.redis.set(`forgot-password:${body.email}`, otp, 'EX', 5 * 60);

    // Gửi email chứa OTP
    await this.mailQueue.add(
      'send-mail-password',
      {
        to: body.email,
        subject: 'MÃ XÁC NHẬN ĐẶT LẠI MẬT KHẨU',
        content: {
          template: 'forgotpassword',
          context: {
            name: user.name,
            otp,
          },
        },
      },
      {
        delay: 0,
        attempts: 3,
        backoff: 5000,
        removeOnFail: true,
      },
    );

    return {
      success: true,
      message:
        'Mã xác nhận đã được gửi tới email của bạn. Hãy kiểm tra hộp thư.',
    };
  }

  async resetPassword(body: {
    email: string;
    otp: string;
    newPassword: string;
  }) {
    const { email, otp, newPassword } = body;

    // 1. Kiểm tra user tồn tại
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return {
        success: false,
        message: 'Người dùng không tồn tại.',
      };
    }

    // 2. Lấy OTP trong Redis
    const savedOtp = await this.redis.get(`forgot-password:${email}`);
    if (!savedOtp) {
      return {
        success: false,
        message: 'OTP hết hạn hoặc không tồn tại.',
      };
    }

    // 3. So sánh OTP
    if (savedOtp !== otp) {
      return {
        success: false,
        message: 'OTP không đúng.',
      };
    }

    // 4. Mã hóa mật khẩu mới
    const hashedPassword = await Hash.make(newPassword);

    // 5. Lưu mật khẩu mới
    user.password = hashedPassword;
    await this.userRepository.save(user);

    // 6. Xóa OTP để tránh dùng lại
    await this.redis.del(`forgot-password:${email}`);

    return {
      success: true,
      message: 'Đặt lại mật khẩu thành công.',
    };
  }

  async updateUser(user: any, data: any, file?: Express.Multer.File) {
    const userExist = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!userExist) return null;

    if (data.email && data.email !== userExist.email) {
      const emailExist = await this.userRepository.findOne({
        where: { email: data.email },
      });
      if (emailExist) return null;
    }

    if (data.phone && data.phone !== userExist.phone) {
      const phoneExist = await this.userRepository.findOne({
        where: { phone: data.phone },
      });
      if (phoneExist) return null;
    }

    const updateData = data;

    if (file) {
      updateData.avatar = `/uploads/avatar/${file.filename}`;
    }

    if (data.password) {
      updateData.password = await Hash.make(data.password);
    }

    await this.userRepository.update(user.id, updateData);

    const updatedUser = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!updatedUser) return null;

    delete (updatedUser as any).password;
    return updatedUser;
  }

  async updateRole(id: number, role: any) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User không tồn tại');
    return this.userRepository.update(id, { role });
  }
}
