import { getProduct, getRelatedProducts } from '../mock-data';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const product = getProduct(params.id);
  
  if (!product) {
    throw error(404, 'Product not found');
  }
  
  const relatedProducts = getRelatedProducts(params.id, 4);
  
  return {
    product,
    relatedProducts
  };
};