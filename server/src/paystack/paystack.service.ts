import { PrismaService } from '@micro-lib/database/prisma.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import axios from 'axios';

interface PaystackWebhookPayload {
  event: string;
  data: {
    reference: string;
    amount: number;
    status: string;
    channel: string;
    metadata: { orderId: number };
  };
}

@Injectable()
export class PaystackService {
  private readonly baseUrl = 'https://api.paystack.co';
  private readonly secretKey = process.env.PAYSTACK_SECRET_KEY;

  constructor(private readonly db: PrismaService) {}

  async initializePayment(email: string, amount: number, metadata?: any) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          email,
          amount: amount * 100, // paystack expects amount in kobo
          metadata,
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to initialize payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyPayment(reference: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      );
      const data = response.data;

      const orderId = data.data.metadata.orderId;
      if (!orderId) {
        throw new HttpException(
          'Order ID not found in metadata',
          HttpStatus.BAD_REQUEST,
        );
      }

      const payment = await this.db.payment.upsert({
        where: { orderId: data.data.metadata.orderId },
        update: {
          amount: data.data.amount / 100,
          method: data.data.channel,
          status: data.data.status.toUpperCase() as PaymentStatus,
        },
        create: {
          orderId: data.data.metadata.orderId,
          amount: data.data.amount / 100,
          method: data.data.channel,
          status: data.data.status.toUpperCase() as PaymentStatus,
        },
      });

      // also mark the order as PAID
      await this.db.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PAID },
      });

      return payment;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Payment verification failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async handleWebhookEvent(payload: PaystackWebhookPayload) {
    const event = payload.event;
    const data = payload.data;

    if (event === 'charge.success') {
      console.log(`✅ Charge success for reference ${data.reference}`);
      await this.verifyPayment(data.reference);
    }
  }
}
