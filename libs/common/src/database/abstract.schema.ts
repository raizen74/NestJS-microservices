// Purpose: inherit _id field which is common in all MongoDB schemas

import { Prop, Schema } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema()
export class AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId})
  _id: Types.ObjectId
}