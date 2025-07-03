import { Resolver, Query, Mutation, Args, Context, Int } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { User } from "src/entities/users.entity";
import { AddressInput } from "./dto/address.dto";
import { JwtGuard } from "src/guards/jwt-auth.guard";
import { UseGuards } from "@nestjs/common";
import { Address } from "src/entities/address.entity";

// This decorator marks the class as a GraphQL resolver for the User entity.
// It tells NestJS GraphQL to treat this class as responsible for handling GraphQL queries and mutations related to the User type.
@Resolver(() => User) // this is called thunk that tells typescript what is the type of the object
export class UsersResolver {
    constructor(private usersService: UsersService) {}
    
    // GraphQL Query to get all users
    @Query(() => [User])
    async getAllUsers(): Promise<User[]> {
        return this.usersService.getAllUsers();
    }

    // GraphQL Query to get all active users
    @Query(() => [User])
    async getActiveUsers(): Promise<User[]> {
        return this.usersService.getActiveUsers();
    }

    // soft delete user
    @Mutation(() => Boolean) 
    async softDeleteUser(@Args('id', { type: () => Int }) id: number) {
        return this.usersService.softDeleteUser(id);
    }

    // restore user
    @Mutation(() => Boolean)
    async restoreUser(@Args('id', { type: () => Int }) id: number) {
        return this.usersService.restoreUser(id);
    }

    // hard delete user
    @Mutation(() => Boolean)
    async hardDeleteUser(@Args('id', { type: () => Int }) id: number) {
        return this.usersService.hardDeleteUser(id);
    }

    // save address
    @Mutation(() => Boolean)
    @UseGuards(JwtGuard) // this will check if the user is authenticated 
    async saveAddress(@Args('address') address: AddressInput, @Context() context: any) {
        // get the user id from the context
        const userId = context.req.user.userId;
        return await this.usersService.saveAddress(address, userId);
    }

    // update address
    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async updateAddress(@Args('address') address: AddressInput, @Context() context: any) {
        const userId = context.req.user.userId;
        return this.usersService.updateAddress(address, userId);
    }

    // get address
    @Query(() => Address, { nullable: true })
    @UseGuards(JwtGuard)
    async getAddress(@Context() context: any) {
        const userId = context.req.user.userId;
        return this.usersService.getAddress(userId);
    }

}

