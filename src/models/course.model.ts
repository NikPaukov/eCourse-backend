import { model, Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { applySoftDelete } from "@src/helpers/mongoose-helpers";
import { CourseDocument, CourseModel } from "@src/interfaces/mongoose.gen";

export enum CourseStatus {
  Active = "Active",
  Inactive = "Inactive",
  Deleted = "Deleted",
}

const CourseSchema = new Schema({
  name: {
    type: String,
    required: true,  // Name is required
  },
  company: {
    type: Types.ObjectId,
    ref: "Company",  // Referring to the Company model
    required: true,
  },
  isPublic: {
    type: Boolean,
    required: true,  // Public status is required
  },
  inviteLink: {
    type: String,
    required: false,  // Invite link is optional
  },
  modules: [{
    type: Types.ObjectId,
    ref: "Module",  // Referring to the Module model
    required: true,
  }],
  status: {
    type: String,
    enum: CourseStatus,  // Enum validation for course status
    required: true,  // Status is required
  },
  groups: [{
    type: Types.ObjectId,
    ref: "Group",  // Referring to the Group model
    required: true,
  }],
  isDeleted: {type: Boolean, default: false}
}, { timestamps: true }); // Adds createdAt and updatedAt fields

applySoftDelete(CourseSchema)
CourseSchema.plugin(mongoosePaginate);  // Adds pagination functionality


const Course = model<CourseDocument, CourseModel>("Course", CourseSchema);
export default Course;