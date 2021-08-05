import { Injectable } from '@nestjs/common';
import { getAllCompanyDto } from 'src/dto/get-all-company.dto';
import { registerCompanyDto } from 'src/dto/register-company.dto';
import { CompanyInterface } from 'src/interface/company.interface';
import { CompanyMysqlService } from '../../repositories/company/company_mysql.repository';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepo: CompanyMysqlService) {}

  async registerComapany(data: registerCompanyDto) {
    try {
      const registerCompany = await this.companyRepo.registerCompany(data);
      if (!registerCompany) {
        return false;
      }
      return registerCompany;
    } catch {
      return null;
    }
  }

  async getCompanies(data: getAllCompanyDto) {
    try {
      const companies = await this.companyRepo.getAllCompany(data);
      if (!companies) throw new Error('companies not found');
    } catch {
      return null;
    }
  }

  async getOneCompany(id: number) {
    try {
      const findOneCompany = await this.companyRepo.getOneCompany(id);
      if (!findOneCompany) {
        return false;
      }
      return findOneCompany;
    } catch {
      return null;
    }
  }

  async deletedCompany(id: number) {
    try {
      const deleted = await this.companyRepo.deletedCompany(id);
      if (!deleted) throw new Error('company not deleted');
      return deleted;
    } catch {
      return null;
    }
  }

  async updateCompany(id: number, data: CompanyInterface) {
    try {
      const updated = await this.companyRepo.updateCompany(id, data);
      if (!updated) {
        throw new Error('company not updated');
      }
      return updated;
    } catch {
      return null;
    }
  }
}
