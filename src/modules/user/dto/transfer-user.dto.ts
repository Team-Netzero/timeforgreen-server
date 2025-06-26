import { User } from '../user.entity';

export class TransferUserDto {
  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.profileImage = user.profileImage;
    this.hashedPassword = user.hashedPassword;
    this.refreshToken = user.refreshToken;
  }
  id: string;
  username: string;
  profileImage: string;
  hashedPassword: string;
  refreshToken?: string | null;
}
