import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.product.create({
      data,
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  findByCategory(categoryId: number) {
    return this.prisma.product.findMany({
      where: {
        categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async update(
    id: number,
    data: UpdateProductDto,
  ) {

  const product =
    await this.prisma.product.findUnique({
      where: { id },
    });

  if (!product) {

    throw new NotFoundException(
      'Producto no encontrado',
    );
  }

  return this.prisma.product.update({
    where: { id },
    data,
    });
  }
}