import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../database/database.module';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { SearchModule } from '../search/search.module';
import UsersSearchService from './users-search.service';

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, SearchModule],
      providers: [UsersResolver, UsersService, UsersSearchService],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
