import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
class EmployeeType {
  @Field({ nullable: true })
  public id: string;

  @Field({ nullable: true })
  public employeeName: string;

  @Field({ nullable: true })
  public employeeId: string;

  @Field({ nullable: true })
  public primaryNumber: string;

  @Field({ nullable: true })
  public secondaryNumber?: string;

  @Field({ nullable: true })
  public email: string;

  @Field({ nullable: true })
  public address?: string;

  @Field({ nullable: true })
  public role: string;

  @Field({ nullable: true })
  public department: string;

  @Field({ nullable: true })
  public joiningDate: Date;

  @Field({ defaultValue: "Active", nullable: true })
  public status: string;

  @Field({ nullable: true })
  public profilePicture?: string;
}

export { EmployeeType };
