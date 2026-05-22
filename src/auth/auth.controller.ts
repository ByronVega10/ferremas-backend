import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { 
  ApiTags, 
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Registrar usuario',
    description: 'Crear una nueva cuenta',
  })
  @ApiCreatedResponse({
    description: 'Usuario registrado correctamente',
  })
  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }


  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Retorna JWT access token',
  })
  @ApiOkResponse({
    description: 'Login exitoso',
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales inválidas',
  })
  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }
}
