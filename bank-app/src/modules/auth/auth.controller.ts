import { Body, Controller, Post } from '@nestjs/common';
import { loginDto } from 'src/dto/login-users.dto';
import { getErrorMessage } from 'src/utils/response-functions.utils';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  async login(@Body() data: loginDto) {
    try {
      const foundUser = await this.usersService.findUserByEmailAndPassword(
        data.email,
        data.password,
      );
      console.log(foundUser);
      if (!foundUser) {
        return getErrorMessage('Password or email not found');
      }
      const jwtToken = await this.authService.loginUser(foundUser);
      console.log(jwtToken);
      return {
        status: 'success',
        data: {
          email: foundUser.email,
          fullName: foundUser.fullName,
          role: foundUser.role,
          jwtToken,
        },
      };
    } catch {
      return getErrorMessage('Password or Email is incorrect');
    }
  }
}
