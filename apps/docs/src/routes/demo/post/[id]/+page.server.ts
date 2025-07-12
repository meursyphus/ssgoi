import { getPost, getRelatedPosts } from '../mock-data';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const post = getPost(params.id);
  
  if (!post) {
    throw error(404, 'Post not found');
  }
  
  const relatedPosts = getRelatedPosts(params.id, 2);
  
  return {
    post,
    relatedPosts
  };
};