export interface ProductFeedItem {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
  variant: {
    id: string;
    name: string;
    price: number;
    discountPercent: number | null;
    images: string[];
    stock: number;
  };
}

export interface CategoryProductFeedItem {
  id: string;
  name: string;
  products: ProductFeedItem[];
}

export interface GetCategoryProductFeedResult {
  categories: CategoryProductFeedItem[];
}
