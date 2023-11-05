import { Role } from '../../users/enums/role.enum';

export interface ActiveUserData {
  sub: number;
  adminId?: number;
  mobile: string;
  role: Role;
}
