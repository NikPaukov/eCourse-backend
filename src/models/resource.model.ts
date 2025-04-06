import mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { MediaTypeEnum } from "@src/types/common";
import { applySoftDelete } from "@src/helpers/mongoose-helpers";
import {
  LectureResourceDocument,
  LectureResourceModel,
  ResourceDocument,
  ResourceModel,
  TestResourceDocument,
  TestResourceModel,
  VideoResourceDocument,
  VideoResourceModel
} from "@src/interfaces/mongoose.gen";

const options = { discriminatorKey: 'type', timestamps: true };
export const ResourceSchema = new Schema({
  name: {
    type: String, course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource', // referencing the Resource model
      required: true,
    }, required: true
  },
  isDeleted: {type: Boolean, default: false}
}, options);

applySoftDelete(ResourceSchema);
ResourceSchema.plugin(mongoosePaginate);  // Adds pagination functionality

export const Resource = mongoose.model<ResourceDocument, ResourceModel>('Resource', ResourceSchema);


const TestResourceSchema = new mongoose.Schema({
  questions: [{
    type: Types.ObjectId,
    ref: "Question",  // Referring to the Enrollment model
    required: true
  }],
  passRate: { type: Number, default: 0 },
  showCorrectAnswers: Boolean
}, options);
applySoftDelete(TestResourceSchema)
TestResourceSchema.plugin(mongoosePaginate);  // Adds pagination functionality

export const TestResource = Resource.discriminator<TestResourceDocument, TestResourceModel>('TestResource', TestResourceSchema)

const LectureResourceSchema = new mongoose.Schema({
  text: String,
  media: [{ kind: {type: String, enum: MediaTypeEnum, required: true}, url: {type: String, required: true} }]
}, options);
applySoftDelete(LectureResourceSchema)
LectureResourceSchema.plugin(mongoosePaginate);  // Adds pagination functionality

export const LectureResource = Resource.discriminator<LectureResourceDocument,LectureResourceModel>('LectureResource', LectureResourceSchema)

const VideoResourceSchema = new mongoose.Schema({
  text: String,
  url: {type: String, required: true}
}, options);

applySoftDelete(VideoResourceSchema)
VideoResourceSchema.plugin(mongoosePaginate);  // Adds pagination functionality

export const VideoResource = Resource.discriminator<VideoResourceDocument, VideoResourceModel>('VideoResource',VideoResourceSchema)

