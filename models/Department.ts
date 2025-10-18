import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  floor?: string;
}

const DepartmentSchema: Schema = new Schema({
  name: { type: String, required: true },
  floor: { type: String },
});

export const Department = mongoose.model<IDepartment>("Department", DepartmentSchema);
