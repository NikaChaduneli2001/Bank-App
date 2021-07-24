import { Injectable } from '@nestjs/common';

import { getAllAccountsDto } from 'src/dto/get-all.accounts.dto'
import { ServMySqlService } from '../repositories/serv/service_mysql.repository';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepo: ServMySqlService) {}

  async createService(data: createServiceDto) {
    try {
      const account = await this.serviceRepo.createService(data);
      return account;
    } catch {
      return null;
    }
  }
 
  async getAllSevices(data: getAllServicesDto) {
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

  async updateService(id: number) {
    try {
      return await this.serviceRepo.updateService(id);
    } catch {
      return null;
    }
  }
}


