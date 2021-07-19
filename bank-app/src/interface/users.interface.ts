import { Role } from 'src/enums/role.enum';

export class usersInterface {
  id: number;
  fullName: string;
  email: string;
  time: string;
  hash: string;
  role: Role;
  phone: number;
  personalNumber: number;
  deleted: boolean;
}
