import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

  @ApiProperty({
    example: 'Byron',
    description: 'Nombre del usuario',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Vega',
    description: 'Apellido del usuario',
  })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    example: 'byron@email.com',
    description: 'Correo electrónico',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Contraseña mínimo 6 caracteres',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

}