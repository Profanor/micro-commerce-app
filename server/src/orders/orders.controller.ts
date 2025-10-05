import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PrismaService } from '@micro-lib/database/prisma.service';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly db: PrismaService,
  ) {}

  @ApiOperation({ summary: 'Create a new order (user only)' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: CreateOrderDto,
  })
  @Roles(UserRole.USER)
  @Post()
  create(@Req() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.userId, dto);
  }

  @ApiOperation({ summary: 'Get my orders (user only)' })
  @ApiResponse({ status: 200, description: 'List of user orders' })
  @Roles(UserRole.USER)
  @Get('my')
  findMyOrders(@Req() req) {
    return this.ordersService.findMyOrders(req.user.userId);
  }

  @ApiOperation({ summary: 'Get all orders (admin only)' })
  @ApiResponse({ status: 200, description: 'List of all orders' })
  @Roles(UserRole.ADMIN)
  @Get('all')
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total number of orders (admin only)' })
  @ApiResponse({ status: 200, description: 'Total orders count' })
  @Roles(UserRole.ADMIN)
  count() {
    return this.ordersService.count();
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get total revenue from all orders (admin only)' })
  @ApiResponse({ status: 200, description: 'Total revenue' })
  @Roles(UserRole.ADMIN)
  revenue() {
    return this.ordersService.revenue();
  }
}
