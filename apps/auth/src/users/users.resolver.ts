import { UserDocument } from "@app/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Resolver(() => UserDocument)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserDocument)
  createUser(
    @Args('createUserInput')  // extract the createUserInput params
    createUserInput: CreateUserDto,
  ) {
    return this.usersService.create(createUserInput);
  }

  // Return type [UserDocument] and method name 'users'
  @Query(() => [UserDocument], {name: 'users'})
  findAll() {
    return this.usersService.findAll()
  }
}