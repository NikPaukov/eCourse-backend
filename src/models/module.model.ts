// models/Module.ts
import { model, Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { applySoftDelete } from "@src/helpers/mongoose-helpers";
import { ModuleDocument, ModuleModel } from "@src/interfaces/mongoose.gen";

const ModuleSchema = new Schema({
  name: {
    type: String,
    required: true,  // name is required
  },
  resources: [{
    resource: {
      type: Types.ObjectId,
      ref: "Resource",  // Referring to the Resource model
      required: true,
    },
    order: {
      type: Number,
      required: true,  // order is required
    },
    isRequired: {
      type: Boolean,
      required: true,  // isRequired is required
    }
  }],
  isDeleted: {type: Boolean, default: false}
}, { timestamps: true }); // Adds createdAt and updatedAt fields

applySoftDelete(ModuleSchema)
ModuleSchema.plugin(mongoosePaginate);  // Adds pagination functionality


const Module = model<ModuleDocument, ModuleModel>("Module", ModuleSchema);
export default Module;
