import { ObjectType, Field, ID, InputType } from "type-graphql";

@ObjectType()
class ProductType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field()
  category: string;

  @Field()
  brand: string;

  @Field()
  quantity: number;

  @Field()
  imageURL: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}


export { ProductType };
