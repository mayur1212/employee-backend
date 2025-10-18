import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Department {
    id: ID!
    name: String!
    floor: String
  }

  type Employee {
    id: ID!
    name: String!
    position: String!
    salary: Float!
    department: Department
  }

  type Query {
    getAllEmployees: [Employee!]!
    getEmployeeDetails(id: ID!): Employee
    getEmployeesByDepartment(departmentId: ID!): [Employee!]!
    getAllDepartments: [Department!]!
  }

  type Mutation {
    addEmployee(name: String!, position: String!, departmentId: ID!, salary: Float!): Employee!
    updateEmployee(id: ID!, name: String, position: String, departmentId: ID, salary: Float): Employee
    deleteEmployee(id: ID!): Boolean!
    addDepartment(name: String!, floor: String): Department!
  }
`;
