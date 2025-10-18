import { Controller, Post, Body, Headers } from '@nestjs/common';
import { PaystackService } from './paystack.service';
import * as crypto from 'crypto';

@Controller('payments')
export class PaystackController {
  constructor(private readonly paystackService: PaystackService) {}

  @Post('webhook')
  async handleWebhook(
    @Body() payload: any,
    @Headers('x-paystack-signature') signature: string,
  ) {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      throw new Error('PAYSTACK_SECRET_KEY environment variable is not set.');
    }
    const hash = crypto
      .createHmac('sha512', secretKey)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (hash !== signature) return { status: 'unauthorized' };
    await this.paystackService.handleWebhookEvent(payload);

    return { status: 'ok' };
  }
}
