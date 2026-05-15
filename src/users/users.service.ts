import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll() {

    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }
}