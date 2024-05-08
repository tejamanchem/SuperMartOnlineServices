import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { ProductType } from "./../types/productType";
import {ProductInput} from "./../inputs/productInput"
import {Product} from "./../../database/models/productsModel";

@Resolver()
class ProductResolver {
  @Query(() => ProductType)
  async getProductById(@Arg("id") id: string): Promise<ProductType> {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  @Query(() => [ProductType])
  async getAllProducts(): Promise<ProductType[]> {
    return Product.find();
  }

  @Mutation(() => ProductType)
  async createProduct(@Arg("input") input: ProductInput): Promise<ProductType> {
    const product = await Product.create(input);
    return product;
  }

  @Mutation(() => ProductType)
  async updateProduct(
    @Arg("id") id: string,
    @Arg("input") input: ProductInput
  ): Promise<ProductType> {
    const product = await Product.findByIdAndUpdate(id, input, {
      new: true,
    });
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  @Mutation(() => ProductType)
  async deleteProduct(@Arg("id") id: string): Promise<ProductType> {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
}

export default ProductResolver;
