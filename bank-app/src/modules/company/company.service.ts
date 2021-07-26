import { Injectable } from '@nestjs/common';
import { getAllCompanyDto } from 'src/dto/get-all-company.dto';
import { registerCompanyDto } from 'src/dto/register-company.dto';
import { CompanyInterface } from 'src/interface/company.interface';
import { CompanyMysqlService } from '../repositories/company/company_mysql.repository';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepo: CompanyMysqlService) {}

  async registerComapany(data: registerCompanyDto) {
    try {
      return await this.companyRepo.registerCompany(data);
    } catch {
      return null;
    }
  }

  async getCompanies(data: getAllCompanyDto) {
    try {
      return await this.companyRepo.getAllCompany(data);
    } catch {
      return null;
    }
  }

  async deletedCompany(id: number) {
    try {
      return await this.companyRepo.deletedCompany(id);
    } catch {
      return null;
    }
  }

  async updateCompany(id: number, data: CompanyInterface) {
    try {
      return await this.companyRepo.updateCompany(id, data);
    } catch {
      return null;
    }
  }
}
