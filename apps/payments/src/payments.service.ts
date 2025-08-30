import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY')!);
  }

  async createCharge({ card, amount }: CreateChargeDto) {
    // const paymentMethod = await this.stripe.paymentMethods.create({
      //   type: 'card',
      //   card: {
        //     number: card.number,
        //     exp_month: card.exp_month,
        //     exp_year: card.exp_year,
        //     cvc: card.cvc,
        //   },
        // });
    // For testing only: create a paymentMethod from raw card data
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: { token: 'tok_visa' }, // or tok_mastercard, etc.
    });
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: amount * 100,
      confirm: true,
      payment_method_types: ['card'],
      currency: 'eur',
    });

    return paymentIntent;
  }
}
