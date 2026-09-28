export const BASE = "/demo/air-bnb";

export const routes = {
  explore: BASE,
  wishlists: `${BASE}/wishlists`,
  trips: `${BASE}/trips`,
  messages: `${BASE}/messages`,
  profile: `${BASE}/profile`,
  search: `${BASE}/search`,
  collection: (key: string) => `${BASE}/collections/${key}`,
  listing: (id: string) => `${BASE}/listings/${id}`,
  photos: (id: string) => `${BASE}/listings/${id}/photos`,
};

/** Pages whose cards open a listing (the zoom sources). */
export const isListingSource = (path: string) =>
  path === routes.explore ||
  path === routes.trips ||
  path.startsWith(`${BASE}/collections/`);

/** Pages that open a "see all" collection. */
export const isCollectionParent = (path: string) =>
  path === routes.explore ||
  path === routes.wishlists ||
  path === routes.search;
