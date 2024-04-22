import mongoose from "mongoose";

const schema = mongoose.Schema


export const agentSchema = new schema({
    agentName:String,
    agentEmployeeId:String,
    agentPrimaryNumber:String,
    createdAt:{type:Date,default:Date.now()}        
})


export const Agent = mongoose.model("agents",agentSchema)