import { getAllPosts } from './mock-data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const posts = getAllPosts();
  
  return {
    posts
  };
};