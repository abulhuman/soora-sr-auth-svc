import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude } from "class-transformer";
import { HydratedDocument } from "mongoose";

export type AuthDocument = HydratedDocument<Auth>;

@Schema()
export class Auth {
    @Prop({ required: true })
    email: string;

    @Exclude()
    @Prop({ required: true })
    password: string;
}


export const AuthSchema = SchemaFactory.createForClass(Auth); SchemaFactory;