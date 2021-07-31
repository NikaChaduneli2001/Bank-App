import {
  Body,
  Delete,
  Get,
  Logger,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Put } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { getAllCompanyDto } from 'src/dto/get-all-company.dto';
import { registerCompanyDto } from 'src/dto/register-company.dto';
import { Role } from 'src/enums/role.enum';
import { CompanyInterface } from 'src/interface/company.interface';
import { CompanyMysqlService } from 'src/repositories/company/company_mysql.repository';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('company')
export class CompanyController {
  private readonly logger = new Logger(CompanyController.name);
  constructor(private readonly companyService: CompanyMysqlService) {}
  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async register(data: registerCompanyDto) {
    this.logger.log(`register company: ${JSON.stringify(data)}`);
    try {
      const result = await this.companyService.registerCompany(data);
      this.logger.log(`registered company :${JSON.stringify(result)}`);
      if (!result) {
        this.logger.error(
          `registered company not found with given params ,data:${JSON.stringify(
            data,
          )}, result: ${JSON.stringify(result)}`,
        );
        return getErrorMessage('Could not registered company');
      } else {
        return getSuccessMessage(result);
      }
    } catch (error) {
      this.logger.error(
        `could not registered company with given params , data: ${JSON.stringify(
          data,
        )}. error: ${error}`,
      );
      return getErrorMessage('Could not register company with given paramს');
    }
  }
  @Get()
  async getAllCompany(data: getAllCompanyDto) {
    this.logger.log(`get all company data: ${JSON.stringify(data)}`);
    try {
      const result = await this.companyService.getAllCompany(data);
      this.logger.log(`found all company result: ${JSON.stringify(result)}`);
      if (!result) {
        this.logger.error(
          `not found all company result: ${JSON.stringify(
            result,
          )},data: ${JSON.stringify(data)}`,
        );
        return getErrorMessage('Could not get companies');
      } else {
        return getSuccessMessage(result);
      }
    } catch (error) {
      this.logger.error(
        `could not get companies with given params : ${JSON.stringify(
          data,
        )},error: ${error}`,
      );
      return getErrorMessage('Could not get companies with given params');
    }
  }

  @Get(':id')
  async getOneCompany(@Param('id') id: number, @Req() req) {
    this.logger.log(
      `get One Company with id:${JSON.stringify(id)}, req: ${JSON.stringify(
        req,
      )}`,
    );
    try {
      const { user } = req;
      const belongsToUser = await this.companyService.companyBelongsToUser(
        id,
        user.userId,
      );
      this.logger.log(`belongs to user ${JSON.stringify(belongsToUser)}`);
      if (!belongsToUser) {
        this.logger.error(
          `this s not your company, req:${JSON.stringify(req)}`,
        );
        return getErrorMessage('this is not yor company');
      }

      const findCompany = await this.companyService.getOneCompany(id);
      this.logger.log(`found company ${JSON.stringify(findCompany)}`);
      if (!findCompany) {
        this.logger.error(
          `company not found with given id ${JSON.stringify(id)}`,
        );
        return getErrorMessage('Could not get company');
      } else {
        return getSuccessMessage(findCompany);
      }
    } catch (error) {
      this.logger.error(
        `could not get compant with given id ${JSON.stringify(id)}`,
      );
      return getErrorMessage('Could not get company with given params');
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deletedCompany(@Req() req) {
    this.logger.log(`deleting company ${JSON.stringify(req)}`);
    try {
      const { user } = req;
      const deleted = await this.companyService.deletedCompany(user.companyId);
      this.logger.log(`deleted comapny : ${JSON.stringify(deleted)}`);
      if (!deleted) {
        this.logger.error(
          `deleted comoany not found with given id: ${JSON.stringify(
            user.companyId,
          )}`,
        );
        return getErrorMessage('Could not delete company');
      } else {
        return getSuccessMessage(deleted);
      }
    } catch (error) {
      this.logger.error(
        `could not deleted company with given id ${JSON.stringify(
          req.user.companyId,
        )}`,
      );
      return getErrorMessage('Could not delete company with given params');
    }
  }

  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateCompany(@Req() req, @Body() data: CompanyInterface) {
    this.logger.log(
      `updateding company ${JSON.stringify(req)},data:${JSON.stringify(data)}`,
    );
    try {
      const { user } = req;
      const updated = await this.companyService.updateCompany(
        user.companyId,
        data,
      );
      this.logger.log(`updated company ${updated}`);
      if (!updated) {
        this.logger.error(
          `updated company not found ${JSON.stringify(req.body.companyId)}`,
        );
        return getErrorMessage('Could not update company');
      } else {
        return getSuccessMessage(updated);
      }
    } catch (error) {
      this.logger.error(
        `could not update company ${JSON.stringify(req.body.companyId)}`,
      );
      return getErrorMessage('Could not update company with given params');
    }
  }
}
