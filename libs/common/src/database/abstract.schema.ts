// Purpose: inherit _id field which is common in all MongoDB schemas

import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema()
@ObjectType({isAbstract: true})  // isAbstract does not register the type in the schema just marks it as inheritable
export class AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId})
  @Field(() => String)  // this type is whats sent over the wire, so this is a String when its returned from the Server
  _id: Types.ObjectId
}