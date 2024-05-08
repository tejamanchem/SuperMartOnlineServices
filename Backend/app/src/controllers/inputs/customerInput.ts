import { InputType, Field } from "type-graphql";

@InputType()
export class CustomerInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  phoneNumber: string;

  @Field()
  address: string;

  @Field()
  password: string;
}


