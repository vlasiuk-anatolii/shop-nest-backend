import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateSessionRequest } from './dto/create-session.request';
import { StripeService } from './stripe.service';

@Controller('checkout')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('session')
  @UseGuards(JwtAuthGuard)
  async createCheckoutSession(@Body() request: CreateSessionRequest) {
    return this.stripeService.createCheckoutSession(request.productId);
  }

  @Post('webhook')
  async handleWebhook(
    @Body()
    event: {
      type: string;
      data: { object: { id: string; metadata: { productId: string } } };
    },
  ) {
    return this.stripeService.handleWebhook(event);
  }
}
