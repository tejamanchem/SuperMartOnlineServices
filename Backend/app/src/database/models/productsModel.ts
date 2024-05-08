const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const productSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
  },
  brand: {
    type: String,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  imageURL: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Product = mongoose.model("Product", productSchema);
