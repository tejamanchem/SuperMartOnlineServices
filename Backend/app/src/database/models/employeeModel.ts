import mongoose from "mongoose";

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  employeeName: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  primaryNumber: {
    type: String,
    required: true,
  },
  secondaryNumber: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  joiningDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    default: "Active",
  },
  profilePicture: {
    type: String,
  },
  password: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now() },
});
export const Employee = mongoose.model("Employee", employeeSchema);
