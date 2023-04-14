import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import UsersSearchService from './users-search.service';
import { mock } from 'jest-mock-extended';
import { PrismaService } from '../database/prisma.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  const prismaService = mock<PrismaService>();
  const elasticsearchService = mock<ElasticsearchService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UsersResolver,
        UsersService,
        UsersSearchService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: ElasticsearchService,
          useValue: elasticsearchService,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
