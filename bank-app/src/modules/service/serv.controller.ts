import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { createServiceDto } from 'src/dto/create-service.dto';
import { getAllServicesDto } from 'src/dto/get-all-service.dto';
import { getAllAccountsDto } from 'src/dto/get-all.accounts.dto';
import { updateServiceDto } from 'src/dto/update-service.dto';
import { Role } from 'src/enums/role.enum';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

import { ServiceService } from './serv.service';

@Controller('accounts')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createService(@Body() data: createServiceDto) {
    try {
      const newAccount = await this.serviceService.createService(data);
      return getSuccessMessage(newAccount);
    } catch {
      return getErrorMessage('Could not create account');
    }
  }

  @Get()
  async getService(@Query() data: getAllServicesDto) {
    try {
      const account = await this.serviceService.getAllServices(data);
      if (!account) {
        return getErrorMessage('Could not get account');
      } else {
        return getSuccessMessage(account);
      }
    } catch {
      return getErrorMessage('Could not get account with given params');
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deletedService(@Param('id') id: number) {
    try {
      const deleted = await this.serviceService.deleteService(Number(id));
      if (!deleted) {
        return getErrorMessage('Could not delete account');
      } else {
        return getSuccessMessage(deleted);
      }
    } catch {
      return getErrorMessage('Could not delete account with given params');
    }
  }
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateService(@Param('id') id: number, data: updateServiceDto) {
    try {
      const updated = await this.serviceService.updateService(id, data);
      if (!updated) {
        return getErrorMessage('Could not update service');
      } else {
        return getSuccessMessage(updated);
      }
    } catch {
      return getErrorMessage('Could not update service with given params');
    }
  }
}
