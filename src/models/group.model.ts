// models/Group.ts
import { model, Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { applySoftDelete } from "@src/helpers/mongoose-helpers";
import { GroupDocument, GroupModel } from "@src/interfaces/mongoose.gen"; // Assuming Enrollment model is in @src/types/enrollment

const GroupSchema = new Schema({
  name: {
    type: String,
    required: true,  // name is required
  },
  course: {
    type: Types.ObjectId,
    ref: "Course",  // Referring to the Course model
    required: true,
  },
  participants: [{
    type: Types.ObjectId,
    ref: "Enrollment",  // Referring to the Enrollment model
    required: true,
  }],    
  isDeleted: {type: Boolean, default: false}
}, { timestamps: true }); // Adds createdAt and updatedAt fields

applySoftDelete(GroupSchema)
GroupSchema.plugin(mongoosePaginate);  // Adds pagination functionality


const Group = model<GroupDocument, GroupModel>("Group", GroupSchema);
export default Group;
