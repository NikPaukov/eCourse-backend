import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { MediaTypeEnum } from "@src/types/common";
import { applySoftDelete } from "@src/helpers/mongoose-helpers";
import { QuestionDocument, QuestionModel } from "@src/interfaces/mongoose.gen";

const QuestionSchema = new Schema({
  text: {
    type: String,
    required: false,  // Optional text for the question
  },
  media: [{kind: {type: String, enum: MediaTypeEnum, required: true}, url: String}],
  answers: [{
    type: String,
    required: true,  // Answers are required
  }],
  correctAnswers: [{
    type: String,
    required: true,  // Correct answers are required
  }],
  isMultichoice: {
    type: Boolean,
    required: true,  // Whether the question is multiple choice or not is required
  },
  isDeleted: {type: Boolean, default: false}
}, { timestamps: true });  // Adds createdAt and updatedAt fields

applySoftDelete(QuestionSchema)
QuestionSchema.plugin(mongoosePaginate);  // Adds pagination functionality


const Question = model<QuestionDocument, QuestionModel>("Question", QuestionSchema);
export default Question;