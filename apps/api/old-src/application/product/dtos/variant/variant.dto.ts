export class VariantDto {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  attributes: Record<string, any>;
}
