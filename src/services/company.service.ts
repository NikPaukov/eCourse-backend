import { AppError } from "@src/helpers/AppError";
import CompanyModel from "@src/models/company.model";
import { Company, CompanyDocument, CompanyQuery } from "@src/interfaces/mongoose.gen";
import mongoose, { PaginateResult } from "mongoose";

class CompanyServiceClass {
  public async createCompany(args: {
    data: {
      name: string;
      owner: string | mongoose.Types.ObjectId;
      supportEmail?: string;
    }
  }): Promise<CompanyDocument> {
    const { data } = args;
    const company = new CompanyModel({
      name: data.name,
      owner: data.owner,
      supportEmail: data.supportEmail,
      employees: [],
      availableRoles: [],
    });

    await company.save();
    return company;
  }

  public async findCompany(args: {
    id?: string | mongoose.Types.ObjectId,
    name?: string,
    owner?: string | mongoose.Types.ObjectId
  }): Promise<CompanyDocument | null> {
    const { id, name, owner } = args;

    if (!id && !name && !owner) {
      throw new Error("Either id or name must be provided.");
    }

    const query: any = { };
    if (id) query._id = id;
    if (name) query.name = name;
    if(owner) query.owner = owner;

    const company = await CompanyModel.findOne(query);
    return company;
  }

  public async listCompanies(args?: {
    filter?: Record<string, any>;
    page?: number;
    limit?: number;
    populateOwner?: boolean;
    populateEmployees?: boolean;
    lean?: boolean
  }): Promise<PaginateResult<Company>> {
    const {
      filter = {},
      page = 1,
      limit = 10,
      populateOwner = false,
      populateEmployees = false,
      lean = true
    } = args || {};

    const options: any = {
      page,
      limit,
      lean,
    };

    if (populateOwner || populateEmployees) {
      options.populate = [];
      if (populateOwner) options.populate.push('owner');
      if (populateEmployees) options.populate.push({
        path: 'employees.user',
        select: '_id firstName lastName email'
      });
    }

    const companies = await CompanyModel.paginate(filter, options);
    return companies;
  }

  public async updateCompany(args: {
    id: string | mongoose.Types.ObjectId;
    data: Partial<{
      name: string;
      supportEmail: string;
      defaultRole: string | mongoose.Types.ObjectId;
    }>;
  }): Promise<CompanyDocument> {
    const { id, data } = args;

    const company = await CompanyModel.findByIdAndUpdate(id, data, { new: true });
    if (!company) {
      throw new AppError(`Company ${id} not found.`, 404);
    }
    return company;
  }

  public async addEmployee(args: {
    companyId: string | mongoose.Types.ObjectId;
    userId: string | mongoose.Types.ObjectId;
    roleId: string | mongoose.Types.ObjectId;
  }): Promise<Company> {
    const { companyId, userId, roleId } = args;

      const company = await CompanyModel.findByIdAndUpdate(
        companyId,
        {
          $addToSet: {
            employees: {
              user: userId,
              roles: [roleId],
              isActive: true
            }
          }
        },
        { new: true }
      );

      if (!company) {
        throw new AppError(`Company ${companyId} not found.`, 404);
      }

      return company;
      }

  public async updateEmployeeRole(args: {
    companyId: string | mongoose.Types.ObjectId;
    userId: string | mongoose.Types.ObjectId;
    roles: (string | mongoose.Types.ObjectId)[];
  }): Promise<CompanyDocument> {
    const { companyId, userId, roles } = args;
     
    const company = await this.findCompany({id: companyId});

    if (!company) {
      throw new AppError(`Company not found.`, 404);
    }
    const employee = company.employees.find(el=>el.user===userId)
    if(!employee) {
      throw new AppError(`Employee not found.`, 404);
    }
    employee.roles = roles as any;
    await company.save()
  
    return company;
  }

  public async addAvailableRole(args: {
    companyId: string | mongoose.Types.ObjectId;
    roleId: string | mongoose.Types.ObjectId;
  }): Promise<CompanyDocument> {
    const { companyId, roleId } = args;

    const company = await CompanyModel.findByIdAndUpdate(
      companyId,
      {
        $addToSet: {
          availableRoles: roleId
        }
      },
      { new: true }
    );

    if (!company) {
      throw new AppError(`Company ${companyId} not found.`, 404);
    }

    return company;
  }

  public async deleteCompany(args: { id: string | mongoose.Types.ObjectId }) {
    const { id } = args;
    const company = await CompanyModel.findByIdAndUpdate(id, { isDeleted: true });
    if (!company) {
      throw new AppError("Company not found or already deleted.", 404);
    }
    return { deleted: true };
  }
}

export const CompanyService = new CompanyServiceClass();