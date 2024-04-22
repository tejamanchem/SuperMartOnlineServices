import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { Employee } from "../../database/models/employeeModel";
import { EmployeeType } from "../types/employeeType";
import { EmployeeInput } from "../inputs/employeeInput";

@Resolver()
@Service()
export class EmployeeResolver {
  constructor() {}

  @Query((returns) => [EmployeeType])
  public async getEmployeeDetails(@Ctx() { requestId }: any): Promise<any> {
    try {
      return await Employee.find();
    } catch (error: any) {
      throw error;
    }
  }

  @Mutation((returns) => EmployeeType)
  public async createEmployee(
    @Ctx() { requestId }: any,
    @Arg("input") input: EmployeeInput
  ): Promise<any> {
    try {
      console.log("==========================", input);
      const newEmployee = new Employee(input);
      let response = await newEmployee.save();
      console.log("response", response);
      return response;
    } catch (error: any) {
      throw error;
    }
  }
}
