import { Body, Delete, Get, Param, Req } from '@nestjs/common';
import { Put } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { getAllCompanyDto } from 'src/dto/get-all-company.dto';
import { getAllAccountsDto } from 'src/dto/get-all.accounts.dto';
import { registerCompanyDto } from 'src/dto/register-company.dto';
import { CompanyInterface } from 'src/interface/company.interface';
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

  @Get(':id')
  async getOneCompany(@Param('id') id: number) {
    try {
      const findCompany = await this.companyService.getOneCompany(id);
      if (!findCompany) {
        return getErrorMessage('Could not get company');
      } else {
        return getSuccessMessage(findCompany);
      }
    } catch {
      return getErrorMessage('Could not get company with given params');
    }
  }

  @Delete(':id')
  async deletedCompany(@Param('id') id: number) {
    try {
      const deleted = await this.companyService.deletedCompany(id);
      if (!deleted) {
        return getErrorMessage('Could not delete company');
      } else {
        return getSuccessMessage(deleted);
      }
    } catch {
      return getErrorMessage('Could not delete company with given params');
    }
  }

  @Put(':id')
  async updateCompany(@Param('id') id: number, @Body() data: CompanyInterface) {
    try {
      const updated = await this.companyService.updateCompany(id, data);
      if (!updated) {
        return getErrorMessage('Could not update company');
      } else {
        return getSuccessMessage(updated);
      }
    } catch {
      return getErrorMessage('Could not update company with given params');
    }
  }
}
