import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from 'src/products/products.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(
    private readonly stripe: Stripe,
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService,
  ) {}

  async createCheckoutSession(productId: number) {
    const product = await this.productsService.getProduct(productId);

    return this.stripe.checkout.sessions.create({
      metadata: {
        productId,
      },

      //payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: this.configService.getOrThrow('STRIPE_SUCCESS_URL'),
      cancel_url: this.configService.getOrThrow('STRIPE_CANCEL_URL'),
    });
  }

  async handleWebhook(event: {
    type: string;
    data: { object: { id: string; metadata: { productId: string } } };
  }) {
    if (event.type === 'checkout.session.completed') {
      return;
    }

    const session = await this.stripe.checkout.sessions.retrieve(
      event.data.object.id,
    );
    await this.productsService.updateProduct(
      parseInt(session.metadata?.productId ?? '0'),
      {
        sold: true,
      },
    );
  }
}
