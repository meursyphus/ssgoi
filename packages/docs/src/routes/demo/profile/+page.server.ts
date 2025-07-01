import { getProfile, posts } from './mock-data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const profile = getProfile();
  
  return {
    profile,
    posts
  };
};