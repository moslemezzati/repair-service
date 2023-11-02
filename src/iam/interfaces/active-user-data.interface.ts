import { Role } from '../../users/enums/role.enum';

export interface ActiveUserData {
  sub: number;
  mobile: string;
  role: Role;
}
