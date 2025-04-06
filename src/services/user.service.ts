import { AppError } from "@src/helpers/AppError";
import UserModel from "@src/models/user.model";
import mongoose, { PaginateResult, Document } from "mongoose";
import { User, UserDocument } from "@src/interfaces/mongoose.gen";

class UserServiceClass {
  public async createUser(args: {
    data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }
  }): Promise<UserDocument> {
    const { data } = args;
    const user = new UserModel({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      companies: [],
    });
    
    await user.save();
    return user;
  }

  public async findUser(args: { 
    id?: string | mongoose.Types.ObjectId, 
    email?: string 
  }): Promise<UserDocument | null> {
    const { id, email } = args;

    if (!id && !email) {
      throw new Error("Either id or email must be provided.");
    }

    const query: any = {};
    if (id) query._id = id;
    if (email) query.email = email;

    const user = await UserModel.findOne(query);
    return user;
  }

  public async listUsers(args?: {
    filter?: Record<string, any>;
    page?: number;
    limit?: number;
    populateCompanies?: boolean;
    lean?: boolean;
  }): Promise<PaginateResult<User>> {
    const {
      filter = {},
      page = 1,
      limit = 10,
      populateCompanies = false,
      lean = true
    } = args || {};

    const options: any = {
      page,
      limit,
      lean, // returns plain JS objects instead of full mongoose docs
    };

    if (populateCompanies) {
      options.populate = "companies";
    }

    const users = await (UserModel as any).paginate(filter, options);
    return users;
  }

  public async updateUser(args: {
    id: string | mongoose.Types.ObjectId;
    data: Partial<{
      firstName: string;
      lastName: string;
      email: string;
    }>;
  }): Promise<UserDocument> {
    const { id, data } = args;

    const user = await UserModel.findByIdAndUpdate(id, data, { new: true });
    if (!user) {
      throw new AppError(`User ${id} not found.`, 404);
    }
    return user;
  }

  public async attachCompany(args: {
    id: string | mongoose.Types.ObjectId;
    data: Partial<{
      companyId: string | mongoose.Types.ObjectId;
    }>;
  }): Promise<UserDocument> {
    const { id, data } = args;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await UserModel.findByIdAndUpdate(
        id, 
        { $addToSet: { companies: data.companyId } }, 
        { new: true, session }
      );
      if (!user) {
        throw new AppError(`User ${id} not found.`, 404);
      }
      await session.commitTransaction();
      return user;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }

  public async deleteUser(args: { 
    id: string | mongoose.Types.ObjectId 
  }): Promise<{ deleted: boolean }> {
    const { id } = args;
    const user = await UserModel.findByIdAndUpdate(id, { isDeleted: true });
    if (!user) {
      throw new AppError("User not found or already deleted.", 404);
    }
    return { deleted: true };
  }
}

export const UserService = new UserServiceClass();