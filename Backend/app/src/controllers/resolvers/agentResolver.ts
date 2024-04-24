import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { AgentType } from "./../types/agentType";
import { Agent } from "../../database/models/agentModel";
import { AgentInput } from "../inputs/agentInput";

@Resolver()
@Service()
export class AgentResolver {
  constructor() {}

  @Query((returns) => [AgentType])
  public async getAgentDetails(@Ctx() { requestId }: any): Promise<any> {
    try {
      return await Agent.find();
    } catch (error: any) {
      throw error;
    }
  }


  
  @Mutation((returns) => AgentType)
  public async createAgent(
    @Ctx() { requestId }: any,
    @Arg("input") input: AgentInput
  ): Promise<any> {
    try {
      const newUser = new Agent({
        agentId: input.agentId,
        agentDetails: input.agentDetails
      });
     let response =  await newUser.save();
      return response
      // return {
      //   agentEmployeeId: newUser.agentEmployeeId,
      //   agentName: newUser.agentName,
      //   agentPrimaryNumber: newUser.agentPrimaryNumber,
      // };
    } catch (error: any) {
      throw error;
    }
  }
}
