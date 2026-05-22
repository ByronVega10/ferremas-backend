import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.category.create({
      data,
    });
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  remove(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async update(
    id: number,
    data: UpdateCategoryDto,
  ) {

    const category =
      await this.prisma.category.findUnique({
        where: { id },
      });

    if (!category) {
      throw new NotFoundException(
        'Categoría no encontrada',
      );
    }

    return this.prisma.category.update({
      where: { id },
      data,
    });
  }
}