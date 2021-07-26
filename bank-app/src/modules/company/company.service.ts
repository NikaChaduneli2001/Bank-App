import { Injectable } from '@nestjs/common';
import { getAllCompanyDto } from 'src/dto/get-all-company.dto';
import { registerCompanyDto } from 'src/dto/register-company.dto';
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
}
