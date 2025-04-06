// types/company.ts
// models/Company.ts
import { model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { CompanyDocument, CompanyModel } from "@src/interfaces/mongoose.gen";
import { applySoftDelete } from "@src/helpers/mongoose-helpers";

const mongoose = require('mongoose');

// Define the schema for the Company model
const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // name is required
      trim: true,
    },
    supportEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    employees: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', // referencing the User model
          required: true,
        },
        roles: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Role', // referencing the Role model
          required: true,
        }],
        isActive: {
          type: Boolean,
          default: true, // Default value for isActive
        },
      },
    ],
    availableRoles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role', // referencing the Role model
      },
    ],
    defaultRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role', // referencing the Role model
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // referencing the User model
      required: true, // owner is required
    },
    isDeleted: {type: Boolean, default: false}
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

applySoftDelete(CompanySchema)
CompanySchema.plugin(mongoosePaginate);  // Adds pagination functionality


export const Company = model<CompanyDocument, CompanyModel>('Company', CompanySchema);
export default Company;
