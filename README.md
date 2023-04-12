## Tech Stack

***Nestjs + GraphQL + Prisma + Elasticsearch***

## Installation

```bash
# To install all infrastructures (postgres + elasticsearch + kibana)
$ docker-compose -f docker-compose.yaml up -d

# To install all dependencies
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## GraphQL

- Nest offers two ways of building GraphQL applications, the **code first** and the **schema first** methods
  - In the **code first** approach, you use decorators and TypeScript classes to generate the corresponding GraphQL schema. This approach is useful if you prefer to work exclusively with TypeScript and avoid context switching between language syntaxes.
  - In the **schema first** approach, the source of truth is GraphQL SDL (Schema Definition Language) files. SDL is a language-agnostic way to share schema files between different platforms. Nest automatically generates your TypeScript definitions (using either classes or interfaces) based on the GraphQL schemas to reduce the need to write redundant boilerplate code.
- **Code-first** approach:
  - The first step in using GraphQL with NestJS is initializing it in our ***AppModule***
  **/app.module.ts**
    ```bash
    import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
    import { Module } from '@nestjs/common';
    import { GraphQLModule } from '@nestjs/graphql';
    import { join } from 'path';
    import { AppController } from './app.controller';
    import { AppService } from './app.service';

    @Module({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          playground: true,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          path: '/app/graphql',
        }),
        ConfigModule.forRoot({ isGlobal: true }),
      ],
      controllers: [AppController],
      providers: [AppService],
    })
    export class AppModule {}
    ```
  - With the playground, we get an interactive, graphical interface that we can use to interact with our server.
  - Since we use the code-first approach, we need to define the autoSchemaFile to describe the path where our generated schema will be created.
  - Queries
    - The first thing to do when we want to query data using the code-first approach is to define a **model**. NestJS translates it under the hood into the **object type**.
    **/src/users/entities/user.entity.ts**
      ```bash
      import { ObjectType, Field, Int } from '@nestjs/graphql';
      import { Post } from '../../posts/entities/post.entity';

      @ObjectType()
      export class User {
        @Field(() => Int)
        id: number;

        @Field()
        email: string;

        @Field({ nullable: true })
        name?: string;

        @Field(() => [Post], { nullable: 'itemsAndList' })
        posts: Post[];
      }
      ```
    - To provide instructions on how to turn GraphQL operation into data, we need to define a **resolver**. Thanks to using decorators, NestJS can generate SDL files from our code.
    **/src/users/users.resolver.ts**
      ```bash
      import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
      import { UsersService } from './users.service';
      import { User } from './entities/user.entity';

      @Resolver(() => User)
      export class UsersResolver {
        constructor(private readonly usersService: UsersService) {}

        @Query(() => [User], { name: 'users' })
        findAll() {
          return this.usersService.findAll();
        }

        @Query(() => User, { name: 'user' })
        findOne(@Args('id', { type: () => Int }) id: number) {
          return this.usersService.findOne(id);
        }
      }
      ```

  - Mutation
    - Aside from querying the data, we also want to be able to create it. To do that, we need migrations with inputs.
    **/src/users/dto/create-user.input.ts**
      ```bash
      import { InputType, Field } from '@nestjs/graphql';
      import { IsEmail, IsOptional } from 'class-validator';

      @InputType()
      export class CreateUserInput {
        @Field()
        @IsEmail()
        email: string;

        @Field({ nullable: true })
        @IsOptional()
        name?: string;
      }
      ```
    - Once that’s all taken care of, we can add the above to our resolver.
    **src/users/users.resolver.ts**
      ```bash
      import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
      import { UsersService } from './users.service';
      import { User } from './entities/user.entity';
      import { CreateUserInput } from './dto/create-user.input';

      @Resolver(() => User)
      export class UsersResolver {
        constructor(private readonly usersService: UsersService) {}

        @Mutation(() => User)
        createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
          return this.usersService.create(createUserInput);
        }
      }
      ```
      
## Prisma

- **Set the database connection**
  - Your database connection is configured in the datasource block in your **/prisma/schema.prisma** file
    ```bash
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

    generator client {
      provider = "prisma-client-js"
    }
    ```

  - The format of the connection URL for your database depends on the database you use. For PostgreSQL, it looks as follows
    ```bash
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
    ```

  - You can create new tables in your database using **Prisma Migrate** by add new models to your **schema.prisma** file
    ```bash
    model User {
      id    Int     @default(autoincrement()) @id
      email String  @unique
      name  String?
      posts Post[]

      @@map("users")
    }

    model Post {
      id        Int      @default(autoincrement()) @id
      title     String
      content   String?
      published Boolean? @default(false)
      author    User?    @relation(fields: [authorId], references: [id])
      authorId  Int?

      @@map("posts")
    }
    ```

  - With your Prisma models in place, you can generate your SQL migration files and run them against the database. Run the following commands in your terminal:
    ```bash
    $ npx prisma migrate dev --name init
    ```

  - This **prisma migrate dev** command generates SQL files and directly runs them against the database.
    ```bash
    $ tree prisma
    prisma
    ├── migrations
    │   └── 20230411061034_init
    │       └── migration.sql
    └── schema.prisma
    ```

  - Prisma Client is a type-safe database client that's *generated* from your Prisma model definition. Because of this approach, Prisma Client can expose **CRUD** operations that are tailored specifically to your models.

## Elasticsearch

- **Connecting to Elasticsearch in NestJS**
  - To use Elasticsearch within our NestJS project, we can use the official **@nestjs/elasticsearch** library. It wraps the **@elastic/elasticsearch** client. Since it is a peer dependency of **@nestjs/elasticsearch**, we need to install it.

  - Due to how i did set up Elesticsearch, our cluster is available at  http://localhost:9200. We need to add all of the above to our environment variables.

    **.env**
      ```bash
      ELASTICSEARCH_NODE=http://localhost:9200
      ```
  - Now we can create our module that uses the above configuration.
  - Due to how i did set up Elesticsearch, our cluster is available at  http://localhost:9200. We need to add all of the above to our environment variables.

    ***/src/search/search.module.ts***
    ```bash
    import { Module } from '@nestjs/common';
    import { ConfigModule, ConfigService } from '@nestjs/config';
      import { ElasticsearchModule } from '@nestjs/elasticsearch';

      @Module({
        imports: [
          ElasticsearchModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              node: configService.get('ELASTICSEARCH_NODE'),
            }),
            inject: [ConfigService],
          }),
        ],
        exports: [ElasticsearchModule],
      })
      export class SearchModule {}
    ```
- **Populating Elasticsearch with data**
  - The first thing to consider when populating Elasticsearch with data is the concept of the **index**. In the context of Elasticsearch, we group similar documents by assigning them with the same **index**.
    ```bash
    # Create new index in elasticsearch
    curl --location --request PUT 'http://localhost:9200/users' \
    --header 'Content-Type: application/json' \
    --data '{
      "settings": {
        "number_of_shards": 1
      },
      "mappings": {
        "properties": {
            "id": {
              "type": "integer"
            },
            "email": {
              "type": "text"
            },
            "name": {
              "type": "text"
            }
          }
      }
    }'
    ```
  - Create a service that takes care of interacting with our Elasticsearch cluster.

    **/src/users/users-search.service.ts**
    ```bash
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
      }
    ```

  - The crucial thing to acknowledge about  **elasticsearchService.search** is that it returns just the properties that we’ve put into the Elasticsearch database. Since we save the ids of the posts, we can now get the whole documents from our Postgres database. Let’s put this logic into ***UsersService***.
    **/src/users/users.service.ts**
    ```bash
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
      }

    ```

  - The last thing to do is to modify the resolver so that it accepts a query parameter.
    **/src/users/users.resolver.ts**
      ```bash
      import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
      import { UsersService } from './users.service';

      @Resolver(() => User)
      export class UsersResolver {
        constructor(private readonly usersService: UsersService) {}

        @Query(() => [User], { name: 'users' })
        findAll(
          @Args('search', { type: () => String, nullable: true }) search?: string,
        ) {
          console.log('Resolver User findAll');
          if (search) {
            return this.usersService.searchForUsers(search);
          }
          return this.usersService.findAll();
        }
      }
      ```

- **Keeping Elasticsearch consistent with our database**
  - Deleting documents
    - Since we save the id of the post in our Elasticsearch database, we can use it to find it and delete it. To do so, we can use the  *deleteByQuery* function.
    **/src/users/users-search.service.ts**
      ```bash
      import { Injectable } from '@nestjs/common';
      import { ElasticsearchService } from '@nestjs/elasticsearch';
      import { User } from '@prisma/client';

      @Injectable()
      export default class UsersSearchService {
        index = 'users';

        constructor(private readonly elasticsearchService: ElasticsearchService) {}

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
      }
      ```

    - Let’s call the above method in  **UsersService** every time we delete a user.
    **/src/users/user.service.ts**
      ```bash
      import { Injectable } from '@nestjs/common';
      import { PrismaService } from '../database/prisma.service';
      import UsersSearchService from './users-search.service';

      @Injectable()
      export class UsersService {
        constructor(
          private readonly prisma: PrismaService,
          private readonly usersSearchService: UsersSearchService,
        ) {}

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
      ```

  - Modifying documents
    - The other thing to make sure that the Elasticsearch database is consistent with our main database is to modify existing documents. To do that, we can use the *updateByQuery* function.
    - Unfortunately, we need to write a script that updates all of the necessary fields. For example, to update the email and the name, we need:
      ```bash
      ctx._source.email='New email'; ctx._source.name= 'New name';
      ```

    - We can create the above script dynamically.
    **/src/users/users-search.service.ts**
      ```bash
      import { Injectable } from '@nestjs/common';
      import { ElasticsearchService } from '@nestjs/elasticsearch';
      import { User } from '@prisma/client';

      @Injectable()
      export default class UsersSearchService {
        index = 'users';

        constructor(private readonly elasticsearchService: ElasticsearchService) {}

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
      }
      ```

    - Now we need to use the above method whenever we modify existing users.
    **/src/users/users.service.ts**
      ```bash
      import { Injectable } from '@nestjs/common';
      import { PrismaService } from '../database/prisma.service';
      import UsersSearchService from './users-search.service';

      @Injectable()
      export class UsersService {
        constructor(
          private readonly prisma: PrismaService,
          private readonly usersSearchService: UsersSearchService,
        ) {}

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
      }
      ```
