import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { DatabaseModule } from '../database/database.module';
import UsersSearchService from './users-search.service';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [DatabaseModule, SearchModule],
  providers: [UsersResolver, UsersService, UsersSearchService],
})
export class UsersModule {}
