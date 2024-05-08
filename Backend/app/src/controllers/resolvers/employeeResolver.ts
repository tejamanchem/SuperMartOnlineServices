import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { Employee } from "../../database/models/employeeModel";
import { EmployeeType } from "../types/employeeType";
import { EmployeeInput } from "../inputs/employeeInput";

@Resolver()
@Service()
export default class EmployeeResolver {
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
      const newEmployee = new Employee(input);
      let response = await newEmployee.save();
      console.log("response", response);
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  @Mutation((returns) => EmployeeType)
  public async updateEmployee(
    @Ctx() { requestId }: any,
    @Arg("id") id: string,
    @Arg("input") input: EmployeeInput
  ): Promise<EmployeeType> {
    try {
      const updatedEmployee = await Employee.findByIdAndUpdate(id, input, {
        new: true,
      });
      if (!updatedEmployee) {
        throw new Error("Employee not found");
      }
      return updatedEmployee as any;
    } catch (error: any) {
      throw error;
    }
  }

  @Mutation((returns) => EmployeeType)
  public async deleteEmployee(
    @Ctx() { requestId }: any,
    @Arg("id") id: string
  ): Promise<EmployeeType> {
    try {
      const deletedEmployee = await Employee.findByIdAndDelete(id);
      if (!deletedEmployee) {
        throw new Error("Employee not found");
      }
      return deletedEmployee as any;
    } catch (error: any) {
      throw error;
    }
  }
}
