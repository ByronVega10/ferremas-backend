import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registrar usuario' })
  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @ApiOperation({ summary: 'Iniciar sesión' })
  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }
}
