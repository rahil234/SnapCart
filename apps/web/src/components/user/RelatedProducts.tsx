import ProductCard from '@/components/user/ProductCard';
import { useGetProductsByCategoryId } from '@/hooks/product.hooks';

function RelatedProducts({ categoryId }: { categoryId: string }) {
  const {
    data: products,
    isLoading,
    error,
  } = useGetProductsByCategoryId(categoryId, {
    enabled: !!categoryId,
  });

  if (isLoading) {
    return <div>Loading related products...</div>;
  }

  if (error) {
    return <div>Error loading related products: {error.message}</div>;
  }

  return (
    <div>
      <section className="mt-12">
        <h3 className="text-2xl text-center font-semibold mb-4">
          You may also like
        </h3>
        <div className="flex gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default RelatedProducts;
