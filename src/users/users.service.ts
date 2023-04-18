import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    const savedUser = await this.prisma.user.create({
      data: createUserInput,
    });
    return savedUser;
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        posts: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        posts: true,
      },
    });
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserInput,
    });
    return this.prisma.user.findUnique({ where: { id } });
  }

  async remove(id: number) {
    const result = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return result;
  }
}
