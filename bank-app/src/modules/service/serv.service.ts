import { Injectable } from '@nestjs/common';
import { createServiceDto } from 'src/dto/create-service.dto';
import { getAllServicesDto } from 'src/dto/get-all-service.dto';

import { getAllAccountsDto } from 'src/dto/get-all-accounts.dto';
import { updateServiceDto } from 'src/dto/update-service.dto';
import { ServiceMySqlService } from '../../repositories/services/service_mysql.repository';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepo: ServiceMySqlService) {}

  async createService(data: createServiceDto) {
    try {
      const account = await this.serviceRepo.createService(data);
      if (!account) throw new Error('service not created');
      return account;
    } catch {
      return null;
    }
  }

  async getAllServices(data: getAllServicesDto) {
    try {
      const services = await this.serviceRepo.getAllServices(data);
      if (!services) throw new Error('service not found');
      return services;
    } catch {
      return null;
    }
  }

  async deleteService(id: number) {
    try {
      const deleted = await this.serviceRepo.deleteService(id);
      if (!deleted) throw new Error('service not deleted');
      return deleted;
    } catch {
      return null;
    }
  }

  async updateService(id: number, data: updateServiceDto) {
    try {
      const updated = await this.serviceRepo.updateService(id, data);
      if (!updated) throw new Error('service not updated');
      return updated;
    } catch {
      return null;
    }
  }
}
