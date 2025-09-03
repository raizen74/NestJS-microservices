import { Type } from 'class-transformer';
import { CardDto } from './card.dto';
import {
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType() // Mark it as input of graphQL resolver, arguments supplied to GraphQL
export class CreateChargeDto {
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CardDto) // Turn it into CardDto object
  @Field(() => CardDto)  // Mark as part of the GraphQL schema
  card: CardDto;

  @IsNumber()
  @Field()
  amount: number;
}
