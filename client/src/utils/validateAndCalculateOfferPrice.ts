import { CartItem } from 'shared/types';

const validateAndCalculateOfferPrice = (item: CartItem): CartItem => {
  const { product } = item;

  if (!product) {
    throw new Error('Product information is missing');
  }
  let offerPrice = product.price;

  if (product.offer && product.offer.discount > 0) {
    offerPrice =
      product.offer.type === 'Percentage'
        ? product.price - (product.price * product.offer.discount) / 100
        : product.price - product.offer.discount;
  }

  return {
    ...item,
    offerPrice,
  };
};

export default validateAndCalculateOfferPrice;
