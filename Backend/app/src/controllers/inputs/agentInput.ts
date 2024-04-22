import { Field, InputType, Int } from "type-graphql";

@InputType()
class AgentInput implements Partial<any> {
  @Field()
  public agentName: string;

  @Field()
  public agentEmployeeId: string;

  @Field()
  public agentPrimaryNumber: string;
}


export { AgentInput };