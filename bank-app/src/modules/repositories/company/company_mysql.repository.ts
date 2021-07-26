import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
