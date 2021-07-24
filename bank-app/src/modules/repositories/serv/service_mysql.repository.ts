import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateServiceDto } from 'src/dto/create-service.dto';
import { GetAllServicesDto } from 'src/dto/get-all-service.dto';
import { ServicesEntity } from 'src/entities/services.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServMySqlService {
    constructor(
        @InjectRepository(ServicesEntity)
        private readonly servicesRepo: Repository<ServicesEntity>,
      ) {}
    
      async createService(data: CreateServiceDto) {
        const service = new ServicesEntity();
        service.user = data.user;
        service.type = data.type;
        service.account = data.account;
        service.description = data.description;
        service.price = data.price;
    
        const result = await this.servicesRepo.save(service);
        return {
          id: result.id,
          user: result.user,
          type: result.type, 
          account: result.account,
          description: result.description,
          price: result.price,
       };
      }
      
      async getAllServices(data: GetAllServicesDto) {
        const query = this.servicesRepo.createQueryBuilder('service');
    
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
          query.limit(limit);
    
          const page = data.page ? data.page - 1 : 0;
          query.offset(page * limit);
        } else {
          query.limit(15);
        }
        const result = await query.getMany();
        return result.map((result) => ({
          id: result.id,
          user: result.user,
          type: result.type, 
          account: result.account,
          description: result.description,
          price: result.price
        }));
      }
      escapeLikeString(raw: string): string {
        return raw.replace(/[\\%_]/g, '\\$&');
      }
      async updateService(id: number, data: UpdateServiceDto) {
        const updatedService = await this.servicesRepo.save({ id, data });
        return updatedService;
      }
    
      async deleteService(id) {
        const deletedService = await this.servicesRepo.save({
          id,
          deleted: true,
        });
        return deletedService; 
      }
    }
    
}
