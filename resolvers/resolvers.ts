import { Employee } from "../models/Employee.js";
import { Department } from "../models/Department.js";

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
      const employee = new Employee({ name, position, salary, department: departmentId });
      await employee.save();
      return employee.populate("department");
    },

    updateEmployee: async (_: any, { id, name, position, departmentId, salary }: any) => {
      const employee = await Employee.findByIdAndUpdate(
        id,
        { name, position, department: departmentId, salary },
        { new: true }
      );
      return employee?.populate("department");
    },

    deleteEmployee: async (_: any, { id }: { id: string }) => {
      const result = await Employee.findByIdAndDelete(id);
      return !!result;
    },

    addDepartment: async (_: any, { name, floor }: { name: string; floor?: string }) => {
      const department = new Department({ name, floor });
      await department.save();
      return department;
    },
  },
};
