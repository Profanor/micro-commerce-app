import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@micro-lib/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerUser(dto: RegisterDto) {
    try {
      const existingUser = await this.db.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = await this.db.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          role: UserRole.USER,
        },
        select: { id: true, email: true, role: true },
      });

      return {
        ...user,
        accessToken: this.signToken(user.id, user.email, user.role),
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Registration failed', error);
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.db.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        accessToken: this.signToken(user.id, user.email, user.role),
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Login failed', error);
    }
  }

  private signToken(userId: number, email: string, role: UserRole): string {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }
}
