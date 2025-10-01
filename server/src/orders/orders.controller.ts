import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create a new order (user only)' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: CreateOrderDto,
  })
  @Post()
  create(@Req() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.userId, dto);
  }

  @ApiOperation({ summary: 'Get my orders (user only)' })
  @ApiResponse({ status: 200, description: 'List of user orders' })
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
}
