import { Get } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { getAllCompanyDto } from 'src/dto/get-all-company.dto';
import { getAllAccountsDto } from 'src/dto/get-all.accounts.dto';
import { registerCompanyDto } from 'src/dto/register-company.dto';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  @Post()
  async register(data: registerCompanyDto) {
    try {
      const result = await this.companyService.registerComapany(data);
      if (!result) {
        return getErrorMessage('Could not registered company');
      } else {
        return getSuccessMessage(result);
      }
    } catch {
      return getErrorMessage('Could not register company with given paramს');
    }
  }
  @Get()
  async getAllCompany(data: getAllCompanyDto) {
    try {
      const result = await this.companyService.getCompanies(data);
      if (!result) {
        return getErrorMessage('Could not get companies');
      } else {
        return getSuccessMessage(result);
      }
    } catch {
      return getErrorMessage('Could not get companies with given params');
    }
  }
}
