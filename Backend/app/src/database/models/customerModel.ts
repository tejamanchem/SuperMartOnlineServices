import mongoose from "mongoose";

const { Schema } = mongoose;

const customerSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  //   address: {
  //     street: {
  //       type: String,
  //       required: true,
  //     },
  //     city: {
  //       type: String,
  //       required: true,
  //     },
  //     state: {
  //       type: String,
  //       required: true,
  //     },
  //     postalCode: {
  //       type: String,
  //       required: true,
  //     },
  //     country: {
  //       type: String,
  //       required: true,
  //     },
  //   },

  address: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  password:{
    type:String,
    required:true
  }
});

export const Customer = mongoose.model("Customer", customerSchema);
