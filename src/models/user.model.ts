// models/User.js
import { model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { UserDocument, UserModel } from "@src/interfaces/mongoose.gen";
import { applySoftDelete } from "@src/helpers/mongoose-helpers";
import bcrypt from "bcrypt";
const mongoose = require('mongoose');



const UserSchema = new mongoose.Schema({
  companies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company', // referencing the Company model
  }],
  firstName: {
    type: String,
    required: true, // not null
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // usually you want emails to be unique too
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  isDeleted: {type: Boolean, default: false}
}, { timestamps: true }); // optional, adds createdAt and updatedAt fields


const SALT_ROUNDS = 10; // You can adjust this
UserSchema.pre("save", async function (next: any) {
  // TODO
  // @ts-ignore
  const user = this as any; // or as UserDocument if you have the type ready

  // Only hash if the password field is modified (or new)
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});
applySoftDelete(UserSchema)
UserSchema.plugin(mongoosePaginate);  // Adds pagination functionality

export const User = model<UserDocument, UserModel>('User', UserSchema);
export default User;

