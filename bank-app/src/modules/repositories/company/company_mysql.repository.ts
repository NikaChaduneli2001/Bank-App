import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getAllCompanyDto } from 'src/dto/get-all-company.dto';
import { registerCompanyDto } from 'src/dto/register-company.dto';
import { CompanyEntity } from 'src/entities/company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyMysqlService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async registerCompany(data: registerCompanyDto) {
    const newCompany: CompanyEntity = new CompanyEntity();
    newCompany.companyName = data.companyName;
    newCompany.email = data.email;

    const registeredCompany = await this.companyRepository.save(newCompany);
    if (!registeredCompany) {
      return false;
    } else {
      return {
        id: registeredCompany.id,
        comanyName: registeredCompany.companyName,
        email: registeredCompany.email,
      };
    }
  }

  async getAllCompany(data: getAllCompanyDto) {
    const query = await this.companyRepository.createQueryBuilder();
    query.where('deleted=false');
    if (data.searchBy.companyName) {
      query.andWhere('companyName like :CompanyName', {
        CompanyName: `%${this.escapeLikeString(data.searchBy.companyName)}%`,
      });
    }
    if (data.sortBy) {
      query.orderBy(data.sortBy, data.sortDir);
    }
    let limit = 25;
    if (data.limit) {
      Math.min(data.limit, 25);
    }
    query.limit(limit);
    if (data.page) {
      const page = data.page - 1;
      query.offset(page * limit);
    }
    const result = await query.getMany();
    if (result) {
      return result.map((company) => ({
        id: company.id,
        company: company.companyName,
        email: company.email,
      }));
    } else {
      return null;
    }
  }

  escapeLikeString(raw: string): string {
    return raw.replace(/[\\%_]/g, '\\$&');
  }

  async deletedCompany(id: number) {
    await this.companyRepository.save({
      id,
      delete: true,
    });

    const deleted = await this.companyRepository.findOne({ id });
    if (!deleted) {
      return false;
    } else {
      return {
        id: deleted.id,
        company: deleted.companyName,
      };
    }
  }
}
