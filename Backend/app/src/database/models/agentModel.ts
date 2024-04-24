import mongoose from "mongoose";

const schema = mongoose.Schema;

export const agentSchema = new schema({
  agentId: { type: String, unique: true, require: true },
  agentDetails: { type: schema.Types.ObjectId ,unique:true},
  createdAt: { type: Date, default: Date.now() },
});

export const Agent = mongoose.model("agents", agentSchema);
