import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { ConfigService } from '@nestjs/config';
import { mock } from 'jest-mock-extended';
import { PrismaService } from '../database/prisma.service';

describe('PostsService', () => {
  let service: PostsService;
  const configService = mock<ConfigService>();
  const prismaService = mock<PrismaService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        PostsService,
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
