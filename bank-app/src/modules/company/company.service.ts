import { Injectable } from '@nestjs/common';
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
}
