import { Injectable } from '@nestjs/common';
import { createServiceDto } from 'src/dto/create-service.dto';
import { getAllServicesDto } from 'src/dto/get-all-service.dto';

import { getAllAccountsDto } from 'src/dto/get-all.accounts.dto';
import { updateServiceDto } from 'src/dto/update-service.dto';
import { ServiceMySqlService } from '../../repositories/services/service_mysql.repository';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepo: ServiceMySqlService) {}

  async createService(data: createServiceDto) {
    try {
      const account = await this.serviceRepo.createService(data);
      return account;
    } catch {
      return null;
    }
  }

  async getAllServices(data: getAllServicesDto) {
    try {
      return await this.serviceRepo.getAllServices(data);
    } catch {
      return null;
    }
  }

  async deleteService(id: number) {
    try {
      return await this.serviceRepo.deleteService(id);
    } catch {
      return null;
    }
  }

  async updateService(id: number, data: updateServiceDto) {
    try {
      return await this.serviceRepo.updateService(id, data);
    } catch {
      return null;
    }
  }
}
