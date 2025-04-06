import { Schema } from "mongoose";

export const applySoftDelete = (schema: Schema) => {
  schema.methods.softDelete = async function () {
    this.isDeleted = true;
    await this.save();
  };

// Add a method to restore a soft-deleted user
  schema.methods.restore = async function () {
    this.isDeleted = false;
    await this.save();
  };

// This hook will automatically exclude soft-deleted users from all find operations
  schema.pre('find', function () {
    this.where({ isDeleted: false });
  });
  schema.pre('findOne', function () {
    this.where({ isDeleted: false });
  });
}