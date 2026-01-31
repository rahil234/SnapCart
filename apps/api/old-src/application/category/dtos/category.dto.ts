export class CategoryDto {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
