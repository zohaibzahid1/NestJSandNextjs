import { Controller, Post, Get, Req, UseGuards, ForbiddenException, Res, Body, Patch, Put, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { AddressInput } from './dto/address.dto';
import { JwtGuard } from 'src/guards/jwt-auth.guard';
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('save-address')
    @UseGuards(JwtGuard)
    async saveAddress(@Body() address: AddressInput, @Req() req) {
        return this.usersService.saveAddress(address, req.user.userId);
    }
    @Patch('update-address')
    @UseGuards(JwtGuard)
        async updateAddress(@Body() address: AddressInput, @Req() req) {
        return this.usersService.updateAddress(address, req.user.userId);
    }
    @Get('get-address')
    @UseGuards(JwtGuard)
    async getAddress(@Req() req, @Res() res) {
        const address = await this.usersService.getAddress(req.user.userId);
        res.status(200).json({ address });
    }
    //  NOTE : we are not using guards here because we are working with admin to perform opertions all users
    // get all users
    @Get('get-active-users')
    async getUsers() {
        return this.usersService.getActiveUsers();
    }
    // get all users including soft deleted users
    @Get('get-all-users')
    async getAllUsers() {
        return this.usersService.getAllUsers();
    }
    // soft delete user
    @Delete('soft-delete-user/:id')
    async softDeleteUser(@Param('id') id: number) {
        return this.usersService.softDeleteUser(id);
    }
    // restore user
    @Patch('restore-user/:id')
    async restoreUser(@Param('id') id: number) {
        return this.usersService.restoreUser(id);
    }
    // hard delete user
    @Delete('hard-delete-user/:id')
    async hardDeleteUser(@Param('id') id: number) {
        return this.usersService.hardDeleteUser(id);
    }   
}