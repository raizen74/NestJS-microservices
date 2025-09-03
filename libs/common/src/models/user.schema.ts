import { AbstractDocument } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false }) // Do not version documents
@ObjectType()  // Mark it as graphql return type
export class UserDocument extends AbstractDocument {
  @Prop()
  @Field()
  email: string;
  // password wont be added to the GraphQL schema, so it is not returned
  @Prop()
  password: string;
  @Prop()
  @Field(() => [String])  // non primitive type must be defined
  roles?: string[];
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
