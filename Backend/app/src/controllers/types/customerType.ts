import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class CustomerType {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  phoneNumber: string;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  createdAt: Date;
}
