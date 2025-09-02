import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
import { PaymentsServiceController, PaymentsServiceControllerMethods } from '@app/common';

@Controller()
@PaymentsServiceControllerMethods()  // provides metadata to our function, so incoming messages on this controller go to the correct function
export class PaymentsController implements PaymentsServiceController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UsePipes(new ValidationPipe())  // validates all incoming metadata in the payload (createReservationDto.charge)
  async createCharge(data: PaymentsCreateChargeDto) {
    return this.paymentsService.createCharge(data);
  }
}
