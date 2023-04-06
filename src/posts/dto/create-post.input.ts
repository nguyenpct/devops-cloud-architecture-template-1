import { InputType, Field, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field()
  @IsString()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  content?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @Field(() => Int, { nullable: true })
  @IsInt()
  authorId?: number;
}
