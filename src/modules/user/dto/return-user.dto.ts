import { Role } from 'src/commons/enums/role';
import { User } from '../user.entity';

export class ReturnUserDto {
  constructor(user: User, role: Role) {
    this.username = user.username;
    this.profileImage = user.profileImage;
    this.hashedPassword = user.hashedPassword;
    this.refreshToken = user.refreshToken;
    this.role = role;
  }
  username: string;
  profileImage: string;
  hashedPassword: string;
  refreshToken?: string | null;
  role: Role;
}
