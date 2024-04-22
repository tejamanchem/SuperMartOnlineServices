import { Field, ID, Int, ObjectType } from "type-graphql";
import {Agent,agentSchema} from "./../../database/models/agentModel"
@ObjectType({
  description: "Agent Type",
})
export class AgentType {
  @Field({ nullable: true })
  public agentName: String;

  @Field({ nullable: true })
  public agentPrimaryNumber: String;

  @Field({ nullable: true })
  public agentEmployeeId: String;
}
