import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  floor: { type: String },
});

export const Department = mongoose.model("Department", departmentSchema);
