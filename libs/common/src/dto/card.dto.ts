import { Field, InputType } from '@nestjs/graphql';
import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType() // Mark it as input of graphQL resolver, arguments supplied to GraphQL
export class CardDto {
  @IsString()
  @IsNotEmpty()
  @Field()  // Mark as part of the GraphQL schema
  cvc: string;

  @IsNumber()
  @Field()
  exp_month: number;

  @IsNumber()
  @Field()
  exp_year: number;

  @IsCreditCard()
  @Field()
  number: string;
}
