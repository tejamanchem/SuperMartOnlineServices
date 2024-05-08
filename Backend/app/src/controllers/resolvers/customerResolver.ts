import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Customer } from "./../../database/models/customerModel";
import { CustomerInput } from "./../inputs/customerInput";
import { CustomerType } from "./../types/customerType";
import { Service } from "typedi";

@Resolver()
@Service()
export default class CustomerResolver {
  @Query(() => [CustomerType])
  async getAllCustomers(): Promise<CustomerType[]> {
    const customers: any = await Customer.find();

    return customers;
  }

  @Mutation(() => CustomerType)
  async createCustomer(
    @Arg("input") input: CustomerInput
  ): Promise<CustomerType> {
    const customer: any = await Customer.create(input);
    return customer;
  }
}
