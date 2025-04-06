// types/role.ts
import { model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { RoleDocument, RoleModel } from "@src/interfaces/mongoose.gen";
import { applySoftDelete } from "@src/helpers/mongoose-helpers";

const mongoose = require('mongoose');

// Define the schema for the Role model
const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // name is required
      trim: true,
    },
    isPublic: {
      type: Boolean,
      required: true, // isPublic is required
    },
    availableTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company', // referencing the Company model
    }],
    isDeleted: {type: Boolean, default: false}
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);
// Add pagination functionality with mongoose-paginate-v2
applySoftDelete(RoleSchema)
RoleSchema.plugin(mongoosePaginate);

export const Role = model<RoleDocument, RoleModel>('Role', RoleSchema);
export default Role;
