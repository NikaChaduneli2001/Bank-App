import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from 'src/dto/create-service.dto';
import { GetAllServicesDto } from 'src/dto/get-all-service.dto';

import { getAllAccountsDto } from 'src/dto/get-all.accounts.dto'
import { UpdateServiceDto } from 'src/dto/update-service.dto';
import { ServMySqlService } from '../../repositories/services/service_mysql.repository';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepo: ServMySqlService) {}

  async createService(data: CreateServiceDto) {
    try {
      const account = await this.serviceRepo.createService(data);
      return account;
    } catch {
      return null;
    }
  }
 
  async getAllServices(data: GetAllServicesDto) {
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

  async updateService(id: number, data: UpdateServiceDto) {
    try {
      return await this.serviceRepo.updateService(id, data);
    } catch {
      return null;
    }
  }
}


