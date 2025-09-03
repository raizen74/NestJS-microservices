import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()  // Add the PaymentIntent to GraphQL schema
export class PaymentIntent {
  @Field()
  id: string;

  @Field()
  amount: number;
}