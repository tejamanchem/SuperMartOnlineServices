import { ObjectType, Field, ID, InputType } from "type-graphql";

@InputType()
class ProductInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  price: number;

  @Field({ nullable: true })
  category: string;

  @Field({ nullable: true } )
  brand: string;

  @Field()
  quantity: number;

  @Field()
  imageURL: string;
}


export {ProductInput };