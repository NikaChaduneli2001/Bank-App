import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getAllCompanyDto } from 'src/dto/get-all-company.dto';
import { registerCompanyDto } from 'src/dto/register-company.dto';
import { CompanyEntity } from 'src/entities/company.entity';
import { CompanyInterface } from 'src/interface/company.interface';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyMysqlService {
  private readonly logger = new Logger(CompanyMysqlService.name);
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async companyBelongsToUser(companyId: number, userId: number) {
    this.logger.log(
      `company belongs to user , companyId: ${JSON.stringify(
        companyId,
      )}, userId: ${JSON.stringify(userId)}`,
    );
    const findUsersCompany = await this.companyRepository.findOne(companyId);
    this.logger.log(`find users company ${JSON.stringify(findUsersCompany)}`);
    if (findUsersCompany.user === userId) {
      return findUsersCompany;
    } else {
      this.logger.error(`users company not found`);
      return false;
    }
  }

  async registerCompany(data: registerCompanyDto) {
    this.logger.log(`register company data :${JSON.stringify(data)}`);
    const newCompany: CompanyEntity = new CompanyEntity();
    newCompany.companyName = data.companyName;
    newCompany.email = data.email;
    const registeredCompany = await this.companyRepository.save(newCompany);
    this.logger.log(`registered company ${registeredCompany}`);
    if (!registeredCompany) {
      this.logger.error(`registered comoany not found`);
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
    this.logger.log(`get all compnay company data: ${JSON.stringify(data)}`);
    const query = await this.companyRepository.createQueryBuilder();
    this.logger.log(`get all compnay company query: ${JSON.stringify(query)}`);
    query.where('deleted=false');
    if (data.searchBy) {
      if (data.searchBy.companyName) {
        query.andWhere('companyName like :CompanyName', {
          CompanyName: `%${this.escapeLikeString(data.searchBy.companyName)}%`,
        });
      }
    }
    if (data.sortBy) {
      query.orderBy(data.sortBy, data.sortDir);
    }
    let limit = 25;
    if (data.limit) {
      Math.min(data.limit, 25);
    }
    query.limit(data.limit);
    if (data.page) {
      const page = data.page - 1;
      query.offset(page * limit);
    }
    const result = await query.getMany();
    this.logger.log(`all companys found: ${JSON.stringify(result)}`);
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

  async getOneCompany(id: number) {
    this.logger.log(`getOneCompany id: ${JSON.stringify(id)}`);
    const findCompany = await this.companyRepository.findOne({ id });
    this.logger.log(`findCompany id: ${JSON.stringify(findCompany)}`);
    if (!findCompany) {
      this.logger.error(`company not found`);
      return false;
    } else {
      return findCompany;
    }
  }

  async deletedCompany(id: number) {
    this.logger.log(`deleting company id: ${JSON.stringify(id)}`);
    await this.companyRepository.save({
      id,
      delete: true,
    });

    const deleted = await this.companyRepository.findOne({ id });
    this.logger.log(`deleted company: ${JSON.stringify(deleted)}`);
    if (!deleted) {
      this.logger.error(
        `deleted company not found with given id: ${JSON.stringify(id)}`,
      );
      return false;
    } else {
      return {
        id: deleted.id,
        company: deleted.companyName,
      };
    }
  }

  async updateCompany(id: number, data: CompanyInterface) {
    this.logger.log(
      `updateing company with id ${JSON.stringify(
        id,
      )} and data ${JSON.stringify(data)}`,
    );
    await this.companyRepository.save({
      id,
      ...data,
    });

    const updated = await this.companyRepository.findOne({ id });
    this.logger.log(`updated comoany : ${JSON.stringify(updated)}`);
    if (!updated) {
      this.logger.error(
        `updated company not found with given id: ${JSON.stringify(
          id,
        )} and data: ${JSON.stringify(data)}`,
      );
      return false;
    } else {
      return {
        id: updated.id,
        company: updated.companyName,
        email: updated.email,
      };
    }
  }
}
