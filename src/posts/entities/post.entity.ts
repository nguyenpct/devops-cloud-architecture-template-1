import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Post {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  published?: boolean;

  @Field(() => User, { nullable: true })
  author?: User;

  @Field(() => Int, { nullable: true })
  authorId?: number;
}
