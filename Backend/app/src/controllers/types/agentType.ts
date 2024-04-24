import { Field, ID, Int, ObjectType } from "type-graphql";
import {Agent,agentSchema} from "./../../database/models/agentModel"
import { EmployeeType } from "./employeeType";
@ObjectType({
  description: "Agent Type",
})
export class AgentType {
  @Field({ nullable: true })
  public agentId: String;

  @Field({ nullable: true })
  public agentDetails: EmployeeType;
}
