export interface ProductFeedItem {
  id: string;
  name: string;
  price: number;
  discountPercent: number | null;
}

export interface CategoryProductFeedItem {
  id: string;
  name: string;
  products: ProductFeedItem[];
}

export interface GetCategoryProductFeedResult {
  categories: CategoryProductFeedItem[];
}
