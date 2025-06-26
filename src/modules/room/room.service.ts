import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  findAll() {
    return `This action returns all room`;
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
