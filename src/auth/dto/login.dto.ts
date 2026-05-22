import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {

  @ApiProperty({
    example: 'admin@ferremas.com',
    description: 'Correo usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Contraseña usuario',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}