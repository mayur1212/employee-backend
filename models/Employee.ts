import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  name: string;
  position: string;
  salary: number;
  department: mongoose.Types.ObjectId;
}

const EmployeeSchema: Schema = new Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, default: 0 },
  department: { type: Schema.Types.ObjectId, ref: "Department" }
});

export const Employee = mongoose.model<IEmployee>("Employee", EmployeeSchema);
