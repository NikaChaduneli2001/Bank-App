import {
  Body,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { createServiceDto } from 'src/dto/create-service.dto';
import { getAllServicesDto } from 'src/dto/get-all-service.dto';
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
  private readonly logger = new Logger(ServiceController.name);
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createService(@Body() data: createServiceDto) {
    this.logger.log(`create service body: ${JSON.stringify(data)}`);
    try {
      const newAccount = await this.serviceService.createService(data);
      this.logger.log(
        `created service new service : ${JSON.stringify(newAccount)}`,
      );
      return getSuccessMessage(newAccount);
    } catch (error) {
      this.logger.error(
        `could not created service with given params , data: ${JSON.stringify(
          data,
        )}`,
      );
      return getErrorMessage('Could not create account');
    }
  }

  @Get()
  async getService(@Query() data: getAllServicesDto) {
    this.logger.log(`get all services data: ${JSON.stringify(data)}`);
    try {
      const account = await this.serviceService.getAllServices(data);
      this.logger.log(`get all services :${JSON.stringify(account)}`);
      if (!account) {
        this.logger.error(
          `could bot ger srvices with given params , data: ${JSON.stringify(
            data,
          )}`,
        );
        return getErrorMessage('Could not get account');
      } else {
        return getSuccessMessage(account);
      }
    } catch (error) {
      this.logger.error(
        `could not get services with given params , data: ${JSON.stringify(
          data,
        )}, error: ${error}`,
      );
      return getErrorMessage('Could not get account with given params');
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deletedService(@Param('id') id: number) {
    this.logger.log(`deleting service with given id:${JSON.stringify(id)}`);
    try {
      const deleted = await this.serviceService.deleteService(Number(id));
      this.logger.log(`deleted services : ${JSON.stringify(deleted)}`);
      if (!deleted) {
        this.logger.error(
          `could not deleted service with given id:${JSON.stringify(id)}`,
        );
        return getErrorMessage('Could not delete account');
      } else {
        return getSuccessMessage(deleted);
      }
    } catch (error) {
      this.logger.error(
        `could not delete services with given params , id: ${JSON.stringify(
          id,
        )}, error: ${error}`,
      );
      return getErrorMessage('Could not delete account with given params');
    }
  }
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateService(@Param('id') id: number, data: updateServiceDto) {
    this.logger.log(
      `updateing service with given id:${JSON.stringify(
        id,
      )} and data: ${JSON.stringify(data)}`,
    );
    try {
      const updated = await this.serviceService.updateService(id, data);
      this.logger.log(`updated service : ${JSON.stringify(updated)}`);
      if (!updated) {
        this.logger.error(
          `could not updated service with given id:${JSON.stringify(
            id,
          )} and data : ${JSON.stringify(data)}`,
        );
        return getErrorMessage('Could not update service');
      } else {
        return getSuccessMessage(updated);
      }
    } catch (error) {
      this.logger.error(
        `could not delete services with given params , id: ${JSON.stringify(
          id,
        )},and data : ${JSON.stringify(data)},error: ${error}`,
      );
      return getErrorMessage('Could not update service with given params');
    }
  }
}
