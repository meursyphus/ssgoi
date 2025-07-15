import { getPinterestItem, getRelatedPins } from '../mock-data';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const item = getPinterestItem(params.id);
  
  if (!item) {
    throw error(404, 'Pin not found');
  }
  
  const relatedPins = getRelatedPins(params.id, 6);
  
  return {
    item,
    relatedPins
  };
};