import { CreateChargeDto } from '@app/common';
import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';

@InputType() // Mark it as input of graphQL resolver, arguments supplied to GraphQL
export class CreateReservationDto {
  @IsDate()
  @Type(() => Date) //Transforms the string into Date object e.g. "12/20/2022"
  @Field() // Mark as part of the GraphQL schema
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @Field()
  endDate: Date;

  // @IsString()
  // @IsNotEmpty()
  // placeId: string;

  // @IsString()
  // @IsNotEmpty()
  // invoiceId: string;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateChargeDto) // Turn it into CardDto CreateChargeDto
  @Field(() => CreateChargeDto)
  charge: CreateChargeDto;
}
