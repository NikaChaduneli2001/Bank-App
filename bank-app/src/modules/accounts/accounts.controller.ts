import {
  Body,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { createAccountDto } from 'src/dto/create-accounts.dto';
import { getAllAccountsDto } from 'src/dto/get-all-accounts.dto';
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
  private readonly logger = new Logger(AccountsController.name);
  constructor(private readonly accountService: AccountsService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createAccount(@Body() data: createAccountDto) {
    this.logger.log(`create accounts data: ${JSON.stringify(data)}`);
    try {
      const newAccount = await this.accountService.createAccount(data);
      this.logger.log(
        `created account newAccount: ${JSON.stringify(newAccount)}`,
      );
      if (!newAccount) {
        this.logger.error(
          `created account not found with given params: ${JSON.stringify(
            data,
          )}`,
        );
        return getErrorMessage('Could not create account with given params');
      } else {
        return getSuccessMessage(newAccount);
      }
    } catch (error) {
      this.logger.error(
        `could not created account with given params: ${JSON.stringify(
          data,
        )} , error: ${error}`,
      );
      return getErrorMessage('Could not create account');
    }
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAccounts(@Query() data: getAllAccountsDto) {
    this.logger.log(`get all accounts data: ${JSON.stringify(data)}`);
    try {
      const account = await this.accountService.getAllAccounts(data);
      this.logger.log(`get all accounts : ${JSON.stringify(account)}`);
      if (!account) {
        this.logger.error(
          `accounts not found with given data: ${JSON.stringify(data)}`,
        );
        return getErrorMessage('Could not get account');
      } else {
        return getSuccessMessage(account);
      }
    } catch (error) {
      this.logger.error(
        `could not  get accounts with given data: ${JSON.stringify(
          data,
        )}, error: ${error}`,
      );
      return getErrorMessage('Could not get accounts with given params');
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deletedAccount(@Param('id') id: number, @Req() req) {
    this.logger.log(
      `deleting account id: ${JSON.stringify(id)}, req: ${JSON.stringify(req)}`,
    );
    try {
      const { user } = req;
      const belongs = await this.accountService.accountBelongsToUser(
        id,
        user.userId,
      );
      this.logger.log(`belongs to user: ${JSON.stringify(belongs)}`);
      if (!belongs) {
        this.logger.error(
          `not belongs to users with id:${JSON.stringify(
            id,
          )},req:${JSON.stringify(req)}`,
        );
        return getErrorMessage('Unspecified user');
      }
      const deleted = await this.accountService.deletedAccont(Number(id));
      this.logger.log(`deleted accounts : ${JSON.stringify(deleted)}`);
      if (!deleted) {
        this.logger.error(
          `could not deleted account with given id:${JSON.stringify(
            id,
          )},req:${JSON.stringify(req)}`,
        );
        return getErrorMessage('Could not delete account');
      } else {
        return getSuccessMessage(deleted);
      }
    } catch (error) {
      this.logger.error(
        `could not deleted accounts with given params id:${JSON.stringify(
          id,
        )},req:${JSON.stringify(req)},error: ${error}`,
      );
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
    this.logger.log(
      `updateing account id: ${JSON.stringify(id)}, req: ${JSON.stringify(
        req,
      )},body: ${JSON.stringify(data)}`,
    );
    try {
      const { user } = req;
      const belongs = await this.accountService.accountBelongsToUser(
        id,
        user.userId,
      );
      this.logger.log(`belongs to user: ${JSON.stringify(belongs)}`);
      if (!belongs) {
        this.logger.error(
          `not belongs to users with id:${JSON.stringify(
            id,
          )},req:${JSON.stringify(req)},body: ${JSON.stringify(data)}`,
        );
        return getErrorMessage('Unspecified user');
      }
      const updated = await this.accountService.updateAccount(id, data);
      this.logger.log(`updated account :${JSON.stringify(updated)}`);
      if (!updated) {
        this.logger.error(
          `could not updated account with given id:${JSON.stringify(
            id,
          )},req:${JSON.stringify(req)}`,
        );
        return getErrorMessage('Could not update account');
      } else {
        return getSuccessMessage(updated);
      }
    } catch (error) {
      this.logger.error(
        `could not deleted accounts with given params id:${JSON.stringify(
          id,
        )},req:${JSON.stringify(req)},body: ${JSON.stringify(
          data,
        )},error: ${error}`,
      );
      return getErrorMessage('Could not update account with given params');
    }
  }
  @Get('user/:userId')
  async getUsersAccount(@Req() req) {
    this.logger.log(`get users account request: req ${JSON.stringify(req)}`);
    try {
      const { user } = req;
      const findUsersAccount = await this.accountService.getUsersAccount(
        user.userId,
      );
      this.logger.log(
        `find users accounts : ${JSON.stringify(findUsersAccount)}`,
      );
      if (!findUsersAccount) {
        this.logger.error(
          `users accounts not found : req ${JSON.stringify(req)}`,
        );
        return getErrorMessage('Could not find users account');
      } else {
        return getSuccessMessage(findUsersAccount);
      }
    } catch (error) {
      this.logger.error(
        `could not find users accounts with given params : req ${error}`,
      );
      return getErrorMessage('Could not find users account with given params');
    }
  }

  @Get('company/:companyId')
  async getCompanyAccount(@Req() req) {
    this.logger.log(`get company account request: req ${JSON.stringify(req)}`);
    try {
      const { user } = req;
      const findAccount = await this.accountService.getCompanyAccount(
        user.companyId,
      );
      this.logger.log(`find company accounts : ${JSON.stringify(findAccount)}`);
      if (!findAccount) {
        this.logger.error(
          `comapny accounts not found : req ${JSON.stringify(req)}`,
        );
        return getErrorMessage('Could not find company account');
      } else {
        return getSuccessMessage(findAccount);
      }
    } catch (error) {
      this.logger.error(
        `could not find company accounts with given params : req ${JSON.stringify(
          req,
        )}`,
      );
      return getErrorMessage(
        'Could not find company account with given params',
      );
    }
  }
}
