export class CreateProductDto {
  sku: string;
  name: string;
  brand: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: number;
}