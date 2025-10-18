import { Employee } from "../models/Employee.ts";
import { Department } from "../models/Department.ts";

export const resolvers = {
  Query: {
    getAllEmployees: async () => await Employee.find().populate("department"),
    getEmployeeDetails: async (_: any, { id }: { id: string }) =>
      await Employee.findById(id).populate("department"),
    getEmployeesByDepartment: async (_: any, { departmentId }: { departmentId: string }) =>
      await Employee.find({ department: departmentId }).populate("department"),
    getAllDepartments: async () => await Department.find(),
  },

  Mutation: {
    addEmployee: async (_: any, { name, position, departmentId, salary }: any) => {
      const employee = new Employee({ name, position, department: departmentId, salary });
      await employee.save();
      return employee.populate("department");
    },

    updateEmployee: async (_: any, { id, name, position, departmentId, salary }: any) => {
      const updated = await Employee.findByIdAndUpdate(
        id,
        { name, position, department: departmentId, salary },
        { new: true }
      ).populate("department");
      return updated;
    },

    deleteEmployee: async (_: any, { id }: { id: string }) => {
      const res = await Employee.findByIdAndDelete(id);
      return !!res;
    },

    addDepartment: async (_: any, { name, floor }: any) => {
      const dept = new Department({ name, floor });
      await dept.save();
      return dept;
    },
  },
};
