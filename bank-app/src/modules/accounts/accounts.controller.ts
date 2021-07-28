import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { createAccountDto } from 'src/dto/create-accounts.dto';
import { getAllAccountsDto } from 'src/dto/get-all.accounts.dto';
import { Role } from 'src/enums/role.enum';
import { AccountInterface } from 'src/interface/account.interface';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createAccount(@Body() data: createAccountDto) {
    try {
      const newAccount = await this.accountService.createAccount(data);
      if (!newAccount) {
        return getErrorMessage('Could not create account with given params');
      } else {
        return getSuccessMessage(newAccount);
      }
    } catch {
      return getErrorMessage('Could not create account');
    }
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAccount(@Query() data: getAllAccountsDto) {
    try {
      const account = await this.accountService.getAllAccounts(data);
      if (!account) {
        return getErrorMessage('Could not get account');
      } else {
        return getSuccessMessage(account);
      }
    } catch {
      return getErrorMessage('Could not get account with given params');
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deletedAccount(@Param('id') id: number, @Req() req) {
    try {
      const { user } = req;
      const belongs = await this.accountService.accountBelongsToUser(
        id,
        user.userId,
      );
      if (!belongs) {
        return getErrorMessage('Unspecified user');
      }
      const deleted = await this.accountService.deletedAccont(Number(id));
      if (!deleted) {
        return getErrorMessage('Could not delete account');
      } else {
        return getSuccessMessage(deleted);
      }
    } catch {
      return getErrorMessage('Could not delete account with given params');
    }
  }

  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateAccount(
    @Param('id') id: number,
    @Body() data: AccountInterface,
    @Req() req,
  ) {
    try {
      const { user } = req;
      const belongs = await this.accountService.accountBelongsToUser(
        id,
        user.userId,
      );
      if (!belongs) {
        return getErrorMessage('Unspecified user');
      }
      const updated = await this.accountService.updateAccount(id, data);
      if (!updated) {
        return getErrorMessage('Could not update account');
      } else {
        return getSuccessMessage(updated);
      }
    } catch {
      return getErrorMessage('Could not update account with given params');
    }
  }
  @Get('user/:userId')
  async getUsersAccount(@Req() req) {
    try {
      const { user } = req;
      const findUsersAccount = await this.accountService.getUsersAccount(
        user.userId,
      );
      if (!findUsersAccount) {
        return getErrorMessage('Could not find users account');
      } else {
        return getSuccessMessage(findUsersAccount);
      }
    } catch {
      return getErrorMessage('Could not find users account with given params');
    }
  }

  @Get('company/:companyId')
  async getCompanyAccount(@Req() req) {
    try {
      const { user } = req;
      const findAccount = await this.accountService.getCompanyAccount(
        user.companyId,
      );
      if (!findAccount) {
        return getErrorMessage('Could not find company account');
      } else {
        return getSuccessMessage(findAccount);
      }
    } catch {
      return getErrorMessage(
        'Could not find company account with given params',
      );
    }
  }
}
