import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY')!);
  }

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
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

    // reach the notifications.controller event pattern
    this.notificationsService.emit('notify_email', {
      email,
      text: `Your payment of amount $${amount} has completed successfully.`,
    });

    return paymentIntent;
  }

  async getPayments() {
    const payments = await this.stripe.paymentIntents.list();
    return payments.data;
  }
}
