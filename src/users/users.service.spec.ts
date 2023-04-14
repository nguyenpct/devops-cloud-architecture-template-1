import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import UsersSearchService from './users-search.service';
import { ConfigService } from '@nestjs/config';
import { mock } from 'jest-mock-extended';
import { PrismaService } from '../database/prisma.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';

describe('UsersService', () => {
  let service: UsersService;
  const configService = mock<ConfigService>();
  const prismaService = mock<PrismaService>();
  const elasticsearchService = mock<ElasticsearchService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UsersService,
        UsersSearchService,
        {
          provide: ConfigService,
          useValue: configService,
        },
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

    service = module.get<UsersService>(UsersService);
    // configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
