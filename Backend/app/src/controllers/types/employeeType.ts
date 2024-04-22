import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
class EmployeeType {
  @Field(() => ID)
  public id: string;

  @Field()
  public employeeName: string;

  @Field()
  public employeeId: string;

  @Field()
  public primaryNumber: string;

  @Field({ nullable: true })
  public secondaryNumber?: string;

  @Field()
  public email: string;

  @Field({ nullable: true })
  public address?: string;

  @Field()
  public role: string;

  @Field()
  public department: string;

  @Field()
  public joiningDate: Date;

  @Field({ defaultValue: "Active" })
  public status: string;

  @Field({ nullable: true })
  public profilePicture?: string;
}

export { EmployeeType };
