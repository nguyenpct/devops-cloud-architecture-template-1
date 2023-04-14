import { Test, TestingModule } from '@nestjs/testing';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';
import { PrismaService } from '../database/prisma.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { mock } from 'jest-mock-extended';

describe('PostsResolver', () => {
  let resolver: PostsResolver;
  const prismaService = mock<PrismaService>();
  const elasticsearchService = mock<ElasticsearchService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        PostsResolver,
        PostsService,
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

    resolver = module.get<PostsResolver>(PostsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
