import { Body, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { createAccountDto } from 'src/dto/create-accounts.dto';
import { CreateServiceDto } from 'src/dto/create-service.dto';
import { GetAllServicesDto } from 'src/dto/get-all-service.dto';
import { getAllAccountsDto } from 'src/dto/get-all.accounts.dto';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';

import { ServiceService } from './serv.service';

@Controller('accounts')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  async createAccount(@Body() data: CreateServiceDto) {
    try {
      const newAccount = await this.serviceService.createService(data);
      return getSuccessMessage(newAccount);
    } catch {
      return getErrorMessage('Could not create account');
    }
  }

  @Get()
  async getAccount(@Query() data: GetAllServicesDto) {
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
  async deletedAccount(@Param('id') id: number) {
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
}
