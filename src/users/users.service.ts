import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import UsersSearchService from './users-search.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersSearchService: UsersSearchService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const savedUser = await this.prisma.user.create({
      data: createUserInput,
    });
    await this.usersSearchService.indexUser(savedUser);
    return savedUser;
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        posts: true,
      },
    });
  }

  async searchForUsers(text: string) {
    const { results } = await this.usersSearchService.search(text);
    console.log(results);
    const ids = results.map((result) => result.id);
    if (!ids.length) {
      return [];
    }
    const items = await this.prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        posts: true,
      },
    });
    return items;
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
    const result = await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserInput,
    });
    const updatedPost = await this.prisma.user.findUnique({ where: { id } });
    if (updatedPost) {
      await this.usersSearchService.update(updatedPost);
    }
    return result;
  }

  async remove(id: number) {
    const result = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    if (result) {
      await this.usersSearchService.remove(id);
    }
    return result;
  }
}
