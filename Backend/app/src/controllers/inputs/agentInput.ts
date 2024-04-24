import { Field, InputType, Int } from "type-graphql";
import { EmployeeInput } from "./employeeInput";

@InputType()
class AgentInput implements Partial<any> {
  @Field()
  public agentId: string;

  @Field()
  public agentDetails: string;
}


export { AgentInput };