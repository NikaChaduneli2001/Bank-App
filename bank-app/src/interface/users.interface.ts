import { CompanyEntity } from 'src/entities/company.entity';
import { Role } from 'src/enums/role.enum';

export class usersInterface {
  id: number;
  companyId: number | CompanyEntity;
  fullName: string;
  email: string;
  time: string;
  hash: string;
  role: Role;
  phone: number;
  personalNumber: number;
  deleted: boolean;
}
