import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { User } from '@prisma/client';

@Injectable()
export default class UsersSearchService {
  index = 'users';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexUser(user: User) {
    return this.elasticsearchService.index<User>({
      index: this.index,
      document: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  }

  async search(text: string) {
    console.log('text: ', text);
    const { hits } = await this.elasticsearchService.search<User>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['email', 'name'],
          },
        },
      },
    });
    const count = hits.total;
    const results = hits.hits.map((item) => item._source);
    return {
      count,
      results,
    };
  }

  async remove(postId: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      query: {
        match: {
          id: postId,
        },
      },
    });
  }

  async update(user: User) {
    const newDocument: User = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const script = Object.entries(newDocument).reduce(
      (result, [key, value]) => {
        return `${result} ctx._source.${key}='${value}';`;
      },
      '',
    );

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      script: {
        source: script,
      },
      query: {
        match: {
          id: user.id,
        },
      },
    });
  }

  async count(query: string, fields: string[]) {
    const { count } = await this.elasticsearchService.count({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query,
            fields,
          },
        },
      },
    });
    return count;
  }
}
