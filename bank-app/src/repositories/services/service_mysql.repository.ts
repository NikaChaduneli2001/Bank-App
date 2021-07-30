import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createServiceDto } from 'src/dto/create-service.dto';
import { getAllServicesDto } from 'src/dto/get-all-service.dto';
import { updateServiceDto } from 'src/dto/update-service.dto';
import { ServicesEntity } from 'src/entities/services.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceMySqlService {
  private readonly logger = new Logger(ServiceMySqlService.name);
  constructor(
    @InjectRepository(ServicesEntity)
    private readonly servicesRepo: Repository<ServicesEntity>,
  ) {}

  async createService(data: createServiceDto) {
    this.logger.log(`create service data :${data}`);
    const service = new ServicesEntity();
    service.user = data.user;
    service.type = data.type;
    service.account = data.account;
    service.description = data.description;
    service.price = data.price;

    const result = await this.servicesRepo.save(service);
    this.logger.log(`created service result : ${result}`);
    if (!result) {
      this.logger.error(
        `could not created service with given params : ${data}`,
      );
      return false;
    }
    return {
      id: result.id,
      user: result.user,
      type: result.type,
      account: result.account,
      description: result.description,
      price: result.price,
    };
  }

  async getAllServices(data: getAllServicesDto) {
    this.logger.log(`get all srvices data: ${data}`);
    const query = this.servicesRepo
      .createQueryBuilder('service')
      .where('service.deleted=false');
    this.logger.log(`get all srvices query : ${query}`);

    if (data.sortBy) {
      query.orderBy(data.sortBy, data.sortDir);
    }
    if (data.searchBy) {
      query.where('name like :service', {
        service: `%${this.escapeLikeString(data.searchBy)}%`,
      });
    }
    if (data.limit) {
      const limit = Math.min(data.limit, 15);
      query.limit(data.limit);

      const page = data.page ? data.page - 1 : 0;
      query.offset(page * limit);
    } else {
      query.limit(15);
    }
    const result = await query.getMany();
    this.logger.log(`get all services result: ${result}`);
    return result.map((result) => ({
      id: result.id,
      user: result.user,
      type: result.type,
      account: result.account,
      description: result.description,
      price: result.price,
    }));
  }
  escapeLikeString(raw: string): string {
    return raw.replace(/[\\%_]/g, '\\$&');
  }
  async updateService(id: number, data: updateServiceDto) {
    this.logger.log(`updateing service ${id} and data: ${data}`);
    await this.servicesRepo.save({ id, data });
    const updateService = await this.servicesRepo.findOne({ id });
    this.logger.log(`updated services result: ${updateService}`);
    if (!updateService) {
      this.logger.error(
        `coud not updated service with given id:${id} and data: ${data}`,
      );
      return false;
    } else {
      return {
        id: updateService.id,
        userId: updateService.user,
        type: updateService.type,
        account: updateService.account,
        description: updateService.description,
        price: updateService.price,
      };
    }
  }

  async deleteService(id: number) {
    this.logger.log(`deleting service with id: ${id}`);
    await this.servicesRepo.save({
      id,
      deleted: true,
    });

    const deletedService = await this.servicesRepo.findOne({ id });
    this.logger.log(`deleted service :${deletedService}`);
    if (!deletedService) {
      this.logger.error(`could not deleted service with given id: ${id}`);
      return false;
    } else {
      return {
        id: deletedService.id,
        userId: deletedService.user,
        type: deletedService.type,
        account: deletedService.account,
        description: deletedService.description,
        price: deletedService.price,
      };
    }
  }
}
