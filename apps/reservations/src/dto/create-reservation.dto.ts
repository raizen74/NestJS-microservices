import { CreateChargeDto } from '@app/common';
import { Type } from 'class-transformer';
import { IsDate, IsDefined, IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested } from 'class-validator';

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)  //Transforms the string into Date object e.g. "12/20/2022"
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  placeId: string;

  @IsString()
  @IsNotEmpty()
  invoiceId: string;
  
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateChargeDto)  // Turn it into CardDto CreateChargeDto
  charge: CreateChargeDto
}
