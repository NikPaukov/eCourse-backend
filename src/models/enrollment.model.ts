import { model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { applySoftDelete } from "@src/helpers/mongoose-helpers";
import { EnrollmentDocument, EnrollmentModel } from "@src/interfaces/mongoose.gen";

const mongoose = require('mongoose');

// Define the schema for the Enrollment model
const EnrollmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course', // referencing the Course model
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // referencing the User model
      required: true,
    },
    progress: {
      type: Number,
      required: true,
      default: 0, // Default progress value is 0
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false, // Default value for isCompleted is false
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group', // referencing the Group model
      required: true,
    },
    certificate: {
      type: String,
      default: '', // Optional field for certificate, default is empty string
    },
    completedResources: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource', // referencing the Resource model
      required: true,
    }],
    allowedResources: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource', // referencing the Resource model
    }],    
    isDeleted: {type: Boolean, default: false}
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

applySoftDelete(EnrollmentSchema)
EnrollmentSchema.plugin(mongoosePaginate);  // Adds pagination functionality


export const Enrollment = model<EnrollmentDocument, EnrollmentModel>('Enrollment', EnrollmentSchema);
export default Enrollment;

