import { pinterestItems } from './mock-data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    items: pinterestItems
  };
};